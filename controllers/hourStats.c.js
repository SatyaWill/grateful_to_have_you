"use strict";
const hourStatsModel = require("../models/hourStats.m");

module.exports = {
    years: async (req, res) => {
        try {
            const resp = await hourStatsModel.years(req.params.volId);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
    groupMember: async (req, res) => {
        try {
            const resp = await hourStatsModel.groupMember(req.params.year, req.params.group);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
}