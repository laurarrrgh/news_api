const express = require("express");
const topicRouter = express.Router();
const { getTopics } = require("../controller/topicController");
const { methodNotAllowed } = require("../errors/index");

topicRouter
  .route("/")
  .get(getTopics)
  .all(methodNotAllowed);

module.exports = { topicRouter };
