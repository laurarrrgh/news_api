const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const {
  handles500errors,
  routeNotFound,
  methodNotAllowed,
  handleCustomeErrors
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use(routeNotFound);
app.use(methodNotAllowed);
app.use(handleCustomeErrors);
app.use(handles500errors);

module.exports = { app };
