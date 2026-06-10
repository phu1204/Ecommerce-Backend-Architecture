'use strict'

const { SuccessReponse } = require("../core/success.reponse")
const DiscountService = require("../services/discount.services")

class DiscountController {
    createDiscount = async (req, res, next) => {
        new SuccessReponse({
            message: 'Created Discount Success',
            metadata: await DiscountService.createDiscountCode({ ...req.body }, req.user.userId),
        }).send(res) 
    }
    updateDiscount = async (req, res, next) => {
        new SuccessReponse({
            message: 'Updated Discount Success',
            metadata: await DiscountService.updateDiscountCode({ ...req.body }),
        }).send(res)    
    }
    getAllDiscountCodes = async (req, res, next) => {
        new SuccessReponse({
            message: 'Get All Discount Codes Success',
            metadata: await DiscountService.getAllDiscountCodes(req.query.shopId),
        }).send(res)    
    }
    getAllDiscountCodesWithProduct = async (req, res, next) => {
        new SuccessReponse({
            message: 'Get All Discount Codes With Product Success',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({...req.query}),
        }).send(res)    
    }
    getDiscountAmount = async (req, res, next) => {
        new SuccessReponse({
            message: 'Get Discount Amount Success',
            metadata: await DiscountService.getDiscountAmount({ ...req.body }),
        }).send(res)    
    }
}

 module.exports = new DiscountController()