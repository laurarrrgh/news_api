process.env.NODE_ENV = "test";
const chai = require("chai");
const { expect } = require("chai");
const chaiSorted = require("chai-sorted");
const { app } = require("../app");
const request = require("supertest")(app);
const connection = require("../connection");

describe("/api", () => {
  describe("GET /topics", () => {
    it();
  });
});
