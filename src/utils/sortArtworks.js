module.exports = function sortArtworks(artworks, sortBy, order = "desc") {
if (!sortBy) return artworks;

  const compare = (a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    return order === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  };

  return [...artworks].sort(compare);
};