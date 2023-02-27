'use strict'
const router = require('express').Router()
const authMiddleware = require("../middlewares/auth")
const infoCtrl = require("../controllers/info.c")
const checkinCtrl = require("../controllers/checkin.c")
const hourCriteriaCtrl = require("../controllers/hourCriteia.c")
// const hourAuditCtrl = require("../controllers/hourAudit.c")
// const hourStatsCtrl = require("../controllers/hourStats.c")
router.use(authMiddleware)
router.post('/info', infoCtrl.info)
// router.post('/infoExcel', infoCtrl.infoExcel)
/* 目前暫時用code建，要改的地方:
資料庫建sector表、改subgroup表、前端API info vol.js檔 後端mc檔
設計先從redis撈？待研究
*/
// router.get('/infoSectorGroup', infoCtrl.infoSectorGroup)
// router.get('/volGroup', infoCtrl.volGroup)
router.post('/volId', infoCtrl.volId)
router.get('/picUrl', infoCtrl.picUrl)
router.post('/newVol', infoCtrl.newVol)
router.post('/editPage/:volId', infoCtrl.editPage)
router.patch('/editVol', infoCtrl.editVol)
router.patch('/intoGroup', infoCtrl.intoGroup)
// 時數標準
router.get('/hourCriteria', hourCriteriaCtrl.get)
router.post('/hourCriteria', hourCriteriaCtrl.new)
router.patch('/hourCriteria', hourCriteriaCtrl.edit)
// 簽到 (退)
router.get('/checkin/:volId', checkinCtrl.type)
router.post('/checkin', checkinCtrl.start)
router.patch('/checkin', checkinCtrl.end)
// 獲取待審核的簽到資料
// router.get('/hourAudit', hourAuditCtrl.get)
// router.patch('/hourAudit', hourAuditCtrl.edit)
// 將審核通過的簽到資料加入紀錄，並更新對應簽到記錄的recordId
// router.post('/hourRecords', hourAuditCtrl.toRecords)
// router.post('/hourRecord', hourAuditCtrl.newRecord) // 新增單筆紀錄
// router.patch('/hourRecord', hourAuditCtrl.editRecord) // 修改單筆紀錄

// 時數統計
// router.get('/hourStats/years', hourStatsCtrl.years)
// router.get('/hourStats/month', hourStatsCtrl.month)
// router.get('/hourStats/semester', hourStatsCtrl.semester)
// router.get('/hourStats/groupMember', hourStatsCtrl.groupMember)

module.exports = router