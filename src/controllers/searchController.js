const { fetchMetArtworks } = require("../models/metCall")

exports.searchArtworks = (req, res, next) => {
    const { q } = req.query

    fetchMetArtworks(q).then((artworksData)=>{
        res.status(200).send({artworksData: artworksData})
    })
    .catch((err)=>{
        next(err)
    })
}