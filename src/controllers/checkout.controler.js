'use strict'

const { SuccessReponse } = require("../core/success.reponse")
const CheckoutService = require("../services/checkout.services")

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessReponse({
            message: 'Created Discount Success',
            metadata: await CheckoutService.checkoutReview(req.body),
        }).send(res) 
    }
}

module.exports = new CheckoutController()