process.env.NODE_ENV = "test";
const chai = require("chai");
const { expect } = require("chai");
const chaiSorted = require("chai-sorted");
const { app } = require("../app");
const request = require("supertest")(app);
const { connection } = require("../connection");
const endPointData = require("../endpoints.json");
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
        it("status 200: responds with an array of topics", () => {
          return request
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
              expect(body.topics).to.be.an("array");
              expect(body.topics[0]).to.contain.keys("slug", "description");
            });
        });
        describe("error handling", () => {
          it("ERROR 405: when invalid method is applied", () => {
            const invalidMethods = ["put", "patch", "post", "delete"];
            const methodPromises = invalidMethods.map(method => {
              return request[method]("/api/topics")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Method Not Allowed");
                });
            });
            return Promise.all(methodPromises);
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
          it("ERROR 404: when given a user that is not in db", () => {
            return request
              .get("/api/users/laura")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Page Not Found");
              });
          });
          it("ERROR 405: when invalid method is applied", () => {
            const invalidMethods = ["put", "patch", "delete"];
            const methodPromises = invalidMethods.map(method => {
              return request[method]("/api/users/butter_bridge")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Method Not Allowed");
                });
            });
            return Promise.all(methodPromises);
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
          it("ERROR 404: when given an article id that is not in db", () => {
            return request
              .get("/api/articles/1000000000")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Page Not Found");
              });
          });
          it("ERROR 400: when given an article id that is nonsense", () => {
            ``;
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
          it("ERROR 400: No votes on request body", () => {
            return request
              .patch("/api/articles/1")
              .send({})
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("Bad Request");
              });
          });
          it("ERROR 400: Invalid inc_votes", () => {
            return request
              .patch("/api/articles/1")
              .send({ inc_votes: "cat" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("Bad Request");
              });
          });
          it("ERROR 400: additional properties on the request body", () => {
            return request
              .patch("/api/articles/1")
              .send({ inc_votes: "cat", name: "Mitch" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("Bad Request");
              });
          });
          it("ERROR 405 when invalid method is applied", () => {
            const invalidMethods = ["put", "post", "delete"];
            const methodPromises = invalidMethods.map(method => {
              return request[method]("/api/articles/1/")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Method Not Allowed");
                });
            });
            return Promise.all(methodPromises);
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
              username: "butter_bridge",
              body: "When life gives you shadows, make shadow puppets"
            })
            .expect(201)
            .then(({ body: { comment } }) => {
              expect(comment.author).to.equal("butter_bridge");
              expect(comment.body).to.equal(
                "When life gives you shadows, make shadow puppets"
              );
            });
        });
        describe("error handling", () => {
          it("ERROR 400: when post body is missing a required column", () => {
            return request
              .post("/api/articles/1/comments")
              .send({})
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("Bad Request");
              });
          });
          it("ERROR 422: when posting to an integer article_id that does not exist", () => {
            return request
              .post("/api/articles/100000/comments")
              .send({
                username: "butter_bridge",
                body: "When life gives you shadows, make shadow puppets"
              })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("ID does not exist");
              });
          });
          it("ERROR 400: when posting to a nonsense article_id", () => {
            return request
              .post("/api/articles/bananas/comments")
              .send({
                username: "butter_bridge",
                body: "When life gives you shadows, make shadow puppets"
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("Bad Request");
              });
          });
          it("ERROR 405 when invalid method is applied", () => {
            const invalidMethods = ["put", "patch", "delete"];
            const methodPromises = invalidMethods.map(method => {
              return request[method]("/api/articles/1/comments")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Method Not Allowed");
                });
            });
            return Promise.all(methodPromises);
          });
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
          it("ERROR 404: when given an article id that is not in db", () => {
            return request
              .get("/api/articles/1000000000/comments")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Page Not Found");
              });
          });
          it("ERROR 400: when given an article id that is nonsense", () => {
            return request
              .get("/api/articles/potatoes/comments")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          it("ERROR 405 when invalid method is applied", () => {
            const invalidMethods = ["patch", "delete"];
            const methodPromises = invalidMethods.map(method => {
              return request[method]("/api/articles/1/comments")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Method Not Allowed");
                });
            });
            return Promise.all(methodPromises);
          });
          describe("queries", () => {
            it("QUERY: sorts the given articles by a valid column ID", () => {
              return request
                .get("/api/articles/1/comments?sort_by=votes")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.sortedBy("votes", {
                    descending: true
                  });
                });
            });
            it("QUERY: sort order defaults to created_at", () => {
              return request
                .get("/api/articles/1/comments?sort_by=created_at")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.sortedBy("created_at", {
                    descending: true
                  });
                });
            });
            it("QUERY: order can be set to either ascending or descending", () => {
              return request
                .get("/api/articles/1/comments?order=desc")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.sortedBy("created_at", {
                    descending: true
                  });
                });
            });
            it("QUERY: order can be set to either ascending or descending", () => {
              return request
                .get("/api/articles/1/comments?order=asc")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.sortedBy("created_at", {
                    descending: false
                  });
                });
            });
            it("QUERY ERROR 400: when passed an invalid column to sort by", () => {
              return request
                .get("/api/articles/1/comments?order=potatoes")
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Bad Request");
                });
            });
          });
        });
      });
    });
    describe("GET /api/articles", () => {
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
      describe("error handling", () => {
        it("ERROR 405: when invalid method applied", () => {
          const invalidMethods = ["put", "post", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request[method]("/api/articles/1")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
      describe("queries", () => {
        it("QUERY: sorts the given articles by any valid column ID, including author and topic", () => {
          const availableQueries = ["author", "title", "topic", "created_at"];
          return request
            .get("/api/articles/?sort_by=author")
            .expect(200)
            .then(({ body }) => {
              console.log(body.articles, "body.article");
              expect(body).to.be.sortedBy("author", {
                descending: true
              });
            });
        });
        it("QUERY: order can be set to ascending or descending but defaults to descending", () => {
          return request
            .get("/api/articles/?sort_by=created_at")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.be.sortedBy("created_at", {
                descending: true
              });
            });
        });
        it("QUERY: sort order defaults to date", () => {
          return request
            .get("/api/articles?sort_by=created_at")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.be.sortedBy("created_at", {
                descending: true
              });
            });
        });
        it("QUERY: when passed an invalid column to sort by, will default to created_at & desc", () => {
          return request
            .get("/api/articles/?order=potatoes")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.be.sortedBy("created_at", {
                descending: true
              });
            });
        });
      });
    });
    describe("PATCH /api/comments/:comment_id", () => {
      describe("default behaviour", () => {
        it("status 200: responds with an updated article with new vote count", () => {
          return request
            .patch("/api/comments/1")
            .expect(200)
            .send({ inc_votes: 100 })
            .then(({ body: { comment } }) => {
              expect(comment).to.eql({
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 116,
                created_at: "2017-11-22T12:36:03.389Z",
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
        describe("error handling", () => {
          it("ERROR 404: when given an article id that is nonsense", () => {
            return request
              .patch("/api/comments/cats")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          it("ERROR 404: when given an article id that is not in db", () => {
            return request
              .patch("/api/comments/1000000000000")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          it("ERROR 405: when invalid method applied", () => {
            const invalidMethods = ["put", "get", "post"];
            const methodPromises = invalidMethods.map(method => {
              return request[method]("/api/comments/1")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Method Not Allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
    describe("DELETE /api/comments/:comment_id", () => {
      describe("default behaviour", () => {
        it("status 204: deletes entry and returns an empty obj", () => {
          return request
            .delete("/api/comments/2")
            .expect(204)
            .then(({ deletionCount }) => {
              expect(deletionCount).to.equal();
            });
        });
        describe("error handling", () => {
          it("ERROR 404: when given an article id that is not in db", () => {
            return request
              .delete("/api/comments/1000000000/")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Page Not Found");
              });
          });
          it("ERROR 400: when given an article id that is nonsense", () => {
            return request
              .delete("/api/comments/potatoes/")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          it("ERROR 405: when invalid method applied", () => {
            const invalidMethods = ["put", "get"];
            const methodPromises = invalidMethods.map(method => {
              return request[method]("/api/comments/2")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Method Not Allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
    describe("GET /api", () => {
      describe("default behaviour", () => {
        it("status 200: returns JSON describing all the available endpoints", () => {
          return request
            .get("/api")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.eql(endPointData);
            });
        });
      });
      describe("error handling", () => {
        it(" ERROR 404: cannot find end-point", () => {
          return request.get("/bananas").expect(404);
        });
        it("ERROR 405: when invalid method applied", () => {
          const invalidMethods = ["put", "patch", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request[method]("/api")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
});
