'use strict'
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const authModel = require("../models/auth.m")
require("dotenv").config()

let tokenList = []
module.exports = {
    login: async (req, res) => {
        try {
            const { id , password } = req.body
            const resp = await authModel.password(id)
            if (!bcrypt.compareSync(password, resp.password)) return errInfo(res, 422, 'Invalid credentials')
            const user = { id: id, authId: resp.authId }
            tokenList.push(refresh(user))
            const accessToken = access(user)
            const refreshToken = refresh(user)
            res.cookie('jwt', refreshToken, {httpOnly: true, SameSite: "None", maxAge: 8*60*60*1000 })
            return res.status(200).json({message:"ok", accessToken: accessToken})
        }catch(e) {
            console.log(e)
            return errInfo(res, 500, "伺服器內部錯誤")
        }
    },

    refresh: async (req, res) => {
        try{
            if (!req.cookies?.jwt) return errInfo(res, 403, 'cookie裡沒有token')
            
            const refreshToken = req.cookies.jwt
            if (!tokenList.includes(refreshToken)) return errInfo(res, 403, 'server沒有此token')
        
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
    logout: async (req, res) => {
        tokenList = await tokenList.filter(token => token !== req.cookies.jwt)
        res.clearCookie('jwt').sendStatus(204)
    },
    /*editPW: async (req, res) => {
    try {
        const token = req.body.token
        if (token == null) return res.sendStatus(401)
        jwt.verify(token, process.env.REFRESH_JWT, (err, user) => {
        if (err) return res.sendStatus(403)
        const { oldPW , newPW } = req.body.oldPW
        
        })
    
        const { id , password } = req.body
        const hashPW = await bcrypt.hashSync(password, 12)
        console.log("a",hashPW)
        const [rows,fields] = await db.query("SELECT password FROM agent WHERE id=?" ,[id])
        console.log("b",rows[0].password)
        console.log(bcrypt.compareSync(password, rows[0].password))
    }catch(e) {
        console.log(e)
        res.status(500).send()
    }*/
}

function access(user) {
    return jwt.sign(user, process.env.ACCESS_JWT, {expiresIn: process.env.ACCESS_TIME})
}
function refresh(user) {
    return jwt.sign(user, process.env.REFRESH_JWT, {expiresIn: process.env.REFRESH_TIME})
}

function errInfo(res, num, msg) {
    return res.status(num).json({message: msg })
}
      

