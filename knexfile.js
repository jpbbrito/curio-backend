module.exports = {
  development: {
    client: 'oracledb',
    connection: {
      connectString: process.env.DATABASE_CONNECTION_STRING,
      user:  process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations/',
    },
  },
  stagging: {
    client: 'oracledb',
    connection: {
      connectString: process.env.DATABASE_CONNECTION_STRING,
      user:  process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations/',
    },
  },
  production: {
    client: 'oracledb',
    connection: {
      connectString: process.env.DATABASE_CONNECTION_STRING,
      user:  process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations/',
    },
  },

};
