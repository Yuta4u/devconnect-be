const db = require("../config/db")

const create = (data, callback) => {
  const { position, salary, requirement, recruiter_id } = data
  const querySql =
    "INSERT INTO post (position, salary, requirement, recruiter_id) VALUES (?, ?, ?, ?)"
  db.query(
    querySql,
    [position, salary, requirement, recruiter_id],
    (error, _) => {
      if (error) {
        return callback(null, {
          status: 402,
          errorMsg: error.sqlMessage,
        })
      }
      callback(null, {
        status: 201,
        msg: "Post successfully created!",
      })
    }
  )
}

const postPerPage = (page, callback) => {
  const querySql = `SELECT * FROM post LIMIT ${page * 10}, ${(page + 1) * 10}`
  db.query(querySql, (error, results) => {
    if (error) {
      return callback({ status: 500, msg: "Error database" })
    }
    callback(null, { status: 201, data: results })
  })
}

const findAll = (callback) => {
  const querySql = "SELECT * FROM post"
  db.query(querySql, (error, results) => {
    if (error) {
      return callback({ status: 500, msg: error })
    }
    callback(null, { status: 201, data: results })
  })
}

module.exports = { create, postPerPage, findAll }
