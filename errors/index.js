exports.handle400errors = (err, req, res, next) => {
  const codes = ["22P02", "22003"];
  if (codes.includes(err.code)) res.status(400).send({ msg: "Bad Request" });
  else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  console.log(err);
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "23503") {
    res.status(422).send({ msg: "ID does not exist" });
  } else {
    next(err);
  }
};

exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: "Page Not Found" });
};

exports.methodNotAllowed = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.handles500errors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: err.message });
};
