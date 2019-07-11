const express = require("express");
const userRouter = express.Router();
const { getUser } = require("../controller/userController");
const { methodNotAllowed } = require("../errors/index");

userRouter
  .route("/:username")
  .get(getUser)
  .all(methodNotAllowed);

module.exports = { userRouter };
