require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : process.env.NODE_ENV == 'development' ? '.env.dev' : '.env'
});
const knex = require('knex');
const configuration = require('./knexfile');
const Database = require('./src/database/index');
const app = require('./src/server');

async function start(){
  await Database.createConnection(knex, configuration[process.env.NODE_ENV]);
  app.listen(process.env.PORT, () => {
      console.log('Server running on PORT 3000');
  });
}

start()