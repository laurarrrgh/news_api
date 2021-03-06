const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      username: "laura",
      password: "Northcoders2019!"
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      username: "laura",
      password: "Northcoders2019!"
    }
  }
};

module.exports = { ...baseConfig, ...customConfig[ENV] };
