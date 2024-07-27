const db = require("../config/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const validationEmail = (email, callback) => {
  const querySql = `SELECT * FROM recruiter WHERE email = ?`
  db.query(querySql, [email], (error, results) => {
    if (error) {
      return callback({
        status: 500,
        msg: "db error from validation email api",
      })
    }
    if (results.length !== 0) {
      callback(null, {
        status: 201,
        msg: "email already registered",
      })
    } else if (results.length === 0) {
      callback(null, {
        status: 201,
        msg: "email is avaible to use",
      })
    }
  })
}

const create = (data, callback) => {
  const { email, password, profile_img, description, company_name, employee } =
    data
  const hashedPassword = bcrypt.hashSync(password, 10)
  const img =
    profile_img ||
    "https://t4.ftcdn.net/jpg/04/72/34/21/360_F_472342109_w3xPTE23Vehlk6C3eQLas4cuyrzrVc01.jpg"

  // Check if email already exists
  const querySqlEmail = "SELECT * FROM recruiter WHERE email = ?"
  db.query(querySqlEmail, [email], (error, results) => {
    if (error) {
      return callback({ status: 500, msg: error })
    }
    if (results.length > 0) {
      // Email already exists
      return callback({ status: 400, msg: "Email already in use" })
    } else {
      // Email does not exist, proceed with insertion
      const querySql =
        "INSERT INTO recruiter (email, password, profile_img, description, company_name, employee) VALUES (?, ?, ?, ?, ?, ?)"
      db.query(
        querySql,
        [email, hashedPassword, img, description, company_name, employee],
        (error, results) => {
          if (error) {
            return callback(error)
          }
          callback(null, {
            status: 201,
            msg: "Registration successful! Please check your email to verify your account.",
          })
        }
      )
    }
  })
}

const login = (data, callback) => {
  const { email, password } = data
  const querySql = "SELECT * FROM recruiter WHERE email = ?"
  db.query(querySql, [email], (error, results) => {
    if (error) {
      return callback({ status: 500, error: "database error" })
    }
    if (results.length === 0) {
      return callback({
        status: 400,
        error: "Email or password is incorrect",
      })
    }
    const user = results[0]
    const passwordIsValid = bcrypt.compareSync(password, user.password)
    if (!passwordIsValid) {
      return callback({
        status: 400,
        error: "Email or password is incorrect",
      })
    }
    const token = jwt.sign(
      { id: user.dev_id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    )

    callback(null, {
      status: 200,
      data: {
        user: {
          id: user.recruiter_id,
          email: user.email,
          profile_img: user.profile_img,
          description: user.description,
          company_name: user.company_name,
          employee: user.employee,
        },
        token,
      },
    })
  })
}

const activate = (email, callback) => {
  const querySql = "UPDATE recruiter SET is_active = 1 WHERE email = ?"
  db.query(querySql, [email], (error, results) => {
    if (error) {
      return callback({ status: 500, msg: error })
    }
    callback(null, { status: 201, msg: "Account activated successfully!" })
  })
}

const findAll = (callback) => {
  const querySql =
    "SELECT `recruiter_id`, `email`, `profile_img`, `description`, `company_name`, `employee` FROM `recruiter`"
  db.query(querySql, (error, results) => {
    if (error) {
      return callback({ status: 500, msg: error })
    }
    callback(null, { status: 201, data: results })
  })
}

module.exports = { validationEmail, create, login, activate, findAll }
