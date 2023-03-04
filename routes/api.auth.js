'use strict'
const router = require('express').Router()
const authMiddleware = require("../middlewares/auth")
const authCtrl = require("../controllers/auth.c")

router.put("/", authCtrl.login)
router.post('/refresh', authCtrl.refresh)
router.use(authMiddleware) // 以下需要token ============================
router.get('/userInfo', authCtrl.userInfo)
router.delete("/", authCtrl.logout)
router.get("/agentAuthTable", authCtrl.agentAuthTable)
// router.get("/authTable", authCtrl.authTable)
router.post("/agent", authCtrl.newAgent)
router.patch("/agent", authCtrl.editAgent)
router.patch("/agentAuth", authCtrl.editAgentAuth)
router.patch('/password', authCtrl.editPassword)

module.exports = router
