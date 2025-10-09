const axios = require("axios");
const { standardiseArtwork } = require("../utils/standardiseArtwork");
const {
  metDepartmentIDs,
  departmentFilterToAPI,
} = require("../utils/departments");

exports.fetchMetArtworks = async (
  query,
  onDisplay,
  department,
  limit,
  page
) => {
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
      } catch (err) {
          console.error("Met API error:", err.message);
      }
    }
  } else {
    //no department filter
    let url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`;
    if (onDisplay === "true") url += `&isOnView=true`;
    else if (onDisplay === "false") url += `&isOnView=false`;
    try {
      const { data } = await axios.get(url,  {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json"
            },
          });
      if (data.objectIDs) returnedObjectIDs = data.objectIDs;
    } catch (err) {
        console.error("Met API error:", err.message);
      return { artworksData: [], totalResults: 0, hasNextPage: false };
    }
  }
  // pagination logic
  const totalResults = returnedObjectIDs.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pagedIDs = returnedObjectIDs.slice(start, end);
  const artworks = await Promise.all(
    pagedIDs.map(async (id) => {
      try {
        const res = await axios.get(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
          {
             headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
"Accept": "application/json"
            },
          }
        );
        console.log(res.data)
        return standardiseArtwork(res.data, "met", department);
      } catch (err) {
        return null;
      }
    })
  );
  
  const filteredNulls = artworks.filter((artwork) => artwork);
  const hasNextPage = end < totalResults;
  return { artworksData: filteredNulls, totalResults, hasNextPage };
};
