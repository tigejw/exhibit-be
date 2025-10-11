const express = require("express");
const { getArtworkByID } = require("../controllers/searchController");

const artworkRouter = express.Router();

artworkRouter.get("/:artwork_id", getArtworkByID);

module.exports = artworkRouter;
