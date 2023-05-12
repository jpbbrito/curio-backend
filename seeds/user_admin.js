import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'

export async function seed (knex) {
  const date = new Date()
  const salt = await bcrypt.genSaltSync()
  const passwordHash = await bcrypt.hashSync('admin', salt)
  const user = {
    uuid: randomUUID(),
    fullName: 'Administrator',
    userName: 'admin',
    password: passwordHash,
    email: 'admin@admin.com.br',
    level: 'administrator',
    status: 'enabled',
    statusHistory: JSON.stringify([
      {
        createdAt: date.toISOString(),
        status: 'enabled',
        updatedAt: date.toISOString()
      }
    ])
  }
  const exist = await knex('users').select('*').where('userName', '=', user.userName)

  if (exist.length === 0) {
    return knex('users').insert([
      user
    ])
  };
  console.log('Usuario já existe! ', exist)
};
