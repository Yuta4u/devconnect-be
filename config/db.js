const mysql = require("mysql2")
const fs = require("fs")

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    ca: fs.readFileSync("certs/ca-cert.pem"),
  },
})

db.connect((err) => {
  if (err) {
    console.error("Gagal connect database: " + err)
    return
  }
  console.log("Connected to database")
})

module.exports = db
