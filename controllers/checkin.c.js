"use strict";
const checkinModel = require("../models/checkin.m");

module.exports = {
    type: async (req, res) => {
        try {
            const resp = await checkinModel.type(req.params.volId);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
    start: async (req, res) => {
        try {
            const resp = await checkinModel.start(req.body);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
    end: async (req, res) => {
        try {
            const resp = await checkinModel.end(req.body.checkin_id);
            return res.status(200).json(resp);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },

}