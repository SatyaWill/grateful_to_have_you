'use strict'
const router = require('express').Router()
const authMiddleware = require("../middlewares/auth")
const infoCtrl = require("../controllers/info.c")
const checkinCtrl = require("../controllers/checkin.c")
const hourCriteriaCtrl = require("../controllers/hourCriteia.c")
const hourAuditCtrl = require("../controllers/hourAudit.c")
const hourStatsCtrl = require("../controllers/hourStats.c")
router.use(authMiddleware)
router.post('/info', infoCtrl.info)
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
router.get('/hourAuditCount/:isAuditOver/:month', hourAuditCtrl.count)
router.get('/hourAudit/:isAuditOver/:month/:group', hourAuditCtrl.get)
router.patch('/hourAudit/batch', hourAuditCtrl.batchEdit)
router.patch('/hourAudit/manual', hourAuditCtrl.manualEdit)
// 將審核通過的簽到資料加入紀錄，並更新對應簽到記錄的recordId
router.post('/hourRecords', hourAuditCtrl.toRecords)
// router.post('/hourRecord', hourAuditCtrl.newRecord) // 新增單筆紀錄
// router.patch('/hourRecord', hourAuditCtrl.editRecord) // 修改單筆紀錄

// 時數統計
router.get('/hourStats/years/:volId', hourStatsCtrl.years)
// router.get('/hourStats/month', hourStatsCtrl.month)
// router.get('/hourStats/semester', hourStatsCtrl.semester)
router.get('/hourStats/groupMember/:year/:group', hourStatsCtrl.groupMember)

module.exports = router