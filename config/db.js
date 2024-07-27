const mysql = require("mysql2")

const db = mysql.createConnection({
  // development
  host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
  port: 4000,
  user: "37Eb2NWFGCvQuns.root",
  password: "2oqHIQ7VoHe0Zlw2",
  database: "devconnect",
  ssl: {
    rejectUnauthorized: true,
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
