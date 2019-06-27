const express = require("express");
const articleRouter = express.Router();
const { getArticle, patchArticle } = require("../controller/articleController");
const { commentRouter } = require("./commentRouter.js");

articleRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle);

articleRouter.route("/:article_id/comments", commentRouter);

module.exports = { articleRouter };
