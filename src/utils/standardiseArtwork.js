exports.standardiseArtwork = function (artwork, source) {
  if (source === "met") {
    return {
      source: "met",
      objectID: artwork.objectID,
      title: artwork.title || null,
      isPublicDomain: artwork.isPublicDomain,
      department: artwork.department || null,
      artistDisplayName: artwork.artistDisplayName || null,
      artistDisplayBio: artwork.artistDisplayBio || null,
      artistNationality: artwork.artistNationality || null,
      objectDate: artwork.objectDate || null,
      medium: artwork.medium || null,
      dimensions: artwork.dimensions || null,
      primaryImage: artwork.primaryImage || null,
      primaryImageSmall: artwork.primaryImageSmall || null,
    };
  }else if (source === "chicago") {
    return {
      source: "chicago",
      objectID: artwork.id,
      title: artwork.title || null,
      isPublicDomain: artwork.is_public_domain,
      department: artwork.department_title || null,
      artistDisplayName: artwork.artist_title || null,
      artistDisplayBio: artwork.artist_display || null,
      //artistnationality not provided by chicago api?
      artistNationality: artwork.place_of_origin || null,
      objectDate: artwork.date_display || null,
      medium: artwork.medium_display || null,
      dimensions: artwork.dimensions || null,
      primaryImage: artwork.image_id
        ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
        : null,
      primaryImageSmall: artwork.image_id
        ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/200,/0/default.jpg`
        : null,
    };
  }
  return null;
};
//   isHightlight: artwork.isHighlight,
