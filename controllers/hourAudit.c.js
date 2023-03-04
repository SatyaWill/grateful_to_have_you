"use strict";
const hourAuditModel = require("../models/hourAudit.m");
const validate = require("../config/joi")

module.exports = {
    count: async (req, res) => {
        try {
            const resp = await hourAuditModel.count(req.user.authId, req.params.isAuditOver, req.params.month);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
    get: async (req, res) => {
        try {
            const resp = await hourAuditModel.get(req.params.isAuditOver, req.params.month, req.params.group);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
    batchEdit: async (req, res) => {
        const { error } = validate.batchEdit(req.body, { abortEarly: false });
        if (error) {
          const errors = error.details.map((detail) => detail.message);
          return res.status(400).json({ message: errors });
        }
        try {
            const resp = await hourAuditModel.batchEdit(req.user.id, req.body);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
    manualEdit: async (req, res) => {
        const { error } = validate.manualEdit(req.body, { abortEarly: false });
        if (error) {
          const errors = error.details.map((detail) => detail.message);
          return res.status(400).json({ message: errors });
        }
        try {
            const resp = await hourAuditModel.manualEdit(req.user.id, req.body);
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