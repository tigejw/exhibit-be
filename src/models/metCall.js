const axios = require("axios");

exports.fetchMetArtworks = (query) => {
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`;

  return axios.get(url).then(({ data }) => {
    const first20 = data.objectIDs.slice(0, 20);

    const artworksRequest = first20.map((id) => {
      return axios
        .get(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
        )
        .then(({ data }) => data);
    });

    return Promise.all(artworksRequest)
  }).then((artworks)=>{
    return artworks
  })
};
