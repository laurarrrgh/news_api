const express = require("express");
const articleRouter = express.Router();
const { getArticles } = require("../controller/articleController");

articleRouter.route("/").get(getArticles);

module.exports = { articleRouter };
