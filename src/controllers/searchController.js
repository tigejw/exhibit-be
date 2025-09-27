const { fetchMetArtworks } = require("../models/metCall");

const { fetchChicagoArtworks } = require("../models/chicagoCall");

exports.searchArtworks = async (req, res, next) => {
  const { q, source, onDisplay } = req.query;
  if (!q) return res.status(400).send({ error: "Bad request!" });
  if (onDisplay !== "true" && onDisplay !== "false" && onDisplay !== undefined) {
    return res.status(400).send({ error: "Bad request!" });
  }
  try {
    let artworksData;
    if (source === "met") {
      artworksData = await fetchMetArtworks(q, onDisplay);
    } else if (source === "chicago") {
      artworksData = await fetchChicagoArtworks(q, onDisplay);
    } else if (!source || source === "") {
      const [metData, chicagoData] = await Promise.all([
        fetchMetArtworks(q, onDisplay),
        fetchChicagoArtworks(q, onDisplay),
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
