const express = require("express");
const commentRouter = express.Router();
const { postComment } = require("../controller/commentController");

commentRouter.route("/:comment_id").post(postComment);

module.exports = { commentRouter };

// require in the article router??
