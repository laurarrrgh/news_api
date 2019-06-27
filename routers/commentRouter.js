const express = require("express");
const commentRouter = express.Router();
const {
  postComment,
  getCommentsByArticleID
} = require("../controller/commentController");

commentRouter
  .route("/") //may need to be '/'
  .get(getCommentsByArticleID)
  .post(postComment);

module.exports = { commentRouter };
