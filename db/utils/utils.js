exports.formatDate = list => {
  const formattedDate = [...list];
  formattedDate.map(ele => {
    ele["created_at"] = new Date(ele["created_at"]);
  });
  return formattedDate;
};

exports.makeRefObj = list => {
  return list.reduce((accumulator, article) => {
    accumulator[article.title] = article.article_id;
    return accumulator;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  let formattedComments = comments.map(comment => ({
    article_id: articleRef[comment.belongs_to],
    body: comment.body,
    author: comment.created_by,
    votes: comment.votes,
    created_at: new Date(comment.created_at)
  }));
  return formattedComments;
};
