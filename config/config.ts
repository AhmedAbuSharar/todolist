const { config } = require('dotenv');

config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME || 'root',
    password: process.env.DEV_DB_PASSWORD || 'root',
    database: process.env.DEV_DB_DATABASE || 'todolist',
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 5432,
    dialect: 'postgres',
  },
  test: {
    username: process.env.TEST_DB_USERNAME || 'root',
    password: process.env.TEST_DB_PASSWORD || 'root',
    database: process.env.TEST_DB_DATABASE || 'todolist',
    host: process.env.TEST_DB_HOST || 'localhost',
    port: process.env.TEST_DB_PORT || 5432,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'todolist',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
  },
};
