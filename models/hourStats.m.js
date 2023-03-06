const db = require("../config/db");
const moment = require("moment");
const thisYear = moment().utcOffset(480).format("YYYY") - 1911;

module.exports = {
    years: async (year, group) => {
        try {
          const month = m === "L" ? lastMonth : m === "L2" ? last2Month : thisMonth;
          const auth = authId.map(value => `${value}`).join('|');
          const param = auth==="All" ? "" : `AND A.group_id REGEXP '^(${auth})'`
          const sql = `
          SELECT record.vol_id, vol.name,
              SUM(CASE WHEN substr(date, 4, 2) = '01' THEN hrs ELSE 0 END) AS 'Jan',
              SUM(CASE WHEN substr(date, 4, 2) = '02' THEN hrs ELSE 0 END) AS 'Feb',
              SUM(CASE WHEN substr(date, 4, 2) = '03' THEN hrs ELSE 0 END) AS 'Mar',
              SUM(CASE WHEN substr(date, 4, 2) = '04' THEN hrs ELSE 0 END) AS 'Apr',
              SUM(CASE WHEN substr(date, 4, 2) = '05' THEN hrs ELSE 0 END) AS 'May',
              SUM(CASE WHEN substr(date, 4, 2) = '06' THEN hrs ELSE 0 END) AS 'Jun',
              SUM(CASE WHEN substr(date, 4, 2) = '07' THEN hrs ELSE 0 END) AS 'Jul',
              SUM(CASE WHEN substr(date, 4, 2) = '08' THEN hrs ELSE 0 END) AS 'Aug',
              SUM(CASE WHEN substr(date, 4, 2) = '09' THEN hrs ELSE 0 END) AS 'Sep',
              SUM(CASE WHEN substr(date, 4, 2) = '10' THEN hrs ELSE 0 END) AS 'Oct',
              SUM(CASE WHEN substr(date, 4, 2) = '11' THEN hrs ELSE 0 END) AS 'Nov',
              SUM(CASE WHEN substr(date, 4, 2) = '12' THEN hrs ELSE 0 END) AS 'Dec',
              SUM(hrs) AS total
          FROM record
          LEFT JOIN vol on record.vol_id = vol.vol_id
          WHERE date LIKE '?%' AND group_id = 'A1' 
          GROUP BY vol_id`;
          const val = [isOver, month];
          const data = await db.query(sql, val);
          return { data: data[0] };
        } catch (e) {
          console.error(e);
          return e;
        }
    },
    groupMember: async (y, group) => {
    try {
      if (group === "NO" ||  y < 94 || y > thisYear) {
        return { data: {} };
      }
      const year = y === "T" ? thisYear : y === "L" ? thisYear-1 : y;
      const group_id = group.substr(0, 2);
      const subgroup = group==="A1a" ? `AND subgroup !='b'`  
                      :group.substr(2, 1) ? `AND subgroup='${group.substr(2, 1)}'`: "";
      const sql = `
          SELECT record.vol_id, vol.name,
            SUM(CASE WHEN substr(date, 4, 2) = '01' THEN hrs ELSE 0 END) AS 'Jan',
            SUM(CASE WHEN substr(date, 4, 2) = '02' THEN hrs ELSE 0 END) AS 'Feb',
            SUM(CASE WHEN substr(date, 4, 2) = '03' THEN hrs ELSE 0 END) AS 'Mar',
            SUM(CASE WHEN substr(date, 4, 2) = '04' THEN hrs ELSE 0 END) AS 'Apr',
            SUM(CASE WHEN substr(date, 4, 2) = '05' THEN hrs ELSE 0 END) AS 'May',
            SUM(CASE WHEN substr(date, 4, 2) = '06' THEN hrs ELSE 0 END) AS 'Jun',
            SUM(CASE WHEN substr(date, 4, 2) = '07' THEN hrs ELSE 0 END) AS 'Jul',
            SUM(CASE WHEN substr(date, 4, 2) = '08' THEN hrs ELSE 0 END) AS 'Aug',
            SUM(CASE WHEN substr(date, 4, 2) = '09' THEN hrs ELSE 0 END) AS 'Sep',
            SUM(CASE WHEN substr(date, 4, 2) = '10' THEN hrs ELSE 0 END) AS 'Oct',
            SUM(CASE WHEN substr(date, 4, 2) = '11' THEN hrs ELSE 0 END) AS 'Nov',
            SUM(CASE WHEN substr(date, 4, 2) = '12' THEN hrs ELSE 0 END) AS 'Dec',
            SUM(hrs) AS total
          FROM record
          LEFT JOIN vol on record.vol_id = vol.vol_id
          WHERE date LIKE '${year}%' AND group_id = ? ${subgroup}
          GROUP BY vol_id`;
      const data = await db.query(sql, group_id);
      return { data: data[0] };
    } catch (e) {
      console.error(e);
      return e;
    }
  },
};
