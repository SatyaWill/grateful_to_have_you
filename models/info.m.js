const db = require("../config/db")
const moment = require("moment")
const today = moment().format("YYYYMMDD")-19110000
const thisYear = moment().format("YYYY")-1911
const now = moment().format("YYYY-MM-DD hh:mm:ss").toString()
const url = `https://d3r92fcxan8msh.cloudfront.net/`

module.exports = {
    info: async (authId, d) => {
        try {          
            let { sqlParm, sqlParmC, sqlParmG, sqlValue } = generateSqlParm(d);
            const sql=`WITH
            V AS (SELECT 
                vol.vol_id, 
                name, 
                gender, 
                birthday,
                IF(tel!="" AND mobile !="", CONCAT(tel,"<br/>",mobile), CONCAT(tel,mobile)) tel,
                join_date, 
                IF(status="Y","收編", "離隊") status,
                CASE
                    WHEN p.end_date = "" OR p.end_date is null THEN '未保險'
                    WHEN p.end_date <= DATE_FORMAT(NOW(), '%Y%m%d')-19110000 THEN CONCAT('已到期',",",p.end_date)
                    ELSE CONCAT('未到期',",",p.end_date)
                END AS policy
                FROM vol 
                LEFT JOIN v_policy p ON vol.vol_id = p.vol_id
                WHERE status=${sqlParm}),
            C AS (SELECT 
                vol_id,
                GROUP_CONCAT(REPLACE(CONCAT(name,"(",role,")"),"()","") SEPARATOR '<br/>') group_name,
                ${sqlAuth(authId)} canEdit
                FROM v_group WHERE status=${sqlParmC} GROUP BY vol_id),
            G AS (SELECT vol_id
                FROM v_group WHERE status=${sqlParmG} GROUP BY vol_id)
            SELECT V.*, C.group_name, C.canEdit
            FROM V, C, G 
            WHERE V.vol_id=G.vol_id AND V.vol_id=C.vol_id
            LIMIT ${d.start}, ${d.length}`

            const countSqlDesc = d.vol_id === "" ? " AND vol.vol_id=v_group.vol_id" : ""
            const countSql = `
            SELECT COUNT(DISTINCT(v_group.vol_id)) n 
            FROM vol, v_group WHERE 
            vol.status=${sqlParm} and v_group.status=${sqlParmG}${countSqlDesc}`

            const data = await db.query(sql, sqlValue)
            const count = await db.query(countSql, sqlValue)
            const res = {
                draw : d.draw, 
                recordsTotal : count[0][0].n,
                recordsFiltered : count[0][0].n,
                data : data[0]
            }
            return res
        }catch(e){
            console.error(e)
            return e
        }
    },
    // infoExcel: async (authId, d) => {
    //     try {
    //         let sqlParm, sqlParmC, sqlParmG, sqlValue = generateSqlParm(d)

    //         const res = await db.query(sql, sqlValue)

    //         return res
    //     }catch(e){
    //         console.error(e)
    //         return e
    //     }
    // },
    volId: async (d) => {
        try {
            //  函式： item為項目，parm為sql where後的參數指令，value為參數值
            const id_num = d.id_num==="A100000000" ? "" : d.id_num
            const birthday = d.birthday==="0010101" ? "" : d.birthday
            let sqlParm = ""
            let sqlValue = [d.name, d.gender]
            sqlItem(id_num, "id_num=?")
            sqlItem(birthday, "birthday=?")  
            function sqlItem(item, parm, value=item){
                if (item === "" ) return
                sqlParm += ` AND ${parm}`
                sqlValue.push(value)
            } 
            const sql = `
            SELECT vol_id, name, birthday, 
            IF(status="Y", "收編", "離隊") status
            FROM vol WHERE
            INSTR(name, ?) AND gender=? ${sqlParm}
            ORDER BY birthday`
            const data = await db.query(sql, sqlValue)
            const res = await db.query("SELECT MAX(vol_id) id from vol")
            const lastVolId = res[0][0].id
            const newVolId = lastVolId.toString().substr(0,3) < thisYear ? 
                            `${thisYear}001` : lastVolId+1
            const status = id_num && data[0].length ? 0 : 
                            !id_num && data[0].length ? 1 : 2          
            // 0 已有勿加 1 有找到相符資料，請確認 2 沒有找到相符資料
            return {status: status, data: data[0], newVolId: newVolId}
        }catch(e){
            console.error(e)
            return e
        }
    },
    newVol: async(id, d) => {
// vol ======================================================
        const id_num = d.id_num ==="A100000000" ? null : d.id_num
        const password = id_num === null ? "" : id_num
        const birthday = d.birthday ==="0010101" ? "" : d.birthday
        const book_Pic = d.book_Pic ? url+"book/"+d.book_Pic : ""
        const id_photo = d.id_photo ? url+"idPhoto/"+d.id_photo : ""
        const sqlValue = [
            d.vol_id, d.name, d.gender, id_num, password, 
            birthday,Number(d.has_book),d.issue_date, book_Pic, id_photo, 
            d.education, d.school, d.job_category, d.job, d.address, 
            d.tel, d.mobile, d.note, d.join_date, d.quit_date, d.status, id]
        const sql = `INSERT vol 
        (vol_id, name, gender, id_num, password, birthday, 
        has_book, issue_date, book_pic, id_photo, 
        education, school, job_category, job, address, 
        tel, mobile, note, join_date, quit_date, status, founder_id)
        VALUES
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
// vol_group ==================================================================
        let s = `INSERT vol_group(vol_id,group_id,subgroup,status) VALUES `
        d.group_id.forEach(g => {
            const group = g.length=== 3 ? g.substr(0,2) : g
            const subgroup = g.length=== 3 ? g.substr(2,1) : ""
            s += `(${d.vol_id}, '${group}', '${subgroup}',1),`
        })
        const sql2 = s.slice(0, -1)
// vol_leader ===================================================================
        let l = `INSERT vol_leader (vol_id,group_id,subgroup,role,status) VALUES`
        d.leader.forEach(g => {
            const group = g.length=== 3 ? g.substr(0,2) : g
            const subgroup = g.length=== 3 ? g.substr(2,1) : ""
            l += `(${d.vol_id}, '${group}', '${subgroup}',"組長",1),`
        })
        d.vice.forEach(g => {
            const group = g.length=== 3 ? g.substr(0,2) : g
            const subgroup = g.length=== 3 ? g.substr(2,1) : ""
            l += `(${d.vol_id}, '${group}', '${subgroup}',"副組長",1),`
        })
        const sql3 = l.slice(0, -1)
// =============================================================================
        try {
            if (!d.group_id.length){
                const res = await db.query(sql, sqlValue)
                console.log("vol表更新數", res[0].affectedRows)
                if (res[0].affectedRows) 
                return {message: "ok"}
                throw new Error("更新失敗")
            } else if (d.leader.length + d.vice.length) {
                await db.query(`START TRANSACTION`)
                await db.query(sql, sqlValue)
                await db.query(sql2)
                await db.query(sql3)
                console.log("t3");
                await db.query(`COMMIT`)
                console.log("vol group leader 3表更新完成");
            }else{
                await db.query(`START TRANSACTION`)
                await db.query(sql, sqlValue)
                await db.query(sql2)
                await db.query(`COMMIT`)
                console.log("vol group 2表更新完成");
            }
            return { message: 'ok' };
        }
        catch (err) {
            console.error(err)
            return { error: err.message }
        }
    },
    editPage: async (authId, volId) => {
        try {
            const sql = `
            WITH g AS (
                SELECT 
                    vol_id, 
                    JSON_Arrayagg(CONCAT(group_id, subgroup)) AS group_id, 
                    ${sqlAuth(authId)} AS can_edit
                FROM vol_group 
                WHERE vol_id = ${volId} AND status =1
                GROUP BY vol_id
            ),
            l AS (
                SELECT 
                    vol_id, 
                    JSON_Arrayagg(CONCAT(group_id, subgroup)) AS leader
                FROM vol_leader 
                WHERE status =1 AND role = '組長' AND vol_id = ${volId}  
                GROUP BY vol_id
            ),
            v AS (
                SELECT 
                    vol_id, 
                    JSON_Arrayagg(CONCAT(group_id, subgroup)) AS vice
                FROM vol_leader 
                WHERE status =1 AND role = '副組長' AND vol_id = ${volId}  
                GROUP BY vol_id
            )
            SELECT 
                vol.vol_id, 
                vol.name, 
                vol.gender, 
                vol.id_num, 
                vol.birthday, 
                IF(vol.has_book=1,1,0) AS has_book, 
                vol.issue_date, 
                vol.book_pic, 
                vol.id_photo, 
                vol.education, 
                vol.school, 
                vol.job_category, 
                vol.job, 
                vol.address, 
                vol.tel, 
                vol.mobile, 
                vol.note, 
                vol.join_date, 
                vol.quit_date, 
                vol.status, 
                founder.name AS founder, 
                editor.name AS editor,
                DATE_FORMAT(vol.time, '%Y%m%d')-19110000 AS time, 
                DATE_FORMAT(vol.chg_time, '%Y%m%d')-19110000 AS chg_time, 
                COALESCE(g.group_id, '') AS group_id,
                COALESCE(l.leader, '') AS leader, 
                COALESCE(v.vice, '') AS vice
            FROM vol 
            LEFT JOIN agent AS founder ON vol.founder_id = founder.id
            LEFT JOIN agent AS editor ON vol.editor_id = editor.id
            LEFT JOIN g ON vol.vol_id = g.vol_id 
            LEFT JOIN l ON vol.vol_id = l.vol_id 
            LEFT JOIN v ON vol.vol_id = v.vol_id 
            WHERE vol.vol_id = ${volId} AND g.can_edit = 1
            `
            const data = await db.query(sql)
            return {data: data[0][0]}
        }catch(err){
            console.error(err)
            return err
        }
    },
    editVol: async(id, d) => {
// vol ======================================================
        let sqlParm = ""
        if (d.id_num) {
            const id_num = d.id_num ==="A100000000" ? null : d.id_num
            const password = id_num === null ? "" : id_num
            sqlParm += `, id_num="${id_num}", password="${password}"`
        }
        if (d.birthday) {
            const birthday = d.birthday ==="0010101" ? "" : d.birthday
            sqlParm += `, birthday="${birthday}"`
        }
        if ("has_book" in d) {
            sqlParm += `, has_book=${d.has_book ? 1 : 0}`
        }
        function sqlItem(item, parm, value=item){
            if (item) return sqlParm += `,${parm}="${value}"`
        } 
        sqlItem(d.book_Pic,"book_pic", url+"book/"+d.book_Pic)
        sqlItem(d.id_photo, "id_photo", url+"idPhoto/"+d.id_photo)
        sqlItem(d.vol_id, "vol_id")
        sqlItem(d.name, "name")
        sqlItem(d.gender, "gender")
        sqlItem(d.issue_date, "issue_date")
        sqlItem(d.education, "education")
        sqlItem(d.school, "school")
        sqlItem(d.job_category, "job_category")
        sqlItem(d.job, "job")
        sqlItem(d.address, "address")
        sqlItem(d.tel, "tel")
        sqlItem(d.mobile, "mobile")
        sqlItem(d.note, "note")
        sqlItem(d.join_date, "join_date")
        sqlItem(d.quit_date, "quit_date")
        sqlItem(d.status, "status")
        
        const vol_id = d.vol_id;
        const sql = `UPDATE vol SET 
            editor_id="${id}" , chg_time="${now}" ${sqlParm}
            WHERE vol_id=${vol_id}`

// vol_group ==================================================================
        const insertData = d.addGroupId.map(i => {
            const group = i.length === 3 ? i.substr(0, 2) : i;
            const subgroup = i.length === 3 ? i.substr(2, 1) : "";
            return `(${vol_id}, "${group}", "${subgroup}",1)`;
        }).join();
        const sql2 = `INSERT vol_group 
            (vol_id, group_id, subgroup, status) VALUES ${insertData}
            on duplicate key update status=1 ,chg_time="${now}"`;

// vol_leader ===================================================================
        const insertLeaderData = d.addLeader.map(l => {
            const group = l.length === 3 ? l.substr(0, 2) : l;
            const subgroup = l.length === 3 ? l.substr(2, 1) : "";
            return `(${vol_id}, "${group}", "${subgroup}", "組長",1)`;
        }).concat(d.addVice.map(v => {
            const group = v.length === 3 ? v.substr(0, 2) : v;
            const subgroup = v.length === 3 ? v.substr(2, 1) : "";
            return `(${vol_id}, "${group}", "${subgroup}", "副組長",1)`;
        })).join();
  
        const sql3 = `INSERT vol_leader 
            (vol_id, group_id, subgroup, role, status) VALUES ${insertLeaderData}
            on duplicate key update status=1, chg_time="${now}"`; 

// 取消 vol_group =================================================================
        const cancelGroup = d.rmGroupId.map(i => {
            if (i.length == 2) return `group_id="${i}"`
            return `(group_id="${i.substr(0, 2)}" AND subgroup="${i.substr(2, 1)}")`;
         }).join(" OR ");
        const sql4 = `UPDATE vol_group SET status=0, chg_time="${now}" 
                      WHERE vol_id=${vol_id} AND (${cancelGroup})`;

// 取消 vol_leader ===================================================================
        const cancelLeader = d.rmLeader.map(i=> {
            if (i.length == 2) return `(group_id="${i}" AND role="組長")`
            return `(group_id="${i.substr(0, 2)}" 
                    AND subgroup="${i.substr(2, 1)}"
                    AND role="組長")`;
        }).concat(d.rmVice.map(i => {
            if (i.length == 2) return `(group_id="${i}" AND role="副組長")`
            return `(group_id="${i.substr(0, 2)}" 
                    AND subgroup="${i.substr(2, 1)}"
                    AND role="副組長")`;
        })).join(" OR ");
        const sql5 = `UPDATE vol_leader SET status=0, chg_time="${now}" 
                WHERE vol_id=${vol_id} AND (${cancelLeader})`;
// =============================================================================      
        try {
            await db.query('START TRANSACTION')
            await db.query(sql)
            if (d.addGroupId.length !== 0) {
                await db.query(sql2)
            }
            if ((d.addLeader.length + d.addVice.length) !== 0) {
                await db.query(sql3)
            }
            if (d.rmGroupId.length !== 0) {
                await db.query(sql4)
            }
            if ((d.rmLeader.length + d.rmVice.length) !== 0) {
                await db.query(sql5)
                return
            }
            await db.query('COMMIT')
            return { message: 'ok' };
        }
        catch (err) {          
            await db.query('ROLLBACK')
            console.error(err)
            return { error: err.message }
        }
    },
    intoGroup: async (id, d) => {
        try {
            const sql = `UPDATE vol SET editor_id="${id}", 
                chg_time="${now}" WHERE vol_id=${d.vol_id}`

            const insertData = d.into_group.map(i => {
                const group = i.length === 3 ? i.substr(0, 2) : i;
                const subgroup = i.length === 3 ? i.substr(2, 1) : "";
                return `(${d.vol_id}, "${group}", "${subgroup}",1)`;
            }).join();
            const sql2 = `INSERT vol_group 
            (vol_id, group_id, subgroup, status) 
            VALUES ${insertData} 
            on duplicate key update status=1, chg_time="${now}"`    
            console.log(sql2); 
            
            await db.query('START TRANSACTION')
            await db.query(sql)
            const res = await db.query(sql2)
            console.log("組別表更新:",res[0].affectedRows);
            await db.query('COMMIT')
            return { message: 'ok' };
        }catch(err){
            await db.query('ROLLBACK')
            console.error(err)
            return { error: err.message }
        }
    },
}

function generateSqlParm(d){
    console.log(d.joinYS);
    // const hasGroup = [d.sector, d.group, d.member].some(v => (v !== ""))
    // sqlparm為sql where status=後的變數，sqlValue為變數值
    //  函式： item為項目，parm為sql where後的參數指令，value為參數值
    let sqlParm = d.status === "Y" ? `"Y"` : `"N"`
    let sqlParmC = d.member === "退出" ? "0"  : "1"
    if (d.vol_id) {
        sqlParmC += ` AND vol_id=${d.vol_id} `
    }
    let sqlParmG = d.member=== "組長" ? `"1" AND INSTR(role, "組長")` : 
                   d.member==="退出" ? "0" : "1"
    let sqlValue = []        
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
    } 
    sqlItem(d.vol_id,"vol.vol_id=?")
    sqlItem(d.name, "INSTR(vol.name, ?)")
    sqlItem(d.gender, "gender=?")
    sqlItem(d.id_num, "id_num=?")
    sqlItem(d.birthday, "birthday=?")
    sqlItem(d.ageE, "birthday>=?", today-d.ageE*10000)
    sqlItem(d.ageS, "birthday<=?", today-d.ageS*10000)
    sqlItem(d.joinYS, "join_date>=?", d.joinYS*10000)
    sqlItem(d.joinYE, "join_date<=?", d.joinYE*10000+1231)
    sqlItemG(d.vol_id,"v_group.vol_id=?")
    sqlItemG(d.sector, "INSTR(group_id, ?)")
    sqlItemG(d.group, "group_id=?")
    return {
        sqlParm,
        sqlParmC,
        sqlParmG,
        sqlValue,
      }
}
function sqlAuth(authId){
    const auth = authId.map(value => `${value}`).join('|');
    const sqlAuth = auth==="All" ? "1" : `MAX(IF(group_id REGEXP '^(${auth})',1,0))`
    return sqlAuth
}




