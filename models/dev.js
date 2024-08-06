const db = require("../config/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const create = (data, callback) => {
  const { username, email, password } = data
  const hashedPassword = bcrypt.hashSync(password, 10)

  // Check if email already exists
  const querySqlEmail = `
    SELECT 1 FROM dev WHERE email = ?
    UNION
    SELECT 1 FROM recruiter WHERE email = ?
  `

  db.query(querySqlEmail, [email, email], (error, results) => {
    if (error) {
      return callback({ status: 500, msg: error })
    }
    if (results.length > 0) {
      // Email already exists
      return callback({ status: 400, msg: "Email already in use" })
    } else {
      // Email does not exist, proceed with insertion
      const querySql =
        "INSERT INTO dev (username, email, password) VALUES (?, ?, ?)"
      db.query(
        querySql,
        [username, email, hashedPassword],
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
  const querySql = "SELECT * FROM dev WHERE email = ?"
  db.query(querySql, [email], (error, results) => {
    if (error) {
      return callback({ status: 500, error: "Akun tidak terdaftar" })
    }
    if (results.length === 0) {
      return callback({ status: 400, error: "Email or password is incorrect" })
    }
    const user = results[0]
    const passwordIsValid = bcrypt.compareSync(password, user.password)
    if (!passwordIsValid) {
      return callback({ status: 400, error: "Email or password is incorrect" })
    }
    if (!user.is_active) {
      return callback({
        status: 402,
        error: "Your account has not been activated",
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
        // user: {
        //   id: user.dev_id,
        //   username: user.username,
        //   email: user.email,
        //   role: user.role,
        //   skill: user.skill,
        //   linkedin: user.linkedin,
        //   profileImg: user.profile_img,
        // },
        token,
      },
    })
  })
}

const activate = (email, callback) => {
  const querySql = "UPDATE dev SET is_active = 1 WHERE email = ?"
  db.query(querySql, [email], (error, results) => {
    if (error) {
      return callback({ status: 500, msg: error })
    }
    callback(null, { status: 201, msg: "Account activated successfully!" })
  })
}

const findAll = (callback) => {
  const querySql =
    "SELECT `dev_id`, `username`, `email`, `role`, `skill`, `linkedin`, `profile_img`, `created_at` FROM `dev`"
  db.query(querySql, (error, results) => {
    if (error) {
      return callback({ status: 500, msg: error })
    }
    callback(null, { status: 201, data: results })
  })
}

module.exports = { create, login, activate, findAll }
