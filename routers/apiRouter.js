const express = require("express");
const apiRouter = express.Router();
const { topicRouter } = require("./topicRouter.js");
const { userRouter } = require("./userRouter.js");

apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);

module.exports = { apiRouter };
