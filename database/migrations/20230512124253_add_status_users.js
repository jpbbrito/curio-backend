
export function up (knex) {
  return Promise.all([
    knex.schema.alterTable('users', (table) => {
      table.string('status')
    })
  ])
};

export function down (knex) {

};
