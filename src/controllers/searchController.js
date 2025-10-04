const { departmentNames } = require("../utils/departments");
const { fetchMetArtworks } = require("../models/metApiModel");
const { fetchChicagoArtworks } = require("../models/chicagoApiModel");
const sortArtworks = require("../utils/sortArtworks");
exports.searchArtworks = async (req, res, next) => {
  const { q, source, onDisplay, department, sortBy, order } = req.query;
  let { limit, page } = req.query;
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
  if (sortBy && !["title", "medium", "artistDisplayName"].includes(sortBy)) {
    return res.status(400).send({ error: "Bad request: sort_by" });
  }
  //limit
    if (limit === undefined) {
      if (source === "met" || source === "chicago") {
        limit = 15;
      } else {
        limit = 30;
      }
    }
    limit = Number(limit);
    if (!Number.isInteger(limit) || limit <= 0) {
      return res.status(400).send({ error: "Bad request: limit" });
    }
  // even for calling both apis
  if ((!source || source === "") && limit % 2 !== 0) {
    limit += 1;
  }

  //page
  if (page && (isNaN(Number(page)) || !Number.isInteger(Number(page)) || Number(page) <= 0)) {
    return res.status(400).send({ error: "Bad request: page" });
  }
  page = Number(page) || 1;
  try {
    let artworksData = [];
    let totalResults = 0;
    let hasNextPage = false;
    if (source === "met") {
      const results = await fetchMetArtworks(
        q,
        onDisplay,
        department,
        limit,
        page
      );
      artworksData = results.artworksData;
      totalResults = results.totalResults;
      hasNextPage = results.hasNextPage;
    } else if (source === "chicago") {
      const results = await fetchChicagoArtworks(
        q,
        onDisplay,
        department,
        limit,
        page
      );
      artworksData = results.artworksData;
      totalResults = results.totalResults;
      hasNextPage = results.hasNextPage;
    } else if (!source || source === "") {
      const perApiLimit = limit / 2;
      //need to track offset when one api fills deficit of other
      const [metResults, chicagoResults] = await Promise.all([
        fetchMetArtworks(q, onDisplay, department, perApiLimit, page),
        fetchChicagoArtworks(q, onDisplay, department, perApiLimit, page),
      ]);
      artworksData = [
        ...metResults.artworksData,
        ...chicagoResults.artworksData,
      ];
      totalResults = metResults.totalResults + chicagoResults.totalResults;
      hasNextPage = metResults.hasNextPage || chicagoResults.hasNextPage;
    } else {
      return res.status(400).send({ error: "Invalid source parameter!" });
    }

    if (sortBy) {
      artworksData = sortArtworks(artworksData, sortBy, order);
    }
    res
      .status(200)
      .send({ artworksData, totalResults, hasNextPage, page, limit });
  } catch (err) {
    next(err);
  }
};
