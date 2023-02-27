"use strict";
const hourAuditModel = require("../models/hourAudit.m");
const validate = require("../config/joi")

module.exports = {
    get: async (req, res) => {
        try {
            const resp = await hourAuditModel.get(req.user.authId);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
    edit: async (req, res) => {
        const { error } = validate.editAudit(req.body, { abortEarly: false });
        if (error) {
          const errors = error.details.map((detail) => detail.message);
          return res.status(400).json({ message: errors });
        }
        try {
            const resp = await hourAuditModel.edit(req.user.id, req.body);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
    toRecords: async (req, res) => {
        try {
            const resp = await hourAuditModel.toRecords(req.user.id, req.body);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
    newRecord: async (req, res) => {
        try {
            const resp = await hourAuditModel.newRecord(req.user.id, req.body);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
    editRecord: async (req, res) => {
        try {
            const resp = await hourAuditModel.editRecord(req.user.id, req.body);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
}