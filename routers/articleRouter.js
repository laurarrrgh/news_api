const express = require("express");
const articleRouter = express.Router({ mergeParams: true });
const { getArticle, patchArticle } = require("../controller/articleController");
const { commentRouter } = require("./commentRouter.js");

articleRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle);

articleRouter.use("/:article_id/", commentRouter);

module.exports = { articleRouter };
