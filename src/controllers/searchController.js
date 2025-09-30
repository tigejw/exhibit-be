const { departmentNames } = require("../utils/departments");
const { fetchMetArtworks } = require("../models/metCall");
const { fetchChicagoArtworks } = require("../models/chicagoCall");
const sortArtworks = require("../utils/sortArtworks");
exports.searchArtworks = async (req, res, next) => {
  const { q, source, onDisplay, department, sortBy, order } = req.query;
  //bad requests checks
  //query
  if (!q) return res.status(400).send({ error: "Bad request: query" });
  //onDisplay
  if (
    onDisplay !== "true" &&
    onDisplay !== "false" &&
    onDisplay !== undefined
  ) {
    return res.status(400).send({ error: "Bad request: onDisplay" });
  }
  //department
  if (department && !departmentNames.includes(department)) {
    return res.status(400).send({ error: "Bad request: department" });
  }
  //sortBy
  if(sortBy && !["title","medium","artistDisplayName"].includes(sortBy)){
    return res.status(400).send({ error: "Bad request: sort_by" });
  }
  try {
    let artworksData;
    if (source === "met") {
      artworksData = await fetchMetArtworks(q, onDisplay, department);
    } else if (source === "chicago") {
      artworksData = await fetchChicagoArtworks(q, onDisplay, department);
    } else if (!source || source === "") {
      const [metData, chicagoData] = await Promise.all([
        fetchMetArtworks(q, onDisplay, department),
        fetchChicagoArtworks(q, onDisplay, department),
      ]);
      artworksData = [...metData, ...chicagoData];
    } else {
      return res.status(400).send({ error: "Invalid source parameter!" });
    }


    if (sortBy) {
      artworksData = sortArtworks(artworksData, sortBy, order);
    }

    res.status(200).send({ artworksData });
  } catch (err) {
    next(err);
  }
};
