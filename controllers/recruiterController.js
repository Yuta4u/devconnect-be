const {
  validationEmail,
  create,
  login,
  activate,
  findAll,
} = require("../models/recruiter")
const jwt = require("jsonwebtoken")

const validationEmailController = (req, res) => {
  const { email } = req.body
  validationEmail(email, (error, results) => {
    if (error) {
      return res.status(500).send(error)
    }
    res.status(200).send(results)
  })
}

const createController = (req, res) => {
  const { email } = req.body
  create(req.body, (error, results) => {
    if (error) {
      return res.status(500).send(error)
    }
    res.status(200).send(results)
  })
}

const loginController = (req, res) => {
  login(req.body, (error, results) => {
    if (error) {
      return res.status(500).send(error)
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

const findAllController = (_, res) => {
  findAll((error, results) => {
    if (error) {
      return res.status(500).send("Database error: " + error)
    }
    res.status(200).json(results)
  })
}

module.exports = {
  validationEmailController,
  createController,
  loginController,
  activateController,
  findAllController,
}
