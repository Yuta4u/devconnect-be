const express = require("express")
const router = express.Router()
const {
  createController,
  postPerPageController,
  findAllController,
} = require("../controllers/postController")

router.post("/", createController)
router.get("/:page", postPerPageController)
router.get("/", findAllController)

module.exports = router
