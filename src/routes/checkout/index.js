const express = require('express')
const checkoutControler = require('../../controllers/checkout.controler')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

router.post("/review", asyncHandler(checkoutControler.checkoutReview))


module.exports = router