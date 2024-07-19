const express = require("express")
const router = express.Router()
const {
  createController,
  findAllController,
} = require("../controllers/appliedController")

router.post("/create", createController)
// router.get("/activate/:token", activateController)
// router.post("/login", loginController)
router.get("/", findAllController)

module.exports = router
