const axios = require("axios");

exports.fetchMetArtworks = (query) => {
  if (!query || query.trim() === "") {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }

  const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`;

  return axios
    .get(url)
    .then(({ data }) => {
      if (!data.objectIDs.length === 0) {
        return [];
      }

      const first20 = data.objectIDs.slice(0, 20);

      return Promise.all(
        first20.map((id) => {
          return axios
            .get(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
            )
            .then(({ data }) => data)
            .catch((err) => {
              //null for invalid returned ids------ why metapi:_(
               if (err.response && err.response.status === 404) {
                return null;
              }
              throw err;
            });
        })
      );
    })
    .then((artworks) => artworks.filter(Boolean));
};
