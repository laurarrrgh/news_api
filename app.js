const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const {
  handles500errors,
  routeNotFound,
  methodNotAllowed
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);
app.use(handles500errors);
app.use(routeNotFound);
app.use(methodNotAllowed);

module.exports = { app };
