const express = require("express");
const { searchArtworks} = require("../controllers/searchController")

const searchRouter = express.Router()

searchRouter.get("/", searchArtworks)

module.exports = searchRouter