const express = require("express");
const apiRouter = require("./routes/apiRouter.js");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

//endpoint routing

app.use("/", apiRouter);

//invalid url handling

app.use((req, res) => {
  res.status(404).send({ error: "Invalid URL!" });
});

//error handling middleware
app.use((err, req, res, next) => {
  if (err.code === "23503" || err.code === "23502") {
    res.status(400).send({ error: "Bad request! Either artwork object or exhibit ID is invalid." });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ error: err.msg });
  } else next(err);
});


app.use((err, req, res, next) => {
  console.log(err, "<<< handle this");
  res.status(500).send({ error: "Server Error!", msg: err });
});

module.exports = app;
