const db = require("../../db/connection");

exports.fetchExhibits = () => {
  return db
  //returns random thumbnail from one of the artworks in the exhibit
  //can refactor later to be an actual column in the exhibits table 
  //which can be chosen by user/edited
    .query(
      `SELECT exhibits.*, 
      (
        SELECT artworks.primaryImageSmall
        FROM exhibit_artworks
        JOIN artworks ON exhibit_artworks.artwork_id = artworks.artwork_id
        WHERE exhibit_artworks.exhibit_id = exhibits.exhibit_id
        ORDER BY RANDOM()
        LIMIT 1
      ) AS thumbnail
    FROM exhibits;`
    )
    .then((result) => {
      return result.rows;
    });
};
