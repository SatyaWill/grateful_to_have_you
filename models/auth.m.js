const db = require("../config/db")

module.exports = {
    password: async (id) => {
        try {
            const sql = `
            SELECT a.password, JSON_Arrayagg(b.auth_id) authId
            FROM agent a ,agent_auth b 
            WHERE a.id=b.agent_id AND a.id=? GROUP BY a.id`
            const data = await db.query(sql ,[id])
            return data[0][0]
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
            WHERE a.id=b.agent_id AND a.id=? GROUP BY a.id`
            const data = await db.query(sql ,[id])
            return data[0][0]
        }catch(e){
            console.error(e)
            return e
        }
    },
}