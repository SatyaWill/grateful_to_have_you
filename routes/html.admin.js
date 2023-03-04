"use strict";
const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/board", (req, res) => {
  res.render("init/board.html", { layout: false });
});

router.get("/info", (req, res) => {
  res.render("info/info.html", { title: "志工資料" });
});

router.get("/info/newVol", (req, res) => {
  res.render("info/new.html", { title: "新增志工" });
});

router.get("/info/edit/:volId", (req, res) => {
  res.render("info/edit.html", { title: "志工資料" });
});

router.get("/checkin", (req, res) => {
  res.render("hours/checkin.html", { title: "簽到(退)" });
});

router.get("/audit", (req, res) => {
  res.render("hours/audit.html", { title: "時數管理" });
});

router.get("/stats", (req, res) => {
  res.render("hours/stats.html", { title: "時數統計" });
});

router.get("/honor", (req, res) => {
  res.render("hours/honor.html", { title: "獎勵作業" });
});

router.get("/train", (req, res) => {
  res.render("admin/train.html", { title: "訓練資料" });
});

router.get("/auth", (req, res) => {
  res.render("admin/auth.html", { title: "權限管理" });
});

module.exports = router;
