"use strict";
const infoModel = require("../models/info.m");
const validate = require("../config/joi")
const generateUploadURL = require('../models/s3')

module.exports = {
  info: async (req, res) => {
    try {
      const resp = await infoModel.info(req.user.authId, req.body);
      return res.status(200).json(resp);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "伺服器內部錯誤" });
    }
  },
  // infoExcel: async (req, res) => {
  //   try {
  //     const resp = await infoModel.info(req.user.authId, req.body);
  //     return res.status(200).json(resp);
  //   } catch (e) {
  //     console.log(e);
  //     return res.status(500).json({ message: "伺服器內部錯誤" });
  //   }
  // },
  volId: async (req, res) => {
    const { error } = validate.volId(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })
    try {
      const resp = await infoModel.volId(req.body);
      return res.status(200).json(resp);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "伺服器內部錯誤" });
    }
  },
  picUrl: async (req, res)=>{
    const url = await generateUploadURL(req.query.params)
    res.send({url})
  },
  newVol: async(req, res) => { 
    const { error } = validate.newVol(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: errors });
    }
    try {
      const resp = await infoModel.newVol(req.user.id, req.body);
      return res.status(200).json(resp);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "伺服器內部錯誤" });
    }
  },
  editPage: async(req, res) => { 
    const { error } = validate.editPage(req.params.volId, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: errors });
    }
    try {
      const resp = await infoModel.editPage(req.user.authId, req.params.volId);
      return res.status(200).json(resp);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "伺服器內部錯誤" });
    }
  },
  editVol: async(req, res) => { 
    const { error } = validate.editVol(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: errors });
    }
    try {
      const resp = await infoModel.editVol(req.user.id, req.body);
      return res.status(200).json(resp);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "伺服器內部錯誤" });
    }
  },
  intoGroup: async(req, res) => { 
    try {
      const resp = await infoModel.intoGroup(req.user.id, req.body);
      return res.status(200).json(resp);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "伺服器內部錯誤" });
    }
  },

};
