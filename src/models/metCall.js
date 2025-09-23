const axios = require("axios");

exports.fetchMetArtworks = (query) => {
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`;

  return axios.get(url).then(({ data }) => {
    return data;
  });
};
