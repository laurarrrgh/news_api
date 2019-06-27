const { connection } = require("../connection.js");
const createComment = (article_id, author, body) => {
  return connection("comments")
    .insert({ article_id, author, body })
    .returning("*");
};

module.exports = { createComment };
