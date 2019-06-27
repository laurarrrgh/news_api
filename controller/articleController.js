const { fetchArticle, updateArticle } = require("../models/articleModel.js");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(+article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params; // this isnt coming through
  //console.log(req.params, "req.params - controller");
  // console.log(article_id, "no {} controller");
  // console.log({ article_id }, "article id in { } controller");
  console.log(res);
  updateArticle(inc_votes, article_id)
    .then(([article]) => res.status(200).send(article))
    .catch(next);
};
