'use strict';
const express = require('express')
const router = express.Router()

router.get("/board", (req, res) => {
  res.render("board.html")
})
  
router.get("/info", (req, res) => {
  res.render("info.html")
})

router.get("/newVol", (req, res) => {
  res.render("vol.html")
})

router.get("/edit/:volID", (req, res) => {
  console.log(req.params.volId);
  res.render("vol.html")
})

router.get("/train", (req, res) => {
  res.render("train.html")
  })

module.exports = router