
export function up (knex) {
  return knex.schema.alterTable('problems', (table) => {
    table.string('reporterName')
    table.string('country')
    table.string('state')
    table.string('city')
    table.string('neighborhood')
    table.json('dataJson')
  })
};

export async function down (knex) {
  // return knex.schema.dropTableIfExists('problems')
}
