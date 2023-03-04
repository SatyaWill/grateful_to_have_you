"use strict";
const hourCriteiaModel = require("../models/hourCriteia.m");
const validate = require("../config/joi")

module.exports = {
    get: async (req, res) => {
        try {
            const resp = await hourCriteiaModel.get(req.user.authId);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
    new: async (req, res) => {
        const { error } = validate.newCriteria(req.body, { abortEarly: false });
        if (error) {
          const errors = error.details.map((detail) => detail.message);
          return res.status(400).json({ message: errors });
        }
        try {
            const resp = await hourCriteiaModel.new(req.user.id, req.body);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
    edit: async (req, res) => {
        const { error } = validate.editCriteria(req.body, { abortEarly: false });
        if (error) {
          const errors = error.details.map((detail) => detail.message);
          return res.status(400).json({ message: errors });
        }
        try {
            const resp = await hourCriteiaModel.edit(req.user.id, req.body);
            return res.status(200).json(resp);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "伺服器內部錯誤" });
        }
    },
}