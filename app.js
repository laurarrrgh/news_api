const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const { handles500errors } = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);
app.use(handles500errors);

module.exports = { app };
