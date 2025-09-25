const axios = require("axios");

const { standardiseArtwork } = require("../utils/standardiseArtwork");
exports.fetchChicagoArtworks = (query) => {
  if (!query || query.trim() === "") {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }

  const url = `https://api.artic.edu/api/v1/artworks/search?q=${query}&limit=20`;

  return axios.get(url).then(({ data }) => {
    if (data.pagination.total === 0) {
      return [];
    }
    return Promise.all(
      data.data.map((artwork) => {
        return axios
          .get(artwork.api_link)
          .then(({ data }) => standardiseArtwork(data.data, "chicago"))
            .catch((err) => {
            if (err.response && err.response.status === 404) {
              return null;
            }
            throw err;
          });
      })
    );
  });   
};
