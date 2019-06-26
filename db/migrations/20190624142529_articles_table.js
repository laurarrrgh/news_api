exports.up = function(knex, Promise) {
  // console.log("creating articles table...");
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title");
    articlesTable.text("body");
    articlesTable.integer("votes").defaultTo(0);
    articlesTable.string("topic").references("topics.slug");
    articlesTable.string("author").references("users.username");
    articlesTable.timestamps("created_at");
  });
};

exports.down = function(knex, Promise) {
  // console.log("removing articles table...");
  return knex.schema.dropTable("articles");
};
