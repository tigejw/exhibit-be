const axios = require("axios");
const { standardiseArtwork } = require("../utils/standardiseArtwork");
const { departmentFilterToAPI } = require("../utils/departments");

exports.fetchChicagoArtworks = async (query, onDisplay, department, limit = 15, page = 1) => {
  let departmentNames = [];
  if (department) {
    departmentNames = departmentFilterToAPI[department]?.chicago || [];
  }

  //department search logic
  let relevantArtworks = [];
  let totalResults = 0;
  let hasNextPage = false;
  if (departmentNames.length) {
    for (const depName of departmentNames) {
      let url = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&query[match][department_title]=${encodeURIComponent(depName)}&limit=${limit}&page=${page}`;
      try {
        const { data } = await axios.get(url);
        if (data.data) relevantArtworks.push(...data.data);
        totalResults += data.pagination.total || 0;
        hasNextPage = data.pagination.current_page < data.pagination.total_pages;
      } catch (err) {}
    }
  } else {
    // No department filter
    let url = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}`;
    try {
      const { data } = await axios.get(url);
      if (data.data) relevantArtworks = data.data;
      totalResults = data.pagination.total || 0;
      hasNextPage = data.pagination.current_page < data.pagination.total_pages;
    } catch (err) {
      return { artworksData: [], totalResults: 0, hasNextPage: false };
    }
  }
  //removes duplicated from artworks in multiple departments
  //maybe refactor?
  let uniqueArtworksMap = {}
  for (const artwork of relevantArtworks) {
    uniqueArtworksMap[artwork.id] = artwork;
  }
  const uniqueArtworks = Object.values(uniqueArtworksMap);

  const artworks = await Promise.all(
    uniqueArtworks.map((artwork) => {
      return axios
        .get(artwork.api_link)
        .then(({ data }) => standardiseArtwork(data.data, "chicago", department))
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            return null;
          }
          throw err;
        });
    })
  );

  // Filter out nulls and apply onDisplay filter
  let filtered = artworks.filter(Boolean);
  if (onDisplay === "true") {
    filtered = filtered.filter((artwork) => artwork.isOnView === true);
  } else if (onDisplay === "false") {
    filtered = filtered.filter((artwork) => artwork.isOnView === false);
  }

  return { artworksData: filtered, totalResults, hasNextPage };
};

exports.fetchChicagoArtworkById = async (id) => {
  try {
    const { data } = await axios.get(
      `https://api.artic.edu/api/v1/artworks/${id}`
    );
    if (!data || !data.data) return null;
    return standardiseArtwork(data.data, "chicago");
  } catch (err) {
    return null;
  }
};