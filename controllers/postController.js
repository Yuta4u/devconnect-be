const { create, postPerPage, findAll } = require("../models/post")

const createController = (req, res) => {
  create(req.body, (error, results) => {
    if (error) {
      res.status(402).send(results)
    }
    return res.status(200).send(results)
  })
}

const postPerPageController = (req, res) => {
  const page = req.params.page
  postPerPage(page, (error, results) => {
    if (error) {
      res
        .status(500)
        .status({ status: 500, errorMsg: "error when hit api post per page!" })
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

module.exports = {
  createController,
  postPerPageController,
  findAllController,
}
