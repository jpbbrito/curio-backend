exports.up = async (knex) => {
  const exists = await knex.schema.hasTable('image_solution');
  if (!exists) {
    return knex.schema.createTable('image_solution', (table) => {
      table.increments('id').primary();
      table.uuid('uuid').notNullable();
      table.string('filename', 255).notNullable();
      table.integer('fk_solu').unsigned().notNullable();
      table.foreign('fk_solu').references('id').inTable('solutions');
      table.timestamps(true, true);
    });
  }
};

exports.down = (knex) => knex.schema.dropTableIfExists('image_solution');
