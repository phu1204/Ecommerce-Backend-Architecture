"use strict"

const JWT =  require("jsonwebtoken")
const asyncHandler = require("../helpers/asyncHandler")
const {  AuthFailureError } = require("../core/error.response")
const { findByUserId } = require("../services/keyToken.services")

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // accessToken
        const accessToken = await JWT.sign( payload, publicKey, {
            expiresIn: '2 days'
        }) 

        const refreshtoken = await JWT.sign( payload, privateKey, {
            expiresIn: '7 days',
        })

        //

        JWT.verify( accessToken, publicKey, (err, decode) => {
            if(err){
                console.error(`Error verify::`, err)
            }else{
                console.log(`Decode verify::`, decode)
            }
        })
        
        return { accessToken, refreshtoken }

    } catch (error) {
        
    }
}

const authentication = asyncHandler( async (req, res, next) => {
     /* 
        1// check id missing
        2/ get accessToken
        3/ verify token
        4/ check user in db
        5/ check keyStore vs user
        6/ okk -> return next()
    */

    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId)  throw new AuthFailureError('Invalid Request')

    const keyStore = await findByUserId(userId)
    console.log(keyStore)
    if(!keyStore) throw new NotFoundError('Not Found KeyStore')
        const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new NotFoundError('Invalid Request')
        
        try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }

})

module.exports = {
    createTokenPair,
    authentication
}