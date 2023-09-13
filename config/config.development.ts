export const config = () => ({
  database: {
    username: process.env.DEV_DB_USERNAME || 'root',
    password: process.env.DEV_DB_PASSWORD || 'root',
    database: process.env.DEV_DB_DATABASE || 'todolist',
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 5432,
    dialect: 'postgres',
  },
});
