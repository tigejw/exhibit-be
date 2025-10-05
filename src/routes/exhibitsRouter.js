const express = require("express");
const { getExhibits } = require("../controllers/exhibitsController")

const exhibitsRouter = express.Router()

exhibitsRouter.get("/", getExhibits)



module.exports = exhibitsRouter