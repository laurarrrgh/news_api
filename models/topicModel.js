const { connection } = require("../connection.js");

const fetchTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};

module.exports = { fetchTopics };
