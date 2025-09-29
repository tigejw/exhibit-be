const axios = require("axios");
const { standardiseArtwork } = require("../utils/standardiseArtwork");
const { departmentFilterToAPI } = require("../utils/departments");

exports.fetchChicagoArtworks = async (query, onDisplay, department) => {

  let departmentNames = [];
  if (department) {
    departmentNames = departmentFilterToAPI[department]?.chicago || [];
  }

  //department search logic
  let relevantArtworks = [];
  if (departmentNames.length) {
    for (const depName of departmentNames) {
      let url = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&query[match][department_title]=${encodeURIComponent(depName)}&limit=20`;
      try {
        const { data } = await axios.get(url);
        if (data.data) relevantArtworks.push(...data.data);
      } catch (err) {}
    }
  } else {
    // No department filter
    let url = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&limit=20`;
    try {
      const { data } = await axios.get(url);
      if (data.data) relevantArtworks = data.data;
    } catch (err) {
      return [];
    }
  }
  const artworks = await Promise.all(
    relevantArtworks.map((artwork) => {
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

  // Return first 20
  return filtered.slice(0, 20);
};




