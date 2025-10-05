const apiRouter = require("express").Router()
const searchRouter = require("./searchRouter.js")
const exhibitRouter = require("./exhibitsRouter.js")
const { getEndpoints } = require("../controllers/endpointsController")

apiRouter.get("/", getEndpoints)
apiRouter.use("/search", searchRouter)
apiRouter.use("/exhibits", exhibitRouter)

module.exports = apiRouter