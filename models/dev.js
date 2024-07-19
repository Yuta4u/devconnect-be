const db = require("../config/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const create = (data, callback) => {
  const { email, password, role, skill, linkedin, profileImg } = data
  const hashedPassword = bcrypt.hashSync(password, 10)
  const img =
    profileImg ||
    "https://t4.ftcdn.net/jpg/04/72/34/21/360_F_472342109_w3xPTE23Vehlk6C3eQLas4cuyrzrVc01.jpg"

  // Check if email already exists
  const querySqlEmail = "SELECT * FROM dev WHERE email = ?"
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
        "INSERT INTO dev (email, password, role, skill, linkedin, profile_img) VALUES (?, ?, ?, ?, ?, ?)"
      db.query(
        querySql,
        [email, hashedPassword, role, skill, linkedin, img],
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
      return callback({ status: 500, error: error })
    }
    if (results.length === 0) {
      return callback({ status: 400, error: "Email or password is incorrect" })
    }
    const user = results[0]
    const passwordIsValid = bcrypt.compareSync(password, user.password)
    if (!passwordIsValid) {
      return callback({ status: 400, error: "Email or password is incorrect" })
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
          id: user.dev_id,
          email: user.email,
          role: user.role,
          skill: user.skill,
          linkedin: user.linkedin,
          profileImg: user.profile_img,
        },
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
    "SELECT `dev_id`, `email`, `role`, `skill`, `linkedin`, `profile_img`, `created_at` FROM `dev`"
  db.query(querySql, (error, results) => {
    if (error) {
      return callback({ status: 500, msg: error })
    }
    callback(null, { status: 201, data: results })
  })
}

module.exports = { create, login, activate, findAll }
