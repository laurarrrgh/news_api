exports.up = function(knex, Promise) {
  console.log("creating articles table...");
  return knex.schema.createTable("artcles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title");
    articlesTable.string("body");
    articlesTable.integer("votes").defaultTo(0);
    articlesTable.string("topic").references("topics.slug");
    articlesTable.string("author").references("users.username");
    articlesTable.timestamps("created_at");
  });
};

exports.down = function(knex, Promise) {
  console.log("removing articles table...");
  return knex.schema.dropTable("articles");
};
