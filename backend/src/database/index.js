const knexfile = require('../../knexfile');
// eslint-disable-next-line import/order
const connection = require('knex')(knexfile[process.env.NODE_ENV]);

class Database {
    static connection;

    constructor() {
     }
    setConnection(connection) {
        Database.connection = connection;
    }
    getConnection() {
        return Database.connection
    }
}

async function init() {
    const database = new Database();
    database.setConnection(connection);
};

module.exports = { Database, init };
