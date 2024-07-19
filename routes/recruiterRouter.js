const express = require("express")
const router = express.Router()
const {
  createController,
  loginController,
  activateController,
  findAllController,
} = require("../controllers/recruiterController")

router.post("/register", createController)
router.get("/activate/:token", activateController)
router.post("/login", loginController)
router.get("/", findAllController)

module.exports = router
