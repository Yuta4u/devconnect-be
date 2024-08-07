const mysql = require("mysql2")
const fs = require("fs")

const db = mysql.createConnection({
  host: "bre4zmod0fcatv29clcl-mysql.services.clever-cloud.com",
  port: 3306,
  user: "usano2gpmsd3wawx",
  password: "faRv62qNtbgzbpIkokST",
  database: "bre4zmod0fcatv29clcl",
})

db.connect((err) => {
  if (err) {
    console.error("Gagal connect database: " + err)
    return
  }
  console.log("Connected to database")
})

module.exports = db
