'use strict'

const { OK, CREATED, SuccessReponse } = require("../core/success.reponse")
const AccessService = require("../services/access.services")

class AccessController {
    handleRefreshToken = async (req, res, next) => {
        console.log(1)
        new SuccessReponse({
            message: 'Get Token Successed',
            metadata: await AccessService.handleRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            }),
        }).send(res)
    }
    logout = async (req, res, next) => {
        new SuccessReponse({
            message: 'Logout Successed',
            metadata: await AccessService.logout(req.keyStore),
        }).send(res)
    }
    login = async (req, res, next) => {
        new SuccessReponse({
            metadata: await AccessService.login(req.body),
        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Register OK',
            metadata: await AccessService.signUp(req.body),
            options:{
                limit: 10
            }
        }).send(res)
    }
}

module.exports = new AccessController()