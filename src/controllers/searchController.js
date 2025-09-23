const { fetchMetArtworks } = require("../models/metCall")

exports.searchArtworks = (req, res, next) => {
    console.log("hi")
    const { query } = req.query
    fetchMetArtworks(query).then((artworksData)=>{
        res.status(200).send({artworksData: artworksData})
    })
    .catch((err)=>{
        next(err)
    })
}