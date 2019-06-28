const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const {
  routeNotFound,
  handle400errors,
  handleCustomErrors,
  methodNotAllowed,
  handles500errors
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);
app.use(routeNotFound);

app.use(handle400errors);
app.use(handleCustomErrors);
app.use(methodNotAllowed);
app.use(handles500errors);

module.exports = { app };
