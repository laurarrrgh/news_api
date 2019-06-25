process.env.NODE_ENV = "test";
const chai = require("chai");
const { expect } = require("chai");
const chaiSorted = require("chai-sorted");
const { app } = require("../app");
const request = require("supertest")(app);
const connection = require("../connection");
chai.use(chaiSorted);

describe("/", () => {
  describe("/api", () => {
    // beforeEach(() => {
    //   return connection.seed.run();
    // });
    // after(() => {
    //   return connection.destroy();
    // });

    describe("GET /topics", () => {
      it("status:200 responds with an array of topics", () => {
        return request.get("/api/topics").expect(200);
      });
    });
  });
});
