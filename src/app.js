const express = require("express");
const searchRoutes = require("./routes/searchRoutes.js");

const app = express();
app.use(express.json());

app.use("/", searchRoutes);

//invalid url handling

app.use((req, res) => {
  res.status(404).send({ error: "Invalid URL!" });
});

//error handling middleware

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ error: err.msg });
  } else {
    console.log(err, "<<< handle this");
    res.status(500).send({ error: "Server Error!", msg: err });
  }
});

module.exports = app;
