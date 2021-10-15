const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async (knex) => {
  const exists = await knex.schema.hasTable('image_problem');
  if (!exists) {
    return knex.schema.createTable('image_problem', (table) => {
      table.increments('id').primary();
      table.uuid('uuid').notNullable();
      table.string('filename', 255).notNullable();
      table.integer('problem_id').unsigned().notNullable();
      table.foreign('problem_id').references('id').inTable('problems');
      table.timestamps(true, true);
    }).then(knex.raw(onUpdateTrigger('image_problem')));
  }
};

exports.down = (knex) => knex.schema.dropTableIfExists('image_problem');
