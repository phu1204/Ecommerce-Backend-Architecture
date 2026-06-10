"use strict"

const mongoose = require("mongoose")
const keyTokenModel = require("../models/keyToken.model")
class KeyTokenService{
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // level 0
            // const publicKeyString = publicKey.toString()
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey
            // })
            // return tokens ?  tokens.publicKey : null

            //level #       
            const filter = { user: userId }, update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken }, options = { upsert: true, new: true}
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async ( userId ) => {
        return await keyTokenModel.findOne({ user: userId}).lean()
    }

    static removeById = async ( id ) => {
        return await keyTokenModel.deleteOne(id).lean()
    }

    static findRefreshTokenUsed = async ( {refreshToken} ) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken})
    }

    static deleteKeyById = async ( userId ) => {
        return await keyTokenModel.deleteOne({ user: userId }).lean()
    }

    static findRefreshToken = async ( {refreshToken}) => {
        return await keyTokenModel.findOne({refreshToken})
    }

}

module.exports =  KeyTokenService