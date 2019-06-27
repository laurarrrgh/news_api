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
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.contain.keys("slug", "description");
          });
      });
    });
    describe("GET /users/:username", () => {
      it("status 200: responds with a single user", () => {
        return request
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.contain.keys("username", "name", "avatar_url");
            expect(user).to.eql({
              username: "butter_bridge",
              name: "jonny",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
            });
          });
      });
      it("status 404: when given a user that is not in db", () => {
        return request
          .get("/api/users/laura")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Page Not Found");
          });
      });
    });
    describe("GET /articles/:articleid", () => {
      it("status 200: responds with a single article", () => {
        return request
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.contain.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            );
          });
      });
      it("status 200: objects have a comment count", () => {
        return request
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.comment_count).to.equal("13");
          });
      });
      it("status 404: when given an article id that is not in db", () => {
        return request
          .get("/api/articles/1000000000")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Page Not Found");
          });
      });
      it("status 400: when given an article id that is nonsense", () => {
        return request
          .get("/api/articles/potatoes")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
    });
    describe("PATCH /api/articles/:articleid", () => {
      it("status 200: responds with an updated article with new vote count", () => {
        return request
          .patch("/api/articles/1")
          .expect(200)
          .send({ inc_votes: 100 })
          .then(({ body: { article } }) => {
            console.log({ body: { votes } }, "spec");
            expect(article.votes).to.equal("200");
            //.then(({ body: { article } }) => {
            //console.log(body);
            // expect(body).to.eql({
            //   title: "Living in the shadow of a great man",
            //   topic: "mitch",
            //   author: "butter_bridge",
            //   body: "I find this existence challenging",
            //   created_at: 1542284514171,
            //   votes: 200
          }); /// I dont know why this isnt working!
      });
    });
  });
  describe.only("POST /api/articles/:article_id/comments", () => {
    it("status 201: responds with a new comment obj", () => {
      return request
        .post("/api/articles/1")
        .send({ body: "Northcoders Rules!", created_by: "butter_bridge" })
        .expect(201)
        .then(({ body: { comment: { body } } }) => {
          expect(comment).to.equal({
            body: "Northcoders Rules!",
            belongs_to: "Living in the shadow of a great man",
            created_by: "butter_bridge",
            votes: 0,
            created_at: 1511354163389
          });
        });
    });
  });
});
