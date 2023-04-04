'use strict'
const jwt = require("jsonwebtoken")
const authModel = require("../models/auth.m")
const redis = require('../models/redis')
const validate = require("../config/joi")
require("dotenv").config()
const exSecs = process.env.REFRESH_HRS*60*60

module.exports = {
    login: async (req, res) => {
        try {
            const { id , password } = req.body
            const resp = await authModel.login(id, password)
            if (resp){
                const user = { id: id, authId: resp.authId }
                const userInfo = { name: resp.name, authId: resp.authId }
                const accessToken = access(user)
                const refreshToken = refresh(user)
                redis.setToken(refreshToken, exSecs)
                res.cookie('jwt', refreshToken, {httpOnly: true, SameSite: "None", maxAge: exSecs*1000 })
                return res.status(200).json({message:"ok", accessToken, userInfo})
            }else{
                return errInfo(res, 422, 'Invalid credentials')
            }
        }catch(err) {
            console.log(err)
            return errInfo(res, 500, '伺服器內部錯誤')
        }
    },
    refresh: async (req, res) => {
        try{
            if (!req.cookies?.jwt) return errInfo(res, 403, 'cookie裡沒有token')
            
            const refreshToken = await req.cookies.jwt
            const isToken = await redis.get(refreshToken)
            if (!isToken) return errInfo(res, 403, 'server沒有此token')

            jwt.verify(refreshToken, process.env.REFRESH_JWT, (err, user) => {
                if (err) return errInfo(res, 403, 'token錯誤')
                const accessToken = access({id: user.id, authId: user.authId})
                return res.status(200).json({message:"ok", accessToken: accessToken})
            })
        }catch(e) {
            console.log(e)
            return errInfo(res, 500, "伺服器內部錯誤")
        }
    },
    userInfo: async (req, res) => { 
        try{
            const resp = await authModel.userinfo(req.user.id)
            return res.status(200).json({message:"ok", "userInfo": resp})
        }catch(e){
            console.log(e)
            return errInfo(res, 500, "伺服器內部錯誤")
        }
    },
    logout (req, res) {
        redis.del(req.cookies.jwt)
        res.clearCookie('jwt').sendStatus(204)
    },
    agentAuthTable: async (req, res) => {
        try{
            const resp = await authModel.agentAuthTable(req.user.authId)
            return res.status(200).json(resp)
        }catch(e){
            console.log(e)
            return errInfo(res, 500, "伺服器內部錯誤")
        }
    },
    newAgent: async (req, res) => {
        const { error } = validate.newAgent(req.body, { abortEarly: false });
        if (error) {
          const errors = error.details.map((detail) => detail.message);
          return res.status(400).json({ message: errors });
        }
        try{
            const resp = await authModel.newAgent(req.user.authId, req.body)
            return res.status(200).json(resp)
        }catch(e){
            console.log(e)
            return errInfo(res, 500, "伺服器內部錯誤")
        }
    },
    editAgent: async (req, res) => {
        const { error } = validate.editAgent(req.body, { abortEarly: false });
        if (error) {
          const errors = error.details.map((detail) => detail.message);
          return res.status(400).json({ message: errors });
        }
        try{
            const resp = await authModel.editAgent(req.user.authId, req.body)
            return res.status(200).json(resp)
        }catch(e){
            console.log(e)
            return errInfo(res, 500, "伺服器內部錯誤")
        }
    },
    editAgentAuth: async (req, res) => {
        try{
            const resp = await authModel.editAgentAuth(req.user.authId, req.body)
            return res.status(200).json(resp)
        }catch(e){
            console.log(e)
            return errInfo(res, 500, "伺服器內部錯誤")
        }
    },
    editPassword: async (req, res) => {
        try {
            const resp = await authModel.editPassword(req.user.id, req.body)
            return res.status(200).json(resp)
        }catch(e) {
            console.log(e)
            return errInfo(res, 500, "伺服器內部錯誤")
        }
    },
}

function access(user) {
    return jwt.sign(user, process.env.ACCESS_JWT, {expiresIn: process.env.ACCESS_TIME})
}
function refresh(user) {
    return jwt.sign(user, process.env.REFRESH_JWT, {expiresIn: exSecs})
}

function errInfo(res, num, msg) {
    return res.status(num).json({message: msg })
}
      

