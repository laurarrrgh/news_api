const { connection } = require("../connection.js");

const fetchArticle = articleid => {
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

const updateArticle = (article_id, inc_votes) => {
  // console.log(inc_votes, "inc_votes - model");
  // console.log(article_id, "id - controller");
  return connection
    .increment("votes", inc_votes)
    .from("articles")
    .where({ article_id })
    .returning("*");

  // .then(articles => {
  //   if (articles.length === 0) {
  //     return Promise.reject({ status: "404", msg: "Page Not Found" });
  //   }
  //   return article[0];
  // });
};

module.exports = { fetchArticle, updateArticle };
