export async function up (knex) {
  const exists = await knex.schema.hasTable('images_problems')
  if (!exists) {
    return knex.schema.createTable('images_problems', (table) => {
      table.increments('id').primary()
      table.uuid('uuid').unique().notNullable()
      table.text('base64', 255).notNullable()
      table.string('description')
      table.integer('problemId').unsigned().notNullable()
      table.foreign('problemId').references('id').inTable('problems')
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable()
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable()
    })
  }
};

export async function down (knex) {
  return knex.schema.dropTableIfExists('images_problems')
}
