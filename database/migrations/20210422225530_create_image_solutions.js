exports.up = async (knex) => {
  const exists = await knex.schema.hasTable('images_solutions');
  if (!exists) {
    return knex.schema.createTable('images_solutions', (table) => {
      table.increments('id').primary();
      table.uuid('uuid').unique().notNullable();
      table.string('base64', 255).notNullable();
      table.string('decription', 255);
      table.integer('solutionId').unsigned().notNullable();
      table.foreign('solutionId').references('id').inTable('solutions');
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
    });
  }
};

exports.down = (knex) => knex.schema.dropTableIfExists('images_solutions');
