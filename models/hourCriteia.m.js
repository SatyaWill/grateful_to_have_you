const db = require("../config/db")
const moment = require("moment")
const today = moment().format("YYYYMMDD")-19110000
const thisYear = moment().format("YYYY")-1911
const now = moment().format("YYYY-MM-DD hh:mm:ss").toString()

module.exports = {
    get: async (authId) => {
        try {
            const auth = authId.map(value => `${value}`).join('|');
            const parm = auth === "All" ?  "" : `WHERE c.group_id REGEXP '^(${auth})'`
            const sql = `
            SELECT 
                c.id, c.name,
                c.group_id,
                c.subgroup, 
                s.name AS group_name,
                c.start_time, 
                c.end_time,
                is_active, 
                if (editor.name, editor.name, founder.name) handler_name,
                DATE_FORMAT(if (c.chg_time, c.chg_time, c.time),'%Y%m%d')-19110000 AS handle_time
            FROM criteria c
            LEFT JOIN agent AS editor ON c.editor_id = editor.id
            LEFT JOIN agent AS founder ON c.founder_id = founder.id
            LEFT JOIN subgroup s ON c.group_id = s.group_id AND c.subgroup = s.subgroup
            ${parm} ORDER BY id`
            const data = await db.query(sql)
            return {data : data[0]}
        }catch(e){
            console.error(e)
            return e
        }
    },
    new: async (id, d) => {
        try {
            const sql = `
            INSERT criteria 
            (name, group_id, subgroup, start_time, end_time, is_active, founder_id, editor_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
            const val = [d.name, d.group_id, d.subgroup, d.start_time, d.end_time, "Y", id,""]
            const res = await db.query(sql, val)
            if (res[0].affectedRows)
            return {message: "ok"}
            throw new Error("No rows affected")
        }catch(err){
            console.error(err)
            return err
        }
    },
    edit: async (id, d) => {
        try {
            const sql = `UPDATE criteria SET
            start_time=?, end_time=?, is_active=?, 
            editor_id=?, chg_time=?  WHERE id=?`
            const val = [d.start_time, d.end_time, d.is_active, id, now, d.id]
            const res = await db.query(sql, val)
            if (res[0].affectedRows)
            return {message: "ok"}
            throw new Error("No rows affected")
        }catch(err){
            console.error(err)
            return err
        }
    },

}