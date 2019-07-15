const { connection } = require("../connection.js");

const fetchComments = ({ article_id, sort_by, order }) => {
  if (!["asc", "desc", undefined].includes(order))
    return Promise.reject({ status: 400, msg: "Bad Request" });

  return connection
    .from("articles")
    .join("comments", "comments.article_id", "articles.article_id")
    .select(
      "comment_id",
      "comments.votes",
      "comments.created_at",
      "comments.author",
      "comments.body"
    )
    .where("comments.article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({ status: "404", msg: "Page Not Found" });
      } else {
        return comments;
      }
    });
};

const createComment = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request"
    });
  } else {
    return connection
      .insert({ author: username, body, article_id })
      .into("comments")
      .where({ article_id })
      .returning("*");
  }
};

const updateComment = (comment_id, inc_votes = 0) => {
  return connection
    .select("comments.*")
    .from("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*");
};

const removeComment = comment_id => {
  return connection
    .from("comments")
    .where("comments.comment_id", "=", comment_id)
    .del();
};

module.exports = {
  createComment,
  fetchComments,
  updateComment,
  removeComment
};
