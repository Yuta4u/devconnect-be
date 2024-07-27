const express = require("express")
const router = express.Router()
const {
  validationEmailController,
  createController,
  loginController,
  activateController,
  findAllController,
} = require("../controllers/recruiterController")

router.post("/email-validation", validationEmailController)
router.post("/register", createController)
router.get("/activate/:token", activateController)
router.post("/login", loginController)
router.get("/", findAllController)

module.exports = router
