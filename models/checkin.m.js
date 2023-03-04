const db = require("../config/db")
const moment = require("moment")
const today = moment().format("YYYYMMDD")-19110000
const time = moment().format("HHmm").toString()

module.exports = {
    type: async (id) => {
        try {
            const sql = `WITH cki AS (
                SELECT 
                    c.vol_id, c.id AS checkin_id, c.group_id, c.subgroup, 
                    c.start_time, c.end_time, 
                    s.name AS group_name
                FROM checkin c
                LEFT JOIN subgroup s ON c.group_id = s.group_id AND c.subgroup = s.subgroup
                WHERE c.vol_id = ? AND c.date = ?
                ORDER BY c.id DESC LIMIT 1),
                g AS (SELECT vol_id, JSON_ARRAYAGG(CONCAT(group_id, subgroup)) group_list
                FROM vol_group WHERE vol_id = ? AND status = 1)
                SELECT name, g.group_list, cki.* FROM vol 
                LEFT JOIN cki ON cki.vol_id = vol.vol_id
                LEFT JOIN g ON g.vol_id = vol.vol_id
                WHERE vol.vol_id = ?`
            const val = [id, today, id, id]
            const data = await db.query(sql, val)
            return {data : data[0]}
        }catch(err){
            console.error(err)
            return err
        }
    },
    start: async (d) => {
        try {
            const sql = `
            INSERT checkin (vol_id, date, group_id, subgroup, start_time)
            VALUES (?, ?, ?, ?, ?)`
            const val = [d.vol_id, today, d.group.substr(0, 2), d.group.substr(2, 1), time]
            const res = await db.query(sql, val)
            if (res[0].affectedRows)
            return {message: "ok"}
            throw new Error("No rows affected")
        }catch(err){
            console.error(err)
            return err
        }
    },
    end: async (id) => {
        try {
            const res = await db.query(`CALL checkout(?)`, id)
            if (res[0].affectedRows)
            return {message: "ok"}
            throw new Error("No rows affected")
        }catch(err){
            console.error(err)
            return err
        }
    },
}