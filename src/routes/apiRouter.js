const apiRouter = require("express").Router()
const searchRouter = require("./searchRouter.js")
const exhibitRouter = require("./exhibitsRouter.js")
const artworkRouter = require("./artworkRouter.js")
const { getEndpoints } = require("../controllers/endpointsController")

apiRouter.get("/", getEndpoints)
apiRouter.use("/search", searchRouter)
apiRouter.use("/exhibits", exhibitRouter)
apiRouter.use("/artwork", artworkRouter)

module.exports = apiRouter