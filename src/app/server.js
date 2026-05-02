const express = require("express");
const routes = require("../routes/index.routes");

const app = express();

app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({
    message: "API de juegos de mesa funcionando",
  });
});

module.exports = app;
