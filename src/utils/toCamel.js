module.exports = function toCamel(obj) {
  const map = {
    objectid: "objectID",
    ispublicdomain: "isPublicDomain",
    localdepartmentlabel: "localDepartmentLabel",
    museumdepartment: "museumDepartment",
    artistdisplayname: "artistDisplayName",
    artistdisplaybio: "artistDisplayBio",
    artistnationality: "artistNationality",
    objectdate: "objectDate",
    primaryimage: "primaryImage",
    primaryimagesmall: "primaryImageSmall",
    isonview: "isOnView",
    exhibit_id: "exhibit_id",
    artwork_id: "artwork_id",
    title: "title",
    source: "source",
    medium: "medium",
    dimensions: "dimensions"
  };
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [map[k] || k, v])
  );
}

