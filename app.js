require('dotenv').config({ path: process.env.NODE_ENV === 'local' ? '.local.env' : process.env.NODE_ENV === 'development' ? '.dev.env' : '.env' })
const knex = require('knex')
const configuration = require('./knexfile')
const Database = require('./database/index')
const app = require('./src/server')

console.log('NODE_ENV: ', Object.keys(process.env))
console.log('PWD:', process.env.PWD)
console.log('KNEX.CONFIGURATION', configuration)
async function start () {
  await Database.createConnection(knex, configuration[process.env.NODE_ENV])
  app.listen(process.env.API_PORT, () => {
    console.log(`Server running on PORT ${process.env.API_PORT}`)
  })
}

start()
