const express = require("express");
const path = require("path");
const routes = require("../routes/index.routes");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../..")));
app.use("/api", routes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../index.html"));
});

module.exports = app;
