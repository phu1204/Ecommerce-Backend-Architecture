'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.services')
const createTokenPair = require('../auth/authUtils')
const getIntoData = require('../utils')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: '0001',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            // step1: check if email exist???
            const holderShop = await shopModel.findOne({ email }).lean()
            if(holderShop){
                return {
                    code: 'xxxx',
                    message: 'Shop already registed'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)
            
            const newShop = await shopModel.create({
                name, email, passwordHash, roles: [RoleShop.SHOP]
            })

            if(newShop){
                // created privatekey, created publickey
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'   
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                })
                
                console.log({privateKey, publicKey}) // save collection keyStore
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })
    
                if(!publicKeyString) {
                    return {
                        code: 'xxx',
                        message: 'publicKeyString error'
                    }
                }
                const publicKeyObject = await crypto.createPublicKey( publicKeyString)
                console.log(`publicKeyObject::`, publicKeyObject)

                //create token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKeyObject, privateKey)
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
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports =  AccessService