require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : process.env.NODE_ENV == 'dev' ? '.env.dev' : '.env.stag' });
const knex = require('knex');
const configuration = require('./knexfile');
const Database = require('./src/database/index');
const app = require('./src/server');

console.log('NODE_ENV: ', Object.keys(process.env));
console.log('TNS_ADMIN: ', process.env.TNS_ADMIN);
console.log('PWD: ', process.env.PWD);


async function start(){
  await Database.createConnection(knex, configuration[process.env.NODE_ENV]);
  app.listen(process.env.PORT, () => {
      console.log('Server running on PORT 3000');
  });
}

start()