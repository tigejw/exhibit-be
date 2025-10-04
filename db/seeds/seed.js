const format = require("pg-format");
const db = require("../connection");
const { createRef } = require("./utils");

const seed = ({ exhibitData, artworkData, exhibitArtworkData }) => {
  return db
    .query(`DROP TABLE IF EXISTS exhibit_artworks;`)
    .then(() => db.query(`DROP TABLE IF EXISTS artworks;`))
    .then(() => db.query(`DROP TABLE IF EXISTS exhibits;`))
    .then(() => {
        return db.query(`
        CREATE TABLE exhibits (
          exhibit_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          description VARCHAR,
          start_date TIMESTAMP DEFAULT NOW()
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE artworks (
          artwork_id SERIAL PRIMARY KEY,
          source VARCHAR,
          objectID VARCHAR,
          title VARCHAR NOT NULL,
          isPublicDomain BOOLEAN,
          localDepartmentLabel VARCHAR,
          museumDepartment VARCHAR,
          artistDisplayName VARCHAR,
          artistDisplayBio VARCHAR,
          artistNationality VARCHAR,
          objectDate VARCHAR,
          medium VARCHAR,
          dimensions VARCHAR,
          primaryImage VARCHAR,
          primaryImageSmall VARCHAR,
          isOnView BOOLEAN
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE exhibit_artworks (
          id SERIAL PRIMARY KEY,
          exhibit_id INT REFERENCES exhibits(exhibit_id) NOT NULL,
          artwork_id INT REFERENCES artworks(artwork_id) NOT NULL
        );
      `);
    })
    .then(() => {
      const insertExhibitsQueryStr = format(
        "INSERT INTO exhibits (title, description) VALUES %L RETURNING *;",
        exhibitData.map(({ title, description }) => [
          title,
          description
        ])
      );
      return db.query(insertExhibitsQueryStr);
    })
    .then(({ rows: exhibitRows }) => {
      const exhibitIdLookup = createRef(exhibitRows, "title", "exhibit_id");
      const insertArtworksQueryStr = format(
        `INSERT INTO artworks (
          source, objectID, title, isPublicDomain, localDepartmentLabel, museumDepartment, artistDisplayName, artistDisplayBio, artistNationality, objectDate, medium, dimensions, primaryImage, primaryImageSmall, isOnView
        ) VALUES %L RETURNING *;`,
        artworkData.map((art) => [
          art.source,
          art.objectID,
          art.title,
          art.isPublicDomain,
          art.localDepartmentLabel,
          art.museumDepartment,
          art.artistDisplayName,
          art.artistDisplayBio,
          art.artistNationality,
          art.objectDate,
          art.medium,
          art.dimensions,
          art.primaryImage,
          art.primaryImageSmall,
          art.isOnView
        ])
      );
      return db
        .query(insertArtworksQueryStr)
        .then(({ rows: artworkRows }) => ({ exhibitIdLookup, artworkRows }));
    })
    .then(({ exhibitIdLookup, artworkRows }) => {
      const artworkIdLookup = createRef(artworkRows, "title", "artwork_id");
      const formattedExhibitArtworkData = exhibitArtworkData.map(
        ({ exhibit_title, artwork_title }) => ({
          exhibit_id: exhibitIdLookup[exhibit_title],
          artwork_id: artworkIdLookup[artwork_title],
        })
      );
      const insertExhibitArtworksQueryStr = format(
        "INSERT INTO exhibit_artworks (exhibit_id, artwork_id) VALUES %L;",
        formattedExhibitArtworkData.map(({ exhibit_id, artwork_id }) => [
          exhibit_id,
          artwork_id,
        ])
      );
      return db.query(insertExhibitArtworksQueryStr);
    });
};

module.exports = seed;
