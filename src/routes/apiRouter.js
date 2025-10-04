const apiRouter = require("express").Router()
const searchRouter = require("./searchRouter.js")
const { getEndpoints } = require("../controllers/endpointsController")

apiRouter.get("/", getEndpoints)
apiRouter.use("/search", searchRouter)

module.exports = apiRouter