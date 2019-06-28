const express = require("express");
const articleRouter = express.Router({ mergeParams: true });
const {
  getArticle,
  patchArticle,
  getAllArticles
} = require("../controller/articleController");
const { commentRouter } = require("./commentRouter.js");
const { getCommentsByArticleID } = require("../controller/commentController");

articleRouter.route("/").get(getAllArticles);

articleRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle);

articleRouter.route("/:article_id/comments").get(getCommentsByArticleID); // add .post here & patch/del on comments router

module.exports = { articleRouter };
