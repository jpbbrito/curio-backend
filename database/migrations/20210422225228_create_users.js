
export async function up (knex) {
  const exists = await knex.schema.hasTable('users')
  if (!exists) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable()
      table.string('userName', 255).unique().notNullable()
      table.string('fullName', 255).notNullable()
      table.string('password', 255).notNullable()
      table.string('email', 255).unique().notNullable()
      table.string('level', 20).notNullable()
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable()
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable()
    })
  }
}

export async function down (knex) {
  return knex.schema.dropTableIfExists('users')
}
