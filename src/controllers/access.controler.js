'use strict'

const AccessService = require("../services/access.services")

class AccessController {
    signUp = async (req, res, next) => {
        console.log(req.body)
        try {
         
            return res.status(201).json(await AccessService.signUp(req.body))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AccessController()