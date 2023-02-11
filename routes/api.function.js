'use strict'
const router = require('express').Router()
const authMiddleware = require("../middlewares/auth")
const infoController = require("../controllers/info")

router.use(authMiddleware)
router.post('/info', infoController.info)

  

module.exports = router