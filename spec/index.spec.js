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
      describe("default behaviour", () => {
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
    });
    describe("GET /users/:username", () => {
      describe("default behaviour", () => {
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
        describe("error handling", () => {
          it("status 404: when given a user that is not in db", () => {
            return request
              .get("/api/users/laura")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Page Not Found");
              });
          });
        });
      });
    });
    describe("GET /articles/:articleid", () => {
      describe("default behavior", () => {
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
        describe("error handling", () => {
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
      });
    });
    describe("PATCH /api/articles/:articleid", () => {
      describe("default behaviour", () => {
        it("status 200: responds with an updated article with new vote count", () => {
          return request
            .patch("/api/articles/1")
            .expect(200)
            .send({ inc_votes: 100 })
            .then(({ body: { article } }) => {
              expect(article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2018-11-15T12:21:54.171Z",
                votes: 200
              });
            });
        });
        describe("error handling", () => {
          it("ERROR: No votes on request body", () => {
            return request
              .patch("/api/articles/1")
              .send({})
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("Bad Request");
              });
          });
          it("ERROR: Invalid inc_votes", () => {
            return request
              .patch("/api/articles/1")
              .send({ inc_votes: "cat" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("Bad Request");
              });
          });
          it("ERROR: additional properties on the request body", () => {
            return request
              .patch("/api/articles/1")
              .send({ inc_votes: "cat", name: "Mitch" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("Bad Request");
              });
          });
        });
      });
    });
    describe("POST /api/articles/:article_id/comments", () => {
      describe("default behaviour", () => {
        it("status 201: responds with a new comment obj", () => {
          return request
            .post("/api/articles/1/comments")
            .send({
              body: "When life gives you shadows, make shadow puppets",
              created_by: "butter_bridge"
            })
            .expect(201)
            .then(({ body: { comment: { body } } }) => {
              expect(comment).to.equal({
                body: "When life gives you shadows, make shadow puppets",
                belongs_to: "Living in the shadow of a great man",
                created_by: "butter_bridge",
                votes: 0,
                created_at: 1511354163389
              });
            });
        });
        describe("error handling", () => {
          // it("ERROR 400: when posting a value of incorrect type", () => {});
          // it("ERROR 400: when post body is missing a required column", () => {});
          // it("ERROR 400: when post body tries to add a value to a non=existant column", () => {});
          // it("ERROR 422: when posting to an integer article_id that does not exist", () => {});
          // it("ERROR 404: when posting to a nonsense article_id", () => {});
        });
      });
    });
    describe("GET /api/articles/:article_id/comments", () => {
      describe("default behaviour", () => {
        it("status 200: responds with an array of comments for the given article ID", () => {
          return request
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments[0]).to.contain.keys(
                "comment_id",
                "votes",
                "author",
                "created_at",
                "body"
              );
            });
        });
        describe("error handling", () => {
          it("ERROR status 404: when given an article id that is not in db", () => {
            return request
              .get("/api/articles/1000000000/comments")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Page Not Found");
              });
          });
          it("ERROR status 400: when given an article id that is nonsense", () => {
            return request
              .get("/api/articles/potatoes/comments")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          describe("queries", () => {
            it("sorts the given articles by a valid column ID", () => {
              return request
                .get("/api/articles/1/comments?sort_by=votes")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.sortedBy("votes", {
                    descending: false
                  });
                });
            });
            it("sort order defaults to created_at", () => {
              return request
                .get("/api/articles/1/comments?sort_by=created_at")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.sortedBy("created_at", {
                    descending: true
                  });
                });
            });
            // it("order can be set to either ascending or descending", () => {});
            // it("order defaults to descending", () => {});
            // it("when passed an invalid column to sort by defaults to created_at - decending", () => {});
          });
        });
        describe.only("GET /api/articles", () => {
          describe("default behaviour", () => {
            it("status 200: responds with an array of articles", () => {
              return request
                .get("/api/articles/")
                .expect(200)
                .then(({ body: articles }) => {
                  expect(articles).to.be.an("array");
                  expect(articles[0]).to.contain.keys(
                    "article_id",
                    "title",
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
          });
          describe("error handling", () => {});
          describe("queries", () => {});
        });
      });
    });
  });
});
