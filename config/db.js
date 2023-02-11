require("dotenv").config();
const mysql = require("mysql2");
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: "vols",
  port: 3306,
  waitForConnections : true,
  connectionLimit : 8
});

module.exports = pool.promise()
