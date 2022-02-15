exports.up = async (knex) => {
  const exists = await knex.schema.hasTable('problems');
  if (!exists) {
    return knex.schema.createTable('problems', (table) => {
      table.increments('id').primary();
      table.uuid('uuid').notNullable();
      table.text('description').notNullable();
      table.text('address').notNullable();
      table.decimal('longitude', 10, 8).notNullable();
      table.decimal('latitude', 10, 8).notNullable();
      table.string('reporter_contact');
      table.string('status').notNullable();
      table.timestamps(true, true);
    });
  }
};

exports.down = (knex) => knex.schema.dropTableIfExists('problems');
