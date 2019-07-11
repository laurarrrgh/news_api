const {
  createComment,
  fetchComments,
  updateComment,
  removeComment
} = require("../models/commentModel.js");

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  fetchComments({ article_id, sort_by, order })
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  createComment(article_id, username, body)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;

  updateComment(comment_id, inc_votes)
    .then(comment => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Page not found"
        });
      }
      res.status(200).send({ comment: comment[0] });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then(deletionCount => {
      if (deletionCount === 0) {
        return Promise.reject({ status: "404", msg: "Page Not Found" });
      } else {
        res.status(204).send();
      }
    })
    .catch(next);
};
