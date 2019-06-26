exports.up = function(knex, Promise) {
  // console.log("creating topics table...");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug")
      .primary()
      .unique(),
      topicsTable.text("description");
  });
};

exports.down = function(knex, Promise) {
  // console.log("removing topics table...");
  return knex.schema.dropTable("topics");
};
