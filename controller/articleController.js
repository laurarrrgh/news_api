const { fetchArticle, updateArticle } = require("../models/articleModel.js");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(+article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(console.log);
};

exports.patchArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  if (inc_votes === undefined || !Number.isInteger(inc_votes)) {
    return next({ status: 400, msg: "Bad Request" });
  } else
    updateArticle(inc_votes, article_id)
      .then(([article]) => res.status(200).send({ article }))
      .catch(next);
};

// custom err?
// promise.reject
// .then(article => {
//   if ({article_id} === 0 || ) {
//     return Promise.reject({ status: "400", msg: "Bad Request" });
//   }
//   return article[0];
// });
