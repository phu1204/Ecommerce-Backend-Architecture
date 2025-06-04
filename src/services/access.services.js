'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.services')
const createTokenPair = require('../auth/authUtils')
const getIntoData = require('../utils')
const { BadRequestError, AuthFailureError } = require('../core/error.response.js')
const findByEmail = require('./shop.services.js')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: '0001',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    // 1. check email exist ?
    // 2. check match password
    // 3. create AT and RT and save
    // 4. generate toekns
    // 5. get data return login

    static login = async({ email, password, refreshtoken = null}) => {
        const foundShop = await findByEmail({ email })

        if(!foundShop){
            throw new BadRequestError('Shop not registed')
        }

        const match = bcrypt.compare(password, foundShop.password)
        if(!match){
            throw new AuthFailureError('Authentication Error')
        }

        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')

        const { _id: userId } = foundShop

        const tokens = await createTokenPair({userId, email}, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            userId,
            refreshToken: tokens.refreshtoken,
            privateKey,
            publicKey
        })

        return {
                    shop: getIntoData({ fileds: ['_id', 'name', 'email'], object: foundShop}),
                    tokens
                }

    }

    static signUp = async ({name, email, password}) => {
        try {
            // step1: check if email exist???
            const holderShop = await shopModel.findOne({ email }).lean()
            if(holderShop){
                throw new BadRequestError("Email already exists");   
            }
            const passwordHash = await bcrypt.hash(password, 10)
            
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if(newShop){
                // Combine RSA and JWT
                // created privatekey, created publickey
                // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'   
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })

                const publicKey = crypto.randomBytes(64).toString('hex')
                const privateKey = crypto.randomBytes(64).toString('hex')

                console.log({privateKey, publicKey}) // save collection keyStore
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })
                if(!keyStore) {                 
                    throw new BadRequestError("Email already exists");   
                }
                // const publicKeyObject = await crypto.createPublicKey( publicKeyString)
                // console.log(`publicKeyObject::`, publicKeyObject)

                //create token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                console.log(`Created Token Success::`, tokens)

                return {
                    code: 201,
                    metada: {
                        shop: getIntoData({ fileds: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }

            
        } catch (error) {
            return {
                code: error.status || 500,
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports =  AccessService