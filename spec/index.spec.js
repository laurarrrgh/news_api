process.env.NODE_ENV = "test";
const chai = require("chai");
const { expect } = require("chai");
const chaiSorted = require("chai-sorted");
const { app } = require("../app");
const request = require("supertest")(app);
const { connection } = require("../connection");
chai.use(chaiSorted);

describe("/", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    connection.destroy();
  });
  describe("/api", () => {
    describe("GET /topics", () => {
      it("status:200 responds with an array of topics", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(res => {
            expect(res.body.topics).to.be.an("array");
            // expect(results[0]).to.contain.keys(
            //   "slug", "description"
            // );s
          });
      });
    });
  });
});
