'use strict'
const router = require('express').Router()
const authMiddleware = require("../middlewares/auth")
const authController = require("../controllers/auth.c")


router.put("/", authController.login)
router.post('/refresh', authController.refresh)
router.use(authMiddleware)
router.get('/userInfo', authController.userInfo)
router.delete("/", authController.logout)

//router.patch('/editPW', )

module.exports = router
