'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.services')
const {createTokenPair, verifyJWT} = require('../auth/authUtils')
const getIntoData = require('../utils')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response.js')
const findByEmail = require('./shop.services.js')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: '0001',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    //check this token used?
    static handleRefreshToken = async ({ keyStore, user, refreshToken }) => {
        console.log(keyStore)
            //check who use this token
        const { userId, email } = user

        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            // delete all token
            await KeyTokenService.deleteKeyById( userId ) 
            throw new ForbiddenError('Somthing wrong !!! Please ReLogin')
        }  
        // IF NO
        if(keyStore.refreshToken != refreshToken) throw new AuthFailureError('Shop not Registed')
                    
        //check userId
        const foundShop = await findByEmail({ email })
        if(!foundShop) throw new AuthFailureError('Shop not Registed')

        //create double token
        const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)

        const holderToken = await KeyTokenService.findRefreshToken({refreshToken})
        //update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // da duoc su sung de lay token moi roi
            }
        })

        return {
            user,
            tokens
        }  
    }

    static logout = async(keyStore) => {
        return await KeyTokenService.removeById(keyStore._id)
    }

    // #login
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
            refreshToken: tokens.refreshToken,
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