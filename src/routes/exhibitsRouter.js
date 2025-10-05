const express = require("express");
const { getExhibits, postArtworkToExhibit, getExhibit } = require("../controllers/exhibitsController")

const exhibitsRouter = express.Router()

exhibitsRouter.get("/", getExhibits)
exhibitsRouter.get("/:exhibit_id", getExhibit)
exhibitsRouter.post("/:exhibit_id/artwork", postArtworkToExhibit)


module.exports = exhibitsRouter