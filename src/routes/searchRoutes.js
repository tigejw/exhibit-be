const express = require("express");
const { searchArtworks} = require("../controllers/searchController")

const router = express.Router()

router.get("/search", searchArtworks)

module.exports = router