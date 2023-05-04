
export function up (knex) {
    return Promise.all([
        knex.schema.alterTable('problems', (table) => {
            table.json('statusHistory')
        }),
        knex.schema.alterTable('solutions', (table) => {
            table.json('statusHistory')
        }),
        knex.schema.alterTable('users', (table) => {
            table.json('statusHistory')
        }),
    ]) 
};

export function down (knex) {
  
};
