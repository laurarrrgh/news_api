const { fetchTopics } = require("../models/topicModel");

exports.getTopics = (req, res, next) => {
  // fetchTopics().then(results => {
  res.status(200).send({ message: "some topics here" });
};
