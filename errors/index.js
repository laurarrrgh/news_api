exports.handles500errors = (err, req, res, next) => {
  res.status(500).send({ msg: err.message });
};
