const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../index.js");

const { formatDate, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex, Promise) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics").insert(topicData);
      const usersInsertions = knex("users").insert(userData);
      return Promise.all([topicsInsertions, usersInsertions])
        .then(() => {
          // console.log(`${topics.length} topics inserted`);
          // console.log(`${users.length} users inserted`);

          const formattedArticles = formatDate(articleData);

          return knex("articles")
            .insert(formattedArticles)
            .returning("*");
        })

        .then(articleRows => {
          // console.log(`${articleRows.length} articles inserted`);

          const articleRef = makeRefObj(articleRows);
          const formattedComments = formatComments(commentData, articleRef);
          return (
            knex("comments")
              .insert(formattedComments)
              //.returning("*")
              .catch(console.log)
          );
        });
    });
};
