const express = require("express");
const apiRouter = express.Router();
const { topicRouter } = require("./topicRouter.js");
const { userRouter } = require("./userRouter.js");
const { articleRouter } = require("./articleRouter.js");
const { commentRouter } = require("./commentRouter.js");
const { getAllEndpoints } = require("../controller/endPointsController");
const { methodNotAllowed } = require("../errors/index");

apiRouter
  .route("/")
  .get(getAllEndpoints)
  .all(methodNotAllowed);

apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

module.exports = { apiRouter };
