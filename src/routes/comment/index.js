'use strict'

const express = require('express')
const router = express.Router()
const commentController = require('../../controllers/comment.controler.js')
const asyncHandler = require('../../helpers/asyncHandler.js')
const { authenticationV2 } = require('../../auth/authUtils.js')


router.use(authenticationV2)
router.post('', asyncHandler(commentController.createComment))

module.exports = router