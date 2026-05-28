'use strict'

const express = require('express')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler.js')
const { authenticationV2 } = require('../../auth/authUtils.js')
const discountController = require('../../controllers/discount.controler.js')


router.get('/product/all',asyncHandler(discountController.getAllDiscountCodes))
router.get('/shop/all',asyncHandler(discountController.getAllDiscountCodesByShop))
//CHECK AUTH
router.use(authenticationV2)

module.exports = router