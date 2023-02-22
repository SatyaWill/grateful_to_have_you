"use strict";
const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/board", (req, res) => {
  res.render("board.html", { layout: false });
});

router.get("/info", (req, res) => {
  res.render("info/info.html", { title: "志工資料" });
});

router.get("/newVol", (req, res) => {
  res.render("info/new.html", { title: "新增志工" });
});

router.get("/edit/:volId", (req, res) => {
  res.render("info/edit.html", { title: "志工資料" });
});

router.get("/train", (req, res) => {
  res.render("train.html"), { title: "訓練資料" };
});

module.exports = router;
