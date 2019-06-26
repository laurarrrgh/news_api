exports.handles500errors = (err, req, res, next) => {
  res.status(500).send({ msg: err.message });
};
exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: "Page does not exist" });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};
