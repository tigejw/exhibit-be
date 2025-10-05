const {
  fetchExhibits,
  insertArtworkByExbiti,
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


