const db = require("../config/db")
const moment = require("moment")

module.exports = {
    info: async (d) => {
        try {
            console.log(d.draw, d.start, d.length);
            console.log(d.volID, d.name, d.gender, d.idNum);
            console.log(d.ageE, d.ageS, d.joinYS, d.joinYE);
            console.log(d.status, d.sector, d.group, d.member);
            const hasGroup = [d.sector, d.group, d.member].some(v => (v !== ""))
            const today = moment().format("YYYYMMDD")-19110000
            // sqlparm為sql where status=後的變數，sqlValue為變數值
            let sqlParm = d.status === "Y" ? `"Y"` : d.status === "N" ? `"N"` : `"D"`
            let sqlParmG = d.member=== "" ? "1" : 
                d.member === "0" ? "0" : `"1" AND INSTR(role, "組長")`
            let sqlValue = []         
            await sqlItem(d.volID,"vol.vol_id=?")
            await sqlItem(d.name, "INSTR(name, ?)")
            await sqlItem(d.gender, "gender=?")
            await sqlItem(d.idNum, "id_num=?")
            await sqlItem(d.ageE, "birthday>=?", today-d.ageE*10000)
            await sqlItem(d.ageS, "birthday<=?", today-d.ageS*10000)
            await sqlItem(d.joinYS, "join_date>=?", d.joinYS*10000)
            await sqlItem(d.joinYE, "join_date<=?", d.joinYE*10000+1231)
            await sqlItemG(d.volID,"vol_id=?")
            await sqlItemG(d.sector, "INSTR(group_id, ?)")
            await sqlItemG(d.group, "group_id=?")

            console.log(sqlParm);
            console.log(sqlParmG);
            console.log(sqlValue);
            const sqlDesc = hasGroup ? ", G WHERE V.vol_id=G.vol_id" : " LEFT JOIN G ON V.vol_id=G.vol_id"
            const sql=`WITH
            V AS (SELECT vol.vol_id, name, gender, birthday, 
                CASE 
                    WHEN tel!="" AND mobile !="" THEN CONCAT(tel,"<CHAR(10)>",mobile)
                    ELSE CONCAT(tel,mobile)
                END AS tel
                , join_date, 
                CASE status
                    WHEN "Y" THEN "收編"
                    WHEN "N" THEN "離隊"
                    ELSE "往生"
                END AS status, 

                CASE 
                    WHEN p.end_date = "" THEN '未保險'
                    WHEN p.end_date <= DATE_FORMAT(NOW(), '%Y%m%d')-19110000 THEN CONCAT('到期',CHAR(10),p.end_date)
                    ELSE CONCAT('未到期',p.end_date)
                END AS policy
                FROM vol LEFT JOIN v_policy p
                ON vol.vol_id = p.vol_id
                WHERE status=${sqlParm}),
            G AS (SELECT DISTINCT(vol_id), 
                GROUP_CONCAT(REPLACE(CONCAT(name,"(",role,")"),"()","")) group_name
                FROM v_group WHERE status=${sqlParmG} GROUP BY vol_id)
            SELECT V.*, G.group_name FROM V${sqlDesc}`
            const data = await db.query(sql, sqlValue)
            //  函式： item為項目，parm為sql where後的參數指令，value為參數值
            function sqlItem(item, parm, value=item){
                if (item === "" ) return
                sqlParm += ` AND ${parm}`
                sqlValue.push(value)
            } 
            function sqlItemG(item, parm, value=item){
                if (item === "" ) return
                sqlParmG += ` AND ${parm}`
                sqlValue.push(value)
            } //===========================================================
            console.log(data[0]);
            return data[0]
        }catch(e){
            console.error(e)
            return e
        }
    }
}


