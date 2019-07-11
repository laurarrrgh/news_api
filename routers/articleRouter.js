const express = require("express");
const articleRouter = express.Router({ mergeParams: true });
const {
  getArticle,
  patchArticle,
  getAllArticles
} = require("../controller/articleController");
const {
  getCommentsByArticleID,
  postComment
} = require("../controller/commentController");

const { methodNotAllowed } = require("../errors/index");

articleRouter.route("/").get(getAllArticles);

articleRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .all(methodNotAllowed);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleID)
  .post(postComment) // add .post here & patch/del on comments router
  .all(methodNotAllowed);

module.exports = { articleRouter };
