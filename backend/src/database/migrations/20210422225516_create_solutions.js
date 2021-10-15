const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async (knex) => {
  const exists = await knex.schema.hasTable('solutions');
  if (!exists) {
    return knex.schema.createTable('solutions', (table) => {
      table.increments('id').primary();
      table.uuid('uuid').notNullable();
      table.string('decription', 255).notNullable();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users');
      table.integer('problem_id').unsigned().notNullable();
      table.foreign('problem_id').references('id').inTable('problems');
      table.timestamps(true, true);
    }).then(knex.raw(onUpdateTrigger('solutions')));
  }
};

exports.down = (knex) => knex.schema.dropTableIfExists('solutions');
