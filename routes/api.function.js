'use strict'
const router = require('express').Router()
const authMiddleware = require("../middlewares/auth")
const infoController = require("../controllers/info.c")

router.use(authMiddleware)
router.post('/info', infoController.info)
// router.post('/infoExcel', infoController.infoExcel)
/* 目前暫時用code建，要改的地方:
資料庫建sector表、改subgroup表、前端API info vol.js檔 後端mc檔
設計先從redis撈？待研究
*/
// router.get('/infoSectorGroup', infoController.infoSectorGroup)
// router.get('/volGroup', infoController.volGroup)
router.post('/volId', infoController.volId)
router.get('/picUrl', infoController.picUrl)
router.post('/newVol', infoController.newVol)
router.post('/editPage/:volId', infoController.editPage)
router.patch('/editVol', infoController.editVol)
router.patch('/intoGroup', infoController.intoGroup)

module.exports = router