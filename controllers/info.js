'use strict'
const infoModel = require("../models/info.m")

module.exports = {
    info: async (req, res) => { 
        try{
            const resp = await infoModel.info(req.body)
            return res.status(200).json({message:"ok", data: resp})
        }catch(e){
            console.log(e)
            return res.status(500).json({message: "伺服器內部錯誤" })
        }
    },
}

