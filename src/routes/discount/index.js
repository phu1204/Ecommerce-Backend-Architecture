'use strict'

const express = require('express')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler.js')
const { authenticationV2 } = require('../../auth/authUtils.js')
const discountController = require('../../controllers/discount.controler.js')


router.post('/amount',asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code',asyncHandler(discountController.getAllDiscountCodesWithProduct))

//CHECK AUTH
// router.use(authenticationV2)
router.post('', asyncHandler(discountController.createDiscount))
router.get('',asyncHandler(discountController.getAllDiscountCodes))

module.exports = router