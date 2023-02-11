const db = require("../config/db")

module.exports = {
    password: async (id) => {
        try {
            const data = await db.query("SELECT password FROM agent WHERE id=?" ,[id])
            return data[0][0].password
        }catch(e){
            console.error(e)
            return e
        }
    },
    userinfo: async (id) => {
        try {
            const sql = "SELECT a.name, b.auth_id FROM agent a ,agent_auth b WHERE a.id=b.agent_id AND a.id=?"
            const data = await db.query(sql ,[id])
            return data[0][0]
        }catch(e){
            console.error(e)
            return e
        }
    }
}