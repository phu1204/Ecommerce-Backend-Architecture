'use strict'

const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controler.js')
const { asyncHandler } = require('../../auth/checkAuth.js')

router.post('/shop/signup', asyncHandler(accessController.signUp))

module.exports = router