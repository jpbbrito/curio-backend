
if(!process.env.NODE_ENV) {
  require('dotenv').config({ path: '.dev.env' });
}

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
      directory: './database/migrations/',
    },
  },
  staging: {
    client: 'oracledb',
    connection: {
      connectString: process.env.DATABASE_CONNECTION_STRING,
      user:  process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './database/migrations/',
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
      directory: './database/migrations/',
    },
  },

};
