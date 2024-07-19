const db = require("../config/db")

const create = (data, callback) => {
  const { cv, dev_id, post_id } = data
  const querySql = "INSERT INTO applied (cv, dev_id, post_id) VALUES (?, ?, ?)"
  db.query(querySql, [cv, dev_id, post_id], (error, _) => {
    if (error) {
      return callback(null, {
        status: 402,
        errorMsg: error.sqlMessage,
      })
    }
    callback(null, {
      status: 201,
      msg: "Applied successfully created!",
    })
  })
}

const findAll = (callback) => {
  const querySql = "SELECT * FROM applied"
  db.query(querySql, (error, results) => {
    if (error) {
      return callback({ status: 500, msg: error })
    }
    callback(null, { status: 201, data: results })
  })
}

module.exports = { create, findAll }
