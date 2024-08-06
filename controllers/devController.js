const { create, login, activate, findAll } = require("../models/dev")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const createController = (req, res) => {
  const { email } = req.body
  create(req.body, (error, results) => {
    if (error) {
      return res.status(500).send(error)
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    const url = `https://devconnect-be.vercel.app/api/dev/activate/${token}`

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify your email",
      text: `Click on this link to verify your email: ${url}`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send("Email sending failed: " + error)
      }
    })
    res.status(200).send(results)
  })
}

const loginController = (req, res) => {
  login(req.body, (error, results) => {
    if (error) {
      return error
    }
    res.status(200).send(results)
  })
}

const activateController = (req, res) => {
  const token = req.params.token

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).send("Invalid token.")
    }

    const email = decoded.email
    activate(email, (error, results) => {
      if (error) {
        return res.status(500).send("database error: " + error)
      }
      res.status(200).send(results)
    })
  })
}

const findAllController = (req, res) => {
  findAll((error, results) => {
    if (error) {
      return res.status(500).send("Database error: " + error)
    }
    res.status(200).json(results)
  })
}

module.exports = {
  createController,
  loginController,
  activateController,
  findAllController,
}
