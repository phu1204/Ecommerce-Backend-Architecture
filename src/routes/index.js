'use strict'

const express = require('express')
const {apiKey,permission} = require('../auth/checkAuth')
const router = express.Router()

//CHECK API-KEY
router.use(apiKey)
//CHECK PERMISSION
router.use(permission('0000'))

router.use('/v1/api', require('./access'))


module.exports = router