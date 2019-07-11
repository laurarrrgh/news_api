const express = require("express");
const commentRouter = express.Router({ mergeParams: true });
const { methodNotAllowed } = require("../errors/index");
const {
  patchComment,
  deleteComment
} = require("../controller/commentController");

commentRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(methodNotAllowed);

module.exports = { commentRouter };
