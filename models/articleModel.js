const { connection } = require("../connection.js");
const fetchArticle = articleid => {
  const sortByParams = [
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_id",
    "comment_count"
  ];
  return connection
    .from("articles")
    .where("articles.article_id", "=", articleid)
    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: "404", msg: "Page Not Found" });
      }
      return article[0];
    });
};

const updateArticle = (inc_votes = 0, article_id) => {
  return connection
    .increment("votes", inc_votes)
    .from("articles")
    .where({ article_id })
    .returning("*");
};

const fetchAllArticles = ({ sort_by, order, author, topic }) => {
  if (!["asc", "desc", undefined].includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return connection
      .select(
        "articles.author",
        "articles.title",
        "articles.article_id",
        "articles.topic",
        "articles.created_at",
        "articles.votes"
      )
      .from("articles")
      .count({ comment_count: "comment_id" })
      .leftJoin("comments", "comments.article_id", "articles.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by || "created_at", order || "desc")
      .modify(query => {
        if (author) query.where({ "articles.author": author });
        if (topic) query.where({ "articles.topic": topic });
      })
      .then(articles => {
        if (articles.length === 0) {
          return Promise.reject({ status: "404", msg: "Page Not Found" });
        }
        return articles;
      });
  }
};

module.exports = { fetchArticle, updateArticle, fetchAllArticles };
