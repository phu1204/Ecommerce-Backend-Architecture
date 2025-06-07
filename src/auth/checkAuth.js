'use strict'

const findById  = require("../services/apiKey.services")

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message: 'Fobbiden Error'
            })
        }

        //check objkey
        const objKey = await findById(key)
        if(!objKey){
            return res.status(403).json({
                message: 'Fobbiden Error'
            })
        }
        req.objKey = objKey
        console.log(objKey)
        return next()

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const permission = ( permission ) => {
    return (req, res, next ) => {
        console.log(req.objKey.permissions)
        if(!req.objKey.permissions){
            return res.status(403).json({
                message: 'Permission Denieds'
            })
        }
        console.log(`Permission:`, req.objKey.permissions)
        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
             return res.status(403).json({
                message: 'Permission Denied'
            })
        } 
        return next()
    }
}

module.exports = {
    apiKey,
    permission, 
}