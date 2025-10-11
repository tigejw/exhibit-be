const db = require("../../db/connection");
const toCamel = require("../utils/toCamel");

exports.fetchExhibits = () => {
  return (
    db
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
      })
  );
};
//async bc struggling w nested .thens
exports.insertArtworkByExhibit = async (exhibit_id, artwork) => {
  const { objectID } = artwork;

  //check if artwork already exists in db
  const { rows: returnedExistingArtwork } = await db.query(
    `SELECT * FROM artworks WHERE objectID = $1;`,
    [objectID]
  );

  //insert if not
  let returnedArtwork;
  if (returnedExistingArtwork.length === 0) {
    const { rows } = await db.query(
      `INSERT INTO artworks (
        objectID, source, title, isPublicDomain, localDepartmentLabel, museumDepartment,
        artistDisplayName, artistDisplayBio, artistNationality, objectDate, medium,
        dimensions, primaryImage, primaryImageSmall, isOnView
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      ) RETURNING *;`,
      [
        artwork.objectID,
        artwork.source,
        artwork.title,
        artwork.isPublicDomain,
        artwork.localDepartmentLabel,
        artwork.museumDepartment,
        artwork.artistDisplayName,
        artwork.artistDisplayBio,
        artwork.artistNationality,
        artwork.objectDate,
        artwork.medium,
        artwork.dimensions,
        artwork.primaryImage,
        artwork.primaryImageSmall,
        artwork.isOnView,
      ]
    );
    returnedArtwork = rows[0];
  } else {
    returnedArtwork = returnedExistingArtwork[0];
  }

  //check if artwork already in exhibit
  const { rows: returnedExhibitArtworkLink } = await db.query(
    `SELECT * FROM exhibit_artworks WHERE exhibit_id = $1 AND artwork_id = $2;`,
    [exhibit_id, returnedArtwork.artwork_id]
  );
  if (returnedExhibitArtworkLink.length > 0) {
    return Promise.reject({ status: 409, msg: "artwork already in exhibit" });
  }

  //link artwork to exhibit
  await db.query(
    `INSERT INTO exhibit_artworks (exhibit_id, artwork_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
    [exhibit_id, returnedArtwork.artwork_id]
  );
  return toCamel({
    exhibit_id: Number(exhibit_id),
    ...returnedArtwork,
  });
};

exports.fetchExhibitById = (exhibit_id) => {
 return db
    .query(`SELECT * FROM exhibits WHERE exhibit_id = $1;`, [exhibit_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "exhibit not found" });
      }
      return rows[0];
    })
    .then((exhibit) => {
      return db
        .query(
          `SELECT exhibit_artworks.exhibit_id, artworks.*
           FROM exhibit_artworks
           JOIN artworks ON exhibit_artworks.artwork_id = artworks.artwork_id
           WHERE exhibit_artworks.exhibit_id = $1;`,
          [exhibit.exhibit_id]
        )
        .then(({ rows }) => {
          //thumbnail from one of artworks logic
          return db
            .query(
              `SELECT artworks.primaryImageSmall
               FROM exhibit_artworks
               JOIN artworks ON exhibit_artworks.artwork_id = artworks.artwork_id
               WHERE exhibit_artworks.exhibit_id = $1
               ORDER BY RANDOM()
               LIMIT 1;`,
              [exhibit.exhibit_id]
            )
            .then(({ rows: thumbnailRows }) => {
              const thumbnail =
                thumbnailRows.length > 0 ? thumbnailRows[0].primaryimagesmall : null;
              return {
                thumbnail,
                artworks: rows.map(toCamel),
                ...exhibit,
              };
            });
        });
    })
    .then((exhibitWithArtworks) => {
      return toCamel(exhibitWithArtworks);
    });
};


exports.insertExhibit = (title, description) => {
  if (!title || !description) {
    return Promise.reject({ status: 400, msg: "missing title or description" });
  }
  return db
    .query(
      `INSERT INTO exhibits (title, description)
       VALUES ($1, $2)
       RETURNING *, NULL AS thumbnail;`,
      [title, description]
    )
    .then(({ rows }) => rows[0]);
};