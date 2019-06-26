const express = require("express");
const userRouter = express.Router();
const { getUser } = require("../controller/userController");

userRouter.route("/:username").get(getUser);

module.exports = { userRouter };
