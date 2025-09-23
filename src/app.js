const express = require("express");
const searchRoutes = require("./routes/searchRoutes.js");

const app = express()
app.use(express.json())

app.use("/", searchRoutes)

app.use((err, req, res, next) => {
  console.log(err, "<<< handle this");
  res.status(500).send({ error: "Server Error!", msg: err });
});


module.exports = app

