exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: "Page Not Found" });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.handleCustomeErrors = (err, req, res, next) => {
  if (err.status === "404") {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handles500errors = (err, req, res, next) => {
  res.status(500).send({ msg: err.message });
};
