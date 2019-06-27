const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const {
  handle400errors,
  handleCustomeErrors,
  routeNotFound,
  methodNotAllowed,
  handles500errors
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handle400errors);
app.use(handleCustomeErrors);
app.use(routeNotFound);
app.use(methodNotAllowed);
app.use(handles500errors);

module.exports = { app };
