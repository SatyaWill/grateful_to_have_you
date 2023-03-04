const db = require("../config/db")
const bcrypt = require('bcrypt');
const moment = require("moment");
const now = moment().format("YYYY-MM-DD HH:mm:ss").toString();

console.log(now);
module.exports = {
    login: async (id, password) => {
        try {
            const sql = `
            SELECT a.name, a.password, JSON_Arrayagg(b.auth_id) authId
            FROM agent a ,agent_auth b 
            WHERE a.id=b.agent_id AND a.id=? AND b.status="Y"
            GROUP BY a.id`
            const data = await db.query(sql ,[id])
            const user = data[0][0]
            if (!bcrypt.compareSync(password, user.password)) {
                throw new Error('Invalid credentials')
            }
            return user
        }catch(e){
            console.error(e)
            return e
        }
    },
    userinfo: async (id) => {
        try {
            const sql = `
            SELECT a.id, a.name, JSON_Arrayagg(b.auth_id) auth_id
            FROM agent a ,agent_auth b 
            WHERE a.id=b.agent_id AND a.id=? AND b.status="Y"
            GROUP BY a.id`
            const data = await db.query(sql ,[id])
            return data[0][0]
        }catch(e){
            console.error(e)
            return e
        }
    },
    agentAuthTable: async (authId) => {
        try {
            if (!authId.includes("All")) return
            const data = await db.query("CALL auth_agent_table()")
            return { data: data[0][0] }
        } catch (err) {
            console.error(err);
            return err;
        }
    },
    // authTable: async (authId) => {
    //     try {
    //         if (!authId.includes("All")) return
    //         const data = await db.query("CALL auth_table()")
    //         return data[0][0]
    //     } catch (err) {
    //         console.error(err);
    //         return err;
    //     }
    // },
    newAgent: async (authId, d) => {
        try {
            if (!authId.includes("All")) return
            // # id, password, name, time, status, chg_time
            // # agent_id, auth_id, status, time, chg_time

            const pw =  bcrypt.hashSync(d.id.trim(), 12)
            const sql = `INSERT agent (id,password,name) VALUES(?,?,?)` 
            const sql2 = `INSERT agent_auth (agent_id, auth_id)
                          VALUES ${d.auth_id.map(i => `('${d.id}', '${i}')`).join()}`

            const res = await db.query(sql, [d.id.trim(), pw, d.name])
            if (d.auth_id.length>0) { await db.query(sql2) }
            if (res[0].affectedRows)
            return {message: "ok"}
            throw new Error("No rows affected")
        } catch (err) {
            console.error(err)
            return { error: err.message }
        }
    },
    editAgent: async (authId, d) => {
        try {
            if (!authId.includes("All")) return
            const hashPW =  bcrypt.hashSync(d.password, 12)
            const param = d.id === "public" && d.password ? `, password='${hashPW}'` : ""

            const sql = `UPDATE agent SET name=?, status=?, chg_time='${now}'${param} WHERE id =?`
            const res = await db.query(sql, [d.name.trim(), d.status, d.id])
            if (res[0].affectedRows)
            return {message: "ok"}
            throw new Error("No rows affected")
        } catch (err) {
            console.error(err);
            return err;
        }
    },
    editAgentAuth: async (authId, d) => {
        try {
            const add = d.add_auth_id
            const rm = d.rm_auth_id
            if (!authId.includes("All") || !(add.length+rm.length)) return
            // # agent_id, auth_id, status, time, chg_time
            const addSql =`
            INSERT agent_auth (agent_id, auth_id, time)
            VALUES ${add.map(i => `('${d.id}', '${i}', '${now}')`).join()}
            ON DUPLICATE KEY UPDATE status="Y", chg_time="${now}" `
           
            const rmSql = `
              UPDATE agent_auth SET status="N", chg_time="${now}" 
              WHERE agent_id="${d.id}" AND auth_id REGEXP "(?:${rm.join('|')})"`

            await db.query('START TRANSACTION')
            if (add.length !== 0) { await db.query(addSql) }
            if (rm.length !== 0) { await db.query(rmSql) }
            await db.query('COMMIT')
            return { message: 'ok' };
        } catch (err) {
            await db.query('ROLLBACK')
            console.error(err)
            return { error: err.message }
        }
    },
    editPassword: async (id, d) => {
        try {
            const data = await db.query(`SELECT password FROM agent WHERE id='${id}'`)
            if (!bcrypt.compareSync(d.old_pw, data[0][0].password)) {
                throw new Error('password error')
            } else {
                const hashPW =  bcrypt.hashSync(d.new_pw, 12)
                const sql = `UPDATE agent SET 
                             password='${hashPW}', chg_time='${now}' WHERE id='${id}'`
                const res = await db.query(sql)
                if (res[0].affectedRows)
                return {message: "ok"}
                throw new Error("No rows affected")
            }
        } catch (err) {
            console.error(err);
            return err;
        }
    },
}