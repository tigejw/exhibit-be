const axios = require("axios");
const { standardiseArtwork } = require("../utils/standardiseArtwork");

exports.fetchMetArtworks = (query, onDisplay) => {
  if (!query || query.trim() === "") {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }

  let url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`;
  if (onDisplay === "true") {
    url += `&isOnView=true`;
  } else if (onDisplay === "false") {
    url += `&isOnView=false`;
  }
  return axios.get(url).then(({ data }) => {
    if (data.total === 0) {
      return [];
    }
    const first20 =
      data.total >= 20 ? data.objectIDs.slice(0, 20) : data.objectIDs;
    return Promise.all(
      first20.map((id) => {
        return axios
          .get(
            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
          )
          .then(({ data }) => standardiseArtwork(data, "met", onDisplay))
          .catch((err) => {
            //null for invalid returned ids------ why metapi:_(
            if (err.response && err.response.status === 404) {
              return null;
            }
            throw err;
          });
      })
    ).then((artworks) => artworks.filter(Boolean));
  });
};
