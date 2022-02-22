require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : process.env.NODE_ENV == 'dev' ? '.env.dev' : '.env.stag' });
const knex = require('knex');
const configuration = require('./knexfile');
const Database = require('./src/database/index');
const app = require('./src/server');

console.log('NODE_ENV: ', Object.keys(process.env));
console.log('TNS_ADMIN: ', process.env.TNS_ADMIN);
console.log('PWD: ', process.env.PWD);

// TESTE 
const fs = require('fs');

// directory path
const dir = './files';

// list all files in the directory
fs.readdir(dir, (err, files) => {
    if (err) {
        throw err;
    }

    // files object contains all files names
    // log them on console
    files.forEach(file => {
        console.log('./files ', file);
    });
});

const dirWallet = './files/wallet';

// list all files in the directory
fs.readdir(dirWallet, (err, files) => {
    if (err) {
        throw err;
    }

    // files object contains all files names
    // log them on console
    files.forEach(file => {
        console.log('./files/wallet', file);
    });
});

async function start(){
  await Database.createConnection(knex, configuration[process.env.NODE_ENV]);
  app.listen(process.env.PORT, () => {
      console.log('Server running on PORT 3000');
  });
}

start()
