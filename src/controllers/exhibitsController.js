const {
  fetchExhibits,
  insertArtworkByExhibit,
} = require("../models/exhibitsModel");

exports.getExhibits = (req, res, next) => {
  fetchExhibits()
    .then((exhibits) => {
      res.status(200).send({ exhibits });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArtworkToExhibit = (req, res, next) => {
  const { exhibit_id } = req.params;
  const artwork = req.body;

  insertArtworkByExhibit(exhibit_id, artwork)
    .then((artworkAddedToExhibit) => {
      res.status(201).send({ artwork: artworkAddedToExhibit });
    })
    .catch((err) => {
      next(err);
    });
};
