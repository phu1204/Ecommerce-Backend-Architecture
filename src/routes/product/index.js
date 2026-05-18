'use strict'

const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product.controler.js')
const asyncHandler = require('../../helpers/asyncHandler.js')
const { authenticationV2 } = require('../../auth/authUtils.js')

//CHECK AUTH
router.get('/search/:keySearch', asyncHandler(productController.searchProductByUser))
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))

router.use(authenticationV2)

router.patch('/:product_id', asyncHandler(productController.updateProduct))
router.post('', asyncHandler(productController.createProduct))
router.get('/draft/all', asyncHandler(productController.findAllDraft))
router.get('/published/all', asyncHandler(productController.findAllPublished))
router.put('/publish/:id', asyncHandler(productController.publishedProductByShop))

module.exports = router