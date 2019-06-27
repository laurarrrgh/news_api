const { createComment } = require("../models/commentModel.js");

exports.postComment = (req, res, next) => {
  createComment(
    req.params["article_id"],
    req.body["username"],
    req.body["body"]
  )
    .then(([comment]) => {
      return res.status(201).send({ comment });
    })
    .catch(next);
};
