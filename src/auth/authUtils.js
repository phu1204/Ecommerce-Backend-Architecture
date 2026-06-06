"use strict"

const JWT =  require("jsonwebtoken")
const asyncHandler = require("../helpers/asyncHandler")
const {  AuthFailureError, NotFoundError } = require("../core/error.response")
const { findByUserId } = require("../services/keyToken.services")
const findByEmail = require("../services/shop.services")

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    REFRESHTOKEN: 'x-rtoken-id'      
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // accessToken
        const accessToken = await JWT.sign( payload, publicKey, {
            expiresIn: '2 days'
        }) 

        const refreshToken = await JWT.sign( payload, privateKey, {
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
        
        return { accessToken, refreshToken }

    } catch (error) {
        
    }
}

const authenticationV2 = asyncHandler( async (req, res, next) => {
     /* 
        1// check id missing
        2/ get accessToken
        3/ verify token
        4/ check user in db
        5/ check keyStore vs user
        6/ okk -> return next()
    */

   const userId = req.headers[HEADER.CLIENT_ID]
   if(!userId)  throw new AuthFailureError('Invalid Request',)

    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new AuthFailureError('Not Found KeyStore')
        
    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    } throw new AuthFailureError('Not Found RefreshToken')
})

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
    if(!keyStore) throw new NotFoundError('Not Found KeyStore')
        const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new NotFoundError('Invalid Request')  
        try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
}