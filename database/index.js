export default class Database {
    
    static connection 

    static async createConnection(knex, configuration) {

        console.log('[Database] configuration.connection.database :', configuration.connection.database);
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

