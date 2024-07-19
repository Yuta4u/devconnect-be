const { create, findAll } = require("../models/applied")

const createController = (req, res) => {
  create(req.body, (error, results) => {
    if (error) {
      res.status(402).send(results)
    }
    return res.status(200).send(results)
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

module.exports = { createController, findAllController }
