const { createComment, fetchComments } = require("../models/commentModel.js");

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  fetchComments(+article_id)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(console.log);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  // console.log(req);
  // console.log(article_id);

  createComment(req.body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(console.log);
};
// const { article_id } = req.params;
// console.log(article_id);
// const { article_id } = req.params["article_id"];
// const { author } = req.body["username"];
// const { body } = req.body["body"];
// console.log( article_id );
// console.log(author);
// console.log(body);
// createComment(article_id, author, body)
//   .then(comment => {
//     return res.status(201).send({ comment });
//   })
//   .catch(next);
// };
