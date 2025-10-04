const { readEndpointsData } = require("../models/readEndpointsModel");

exports.getEndpoints = (req, res, next) => {
  readEndpointsData()
    .then((endpointsData) => {
      res.status(200).send({ endpoints: endpointsData });
    })
    .catch((err) => {
      next(err);
    });
};
