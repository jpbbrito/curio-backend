export async function up (knex) {
  const exists = await knex.schema.hasTable('problems')
  if (!exists) {
    return knex.schema.createTable('problems', (table) => {
      table.increments('id').primary()
      table.uuid('uuid').unique().notNullable()
      table.string('description').notNullable()
      table.string('address').notNullable()
      table.decimal('longitude', 10, 8).notNullable()
      table.decimal('latitude', 10, 8).notNullable()
      table.string('category').notNullable()
      table.string('reporterUsername').notNullable()
      table.string('status').notNullable()
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable()
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable()
    })
  }
};

export async function down (knex) {
  return knex.schema.dropTableIfExists('problems')
}
