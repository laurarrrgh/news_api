const {
  fetchArticle,
  updateArticle,
  fetchAllArticles
} = require("../models/articleModel.js");

exports.getArticle = (req, res, next) => {
  const { article_id, sort_by, order_by } = req.params;
  fetchArticle(+article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  // if (inc_votes === undefined || !Number.isInteger(inc_votes)) {
  //   return next({ status: 400, msg: "Bad Request" });
  // } else
  updateArticle(inc_votes, article_id)
    .then(([article]) => res.status(200).send({ article }))
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  fetchAllArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
