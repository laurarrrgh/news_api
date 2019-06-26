const express = require("express");
const apiRouter = express.Router();
const { topicRouter } = require("./topicRouter.js");
const { userRouter } = require("./userRouter.js");
const { articleRouter } = require("./articleRouter.js");

apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);

module.exports = { apiRouter };
