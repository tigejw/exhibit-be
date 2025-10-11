const express = require("express");
const { getExhibits, postArtworkToExhibit, getExhibit, postExhibit } = require("../controllers/exhibitsController")

const exhibitsRouter = express.Router()

exhibitsRouter.get("/", getExhibits)
exhibitsRouter.post("/", postExhibit);
exhibitsRouter.get("/:exhibit_id", getExhibit)
exhibitsRouter.post("/:exhibit_id/artwork", postArtworkToExhibit)


module.exports = exhibitsRouter