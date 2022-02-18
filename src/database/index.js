class Database {
    static connection;
    constructor() {

    }
    static async createConnection(knex, configuration) {
        console.log('NODE_ENV :', Object.keys(configuration.connection.connectString));
        try {
            this.connection = await knex(configuration);
            console.log('Database working');
            return this.connection;
        } catch (errors) {
            console.log('Error to connect DB ->', errors);
        }
    }
    static getConnection() {
        return Database.connection;
    }
}

module.exports = Database;
