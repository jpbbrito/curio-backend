exports.up = async (knex) => {
  const exists = await knex.schema.hasTable('solutions');
  if (!exists) {
    return knex.schema.createTable('solutions', (table) => {
      table.increments('id').primary();
      table.uuid('uuid').notNullable();
      table.string('decription', 255).notNullable();
      table.integer('fk_user').unsigned().notNullable();
      table.foreign('fk_user').references('id').inTable('users');
      table.integer('fk_prob').unsigned().notNullable();
      table.foreign('fk_prob').references('id').inTable('problems');
      table.timestamps(true, true);
    });
  }
};

exports.down = (knex) => knex.schema.dropTableIfExists('solutions');
