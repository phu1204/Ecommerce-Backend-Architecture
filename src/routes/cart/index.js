const express = require('express')
const cartControler = require('../../controllers/cart.controler')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

router.post("", asyncHandler(cartControler.addItemCart))
router.get("", asyncHandler(cartControler.getListItemCart))
router.post("/update", asyncHandler(cartControler.updateItemCart))
router.delete("", asyncHandler(cartControler.deleteItemCart))

module.exports = router