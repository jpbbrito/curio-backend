const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async (knex) => {
  const exists = knex.schema.hasTable('users');
  if (!exists) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.uuid('uuid').notNullable();
      table.string('username', 255).unique().notNullable();
      table.string('fullname', 255).notNullable();
      table.timestamps(true, true);
    }).then(knex.raw(onUpdateTrigger('users')));
  }
};
exports.down = (knex) => knex.schema.dropTableIfExists('users');
