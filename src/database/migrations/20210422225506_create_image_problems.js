exports.up = async (knex) => {
  const exists = await knex.schema.hasTable('image_problem');
  if (!exists) {
    return knex.schema.createTable('image_problem', (table) => {
      table.increments('id').primary();
      table.uuid('uuid').notNullable();
      table.string('filename', 255).notNullable();
      table.integer('fk_prob').unsigned().notNullable();
      table.foreign('fk_prob').references('id').inTable('problems');
      table.timestamps(true, true);
    });
  }
};

exports.down = (knex) => knex.schema.dropTableIfExists('image_problem');
