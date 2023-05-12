
export async function up (knex) {
  const exist = await knex.schema.hasTable('forgot_password')
  if (!exist) {
    return knex.schema.createTable('forgot_password', (table) => {
      table.increments('id').primary()
      table.string('emailUser').notNullable()
      table.timestamp('expireIn').defaultTo(knex.raw('? + INTERVAL \'? minutes\'', [knex.fn.now(), 30])).notNullable()
      table.string('token', 255).notNullable()
      table.string('uuidUser').notNullable()
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable()
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable()
    })
  }
};

export function down (knex) {

};
