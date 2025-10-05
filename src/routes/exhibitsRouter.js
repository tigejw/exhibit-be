const express = require("express");
const { getExhibits, postArtworkToExhibit } = require("../controllers/exhibitsController")

const exhibitsRouter = express.Router()

exhibitsRouter.get("/", getExhibits)
exhibitsRouter.post("/:exhibit_id/artwork", postArtworkToExhibit)


module.exports = exhibitsRouter