'use strict'

const { OK, CREATED, SuccessReponse } = require("../core/success.reponse")
const AccessService = require("../services/access.services")

class AccessController {
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