const axios = require("axios");
const { standardiseArtwork } = require("../utils/standardiseArtwork");
const {
  metDepartmentIDs,
  departmentFilterToAPI,
} = require("../utils/departments");

exports.fetchMetArtworks = async (query, onDisplay, department) => {
  let departmentNames = [];
  if (department) {
    departmentNames = departmentFilterToAPI[department]?.met || [];
  }
  let returnedObjectIDs = [];
  //department search logic
  if (departmentNames.length) {
    for (const depName of departmentNames) {
      const depObj = metDepartmentIDs.find(
        (dep) => dep.displayName === depName
      );
      if (!depObj) continue;
      let url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}&departmentId=${depObj.departmentId}`;
      if (onDisplay === "true") url += `&isOnView=true`;
      else if (onDisplay === "false") url += `&isOnView=false`;
      try {
        const { data } = await axios.get(url);
        if (data.objectIDs) returnedObjectIDs.push(...data.objectIDs);
      } catch (err) {}
    }
  } else {
    //no department filter
    let url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`;
    if (onDisplay === "true") url += `&isOnView=true`;
    else if (onDisplay === "false") url += `&isOnView=false`;
    try {
      const { data } = await axios.get(url);
      if (data.objectIDs) returnedObjectIDs = data.objectIDs;
    } catch (err) {
      return [];
    }
  }
  const first20 = returnedObjectIDs.slice(0, 20);
  const artworks = await Promise.all(
    first20.map(async (id) => {
      try {
        const res = await axios.get(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 ...",
              "Accept-Encoding": "identity",
            },
          }
        );
        return standardiseArtwork(res.data, "met", department);
      } catch (err) {
        return null;
      }
    })
  );
  
  return filteredNulls = artworks.filter((artwork) => artwork);
};
