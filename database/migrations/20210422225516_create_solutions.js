export async function up (knex) {
  const exists = await knex.schema.hasTable('solutions')
  if (!exists) {
    return knex.schema.createTable('solutions', (table) => {
      table.increments('id').primary()
      table.uuid('uuid').unique().notNullable()
      table.string('decription', 255).notNullable()
      table.integer('userId').unsigned().notNullable()
      table.foreign('userId').references('id').inTable('users')
      table.integer('problemId').unsigned().notNullable()
      table.foreign('problemId').references('id').inTable('problems')
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable()
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable()
    })
  }
};

export async function down (knex) {
  return knex.schema.dropTableIfExists('solutions')
}
