
const { fetchMetArtworks } = require("../models/metCall");

const {fetchChicagoArtworks} = require("../models/chicagoCall");

exports.searchArtworks = async (req, res, next) => {
    const { q, source } = req.query;
    if (!q) return res.status(400).send({ error: "Bad request!" });

    try {
        let artworksData;
        if (source === "met") {
            artworksData = await fetchMetArtworks(q);
        } else if (source === "chicago") {
            artworksData = await fetchChicagoArtworks(q);
        } else if (!source || source === "") {
            const [metData, chicagoData] = await Promise.all([
                fetchMetArtworks(q),
                fetchChicagoArtworks(q)
            ]);
            artworksData = [...metData, ...chicagoData];
        } else {
            return res.status(400).send({ error: "Invalid source parameter!" });
        }
        res.status(200).send({ artworksData });
    } catch (err) {
        next(err);
    }
};