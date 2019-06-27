const { connection } = require("../connection.js");

const fetchComments = articleid => {
  return connection
    .from("articles")
    .join("comments", "comments.article_id", "articles.article_id")
    .where("comments.article_id", "=", articleid)
    .select(
      "comment_id",
      "comments.votes",
      "comments.created_at",
      "comments.author",
      "comments.body"
    );
  // .groupBy("comments.comment_id");
  // .then(comments => {
  //   if (article.length === 0) {
  //     return Promise.reject({ status: "404", msg: "Page Not Found" });
  //   }
  //   return comments;
  // });
};

// onhold
const createComment = () => {
  return connection
    .insert({ article_id, author, body })
    .into("comments")
    .returning("*")
    .then(comments => comments[0]);
};

module.exports = { createComment, fetchComments };
