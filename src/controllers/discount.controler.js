'use strict'

const { SuccessReponse } = require("../core/success.reponse")
const DiscountService = require("../services/discount.servies")

class DiscountController {
    createDiscount = async (req, res, next) => {
        new SuccessReponse({
            message: 'Created Discount Success',
            metadata: await DiscountService.createDiscount({ ...req.body, discount_shop: req.user.userId }),
        }).send(res) 
    }
    updateDiscount = async (req, res, next) => {
        new SuccessReponse({
            message: 'Updated Discount Success',
            metadata: await DiscountService.updateDiscountCode({ ...req.body, userId: req.user.userId }),
        }).send(res)    
    }
    getAllDiscountCodes = async (req, res, next) => {
        new SuccessReponse({
            message: 'Get All Discount Codes Success',
            metadata: await DiscountService.getAllDiscountCodes({shopId: req.user.userId }),
        }).send(res)    
    }
    getAllDiscountCodesByShop = async (req, res, next) => {
        new SuccessReponse({
            message: 'Get All Discount Codes By Shop Success',
            metadata: await DiscountService.getAllDiscountCodesByShop({ shopId: req.user.userId }),
        }).send(res)    
    }
}

module.exports = new DiscountController()