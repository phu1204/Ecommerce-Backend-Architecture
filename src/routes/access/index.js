'use strict'

const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controler.js')
const asyncHandler = require('../../helpers/asyncHandler.js')
const { authentication } = require('../../auth/authUtils.js')

router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))
//CHECK AUTH
router.use(authentication)
router.post('/shop/logout', asyncHandler(accessController.logout))

module.exports = router