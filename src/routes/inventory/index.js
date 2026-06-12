const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const inventoryControler = require('../../controllers/inventory.controler')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

router.use(authenticationV2)
router.post("", asyncHandler(inventoryControler.addStockToInventory))


module.exports = router