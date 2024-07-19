// app.js
require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const serverless = require("serverless-http")

// routes
const devRoutes = require("./routes/devRouter")
const recruiterRoutes = require("./routes/recruiterRouter")
const postRoutes = require("./routes/postRouter")
const appliedRoutes = require("./routes/appliedRouter")

const app = express()

// set up
app.use(bodyParser.json())
app.use(cors())
app.options("*", cors())

app.use("/api/dev", devRoutes)
app.use("/api/recruiter", recruiterRoutes)
app.use("/api/post", postRoutes)
app.use("/api/applied", appliedRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app
module.exports.handler = serverless(app)
