const express = require("express");
const topicRouter = express.Router();
const { getTopics } = require("../controller/topicController");

topicRouter.route("/").get(getTopics);

module.exports = { topicRouter };
