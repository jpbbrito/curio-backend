/* eslint-disable import/first */
import loadEnv from './config/load-env.js'
loadEnv()

import knex from 'knex'
import configuration from './knexfile.js'
import Database from './database/index.js'
import app from './src/server.js'
import Redis from './database/redis.js'

console.log('NODE_ENV: ', Object.keys(process.env))
console.log('PWD:', process.env.PWD)
console.log('KNEX.CONFIGURATION', configuration)

async function start () {
  await Database.createConnection(knex, configuration[process.env.NODE_ENV])
  await Redis.createConnection({ url: process.env.REDIS_URL, username: process.env.REDIS_USERNAME, password: process.env.REDIS_PASSWORD })

  app.listen(process.env.API_PORT, () => {
    console.log(`Server running on PORT ${process.env.API_PORT}`)
  })
}

start()
