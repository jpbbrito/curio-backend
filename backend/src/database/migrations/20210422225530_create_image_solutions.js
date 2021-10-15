const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async (knex) => {
  const exists = await knex.schema.hasTable('image_solution');
  if (!exists) {
    return knex.schema.createTable('image_solution', (table) => {
      table.increments('id').primary();
      table.uuid('uuid').notNullable();
      table.string('filename', 255).notNullable();
      table.integer('solution_id').unsigned().notNullable();
      table.foreign('solution_id').references('id').inTable('solutions');
      table.timestamps(true, true);
    }).then(knex.raw(onUpdateTrigger('image_solution')));
  }
};

exports.down = (knex) => knex.schema.dropTableIfExists('image_solution');
