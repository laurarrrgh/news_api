const { connection } = require("../connection.js");

const fetchUser = username => {
  return connection
    .from("users")
    .where("username", "=", username)
    .returning("*")
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({ status: "404", msg: "Page Not Found" });
      }
      return user[0];
    });
};

module.exports = { fetchUser };
