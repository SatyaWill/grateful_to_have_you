const db = require("../config/db");
const moment = require("moment");
const thisMonth = moment().utcOffset(480).format("YYYYMM") - 191100;
const lastMonth = moment().utcOffset(480).subtract(1, "month").format("YYYYMM") - 191100;
const last2Month = moment().utcOffset(480).subtract(2, "month").format("YYYYMM") - 191100;
const now = moment().utcOffset(480).format('YYYY-MM-DD HH:mm:ss').toString();

module.exports = {
    count: async (authId, isOver, m) => {
        try {
          const month = m === "L" ? lastMonth : m === "L2" ? last2Month : thisMonth;
          const auth = authId.map(value => `${value}`).join('|');
          const param = auth==="All" ? "" : `AND A.group_id REGEXP '^(${auth})'`
          const sql = `
                SELECT 
                    CONCAT(A.group_id,A.subgroup) id, 
                    B.name, COUNT(*) count 
                FROM checkin A LEFT JOIN subgroup B 
                ON A.group_id = B.group_id AND A.subgroup = B.subgroup
                WHERE A.audit_status = ? AND INSTR(date, ?) ${param}
                GROUP BY A.group_id, A.subgroup`;
          const val = [isOver, month];
          const data = await db.query(sql, val);
          return { data: data[0] };
        } catch (e) {
          console.error(e);
          return e;
        }
    },
  get: async (isOver, m, group) => {
    try {
      if (group === "NO") {
        return { data: {} };
      }
      const month = m === "L" ? lastMonth : m === "L2" ? last2Month : thisMonth;
      const group_id = group.substr(0, 2);
      const subgroup = group.substr(2, 1);
      const sql = `
            SELECT
                A.id, A.vol_id, vol.name, A.date, A.start_time, A.end_time, A.criteria_id,
                A.original_hours, A.audit_hours, A.note,
                COALESCE(GROUP_CONCAT(B.name ORDER BY B.start_time SEPARATOR ','), '') AS criteria_name,
                COALESCE(agent.name, '') agent_name
            FROM checkin A
            LEFT JOIN vol ON A.vol_id = vol.vol_id
            LEFT JOIN criteria B ON FIND_IN_SET(B.id, A.criteria_id)
            LEFT JOIN agent ON A.agent_id = agent.id
            WHERE A.audit_status = ? AND INSTR(date, ?) AND A.group_id = ? AND A.subgroup = ?
            GROUP BY A.id, A.criteria_id`;
      const val = [isOver, month, group_id, subgroup];
      const data = await db.query(sql, val);
      return { data: data[0] };
    } catch (e) {
      console.error(e);
      return e;
    }
  },
  batchEdit: async (id, d) => {
    try {
      const sql = `UPDATE checkin SET 
                audit_hours = ?, note = ? , agent_id=? WHERE id IN (${d.ids.join()})`;
      const res = await db.query(sql, [d.hours, d.note, id]);
      if (res[0].affectedRows) return { message: "ok" };
      throw new Error("No rows affected");
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  manualEdit: async (id, d) => {
    try {
      const ids = d.map(({ id }) => id).join(",");
      const sql = `
                UPDATE checkin
                SET agent_id = ?,
                    audit_hours = CASE id
                        ${d.map(({ id, hours }) => `WHEN ${id} THEN '${hours}'`).join(" ")}
                    END,
                    note = CASE id
                        ${d.map(({ id, note }) => `WHEN ${id} THEN '${note}'`).join(" ")}
                    END
                WHERE id IN (${ids})`;
      const res = await db.query(sql, id);
      if (res[0].affectedRows) return { message: "ok" };
      throw new Error("No rows affected");
    } catch (err) {
      console.error(err);
      return err;
    }
  },
  toRecords: async (id, d) => {
    const sql0 = `UPDATE checkin 
            SET agent_id = '${id}', audit_status = 'Y', 
            over_time='${now}', note = '作廢'
            WHERE id IN (${d.invalidIds.join()})`;
    const sql1 = `INSERT INTO record 
            (vol_id, date, group_id, hrs, subgroup, note) 
            SELECT vol_id, date, group_id, audit_hours, subgroup, note 
            FROM checkin WHERE id IN (${d.ids.join()})`;
    const sql2 = `UPDATE checkin 
            SET agent_id ='${id}', 
                record_id = ? + FIND_IN_SET(id, "${d.ids.join()}")-1, 
                audit_status = 'Y', over_time='${now}'
            WHERE id IN (${d.ids.join()})`;
    try {
      if (d.invalidIds.length) {
        [res] = await db.query(sql0);
        if (res && res.affectedRows === d.invalidIds.length) {
          return { message: "ok" };
        } else {
          throw new Error("無法更新全部");
        }
      } else {
        let res;
        let retries = 3;
        while (retries > 0) {
          await db.query("START TRANSACTION");
          const [r] = await db.query(sql1);
          const recordId = r.insertId || 0;
          res = await db.query(sql2, [recordId]);
          await db.query("COMMIT");
          if (res && res[0].affectedRows === d.ids.length) {
            return { message: "ok" };
          }
          retries--;
          console.log(`Retrying transaction, ${retries} retries left`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        throw new Error("無法更新全部");
      }
    } catch (err) {
      await db.query("ROLLBACK");
      console.error(err);
      throw err;
    }
  },
};
