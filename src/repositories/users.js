import Database from '../../database/index.js'
import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'

export async function findUserByEmail (email) {
  const user = await Database
    .connection
    .select('')
    .from('users')
    .where('email', '=', email)

  if (user.length === 0) {
    return false
  }
  return user[0]
}

export async function findUserByUUID (uuid, columns = ['*']) {
  const user = await Database
    .connection
    .select(columns)
    .from('users')
    .where('uuid', '=', uuid)

  if (user.length === 0) {
    return false
  }
  return user[0]
}

export async function findUserByUsername (userName, columns = ['*']) {
  const user = await Database
    .connection
    .select(columns)
    .from('users')
    .where('userName', '=', userName)

  if (user.length === 0) {
    return false
  }
  return user[0]
}

export async function updatePasswordUser (uuid, password) {
  const salt = await bcrypt.genSaltSync()
  const passwordHash = await bcrypt.hashSync(password, salt)
  const data = {
    password: passwordHash,
    updatedAt: Database.connection.fn.now()
  }
  try {
    const result = await Database
      .connection('users')
      .where({ uuid })
      .update(data)
    console.log('[updatePasswordUser] -> result', result)
    return true
  } catch (err) {
    console.log('[updatePasswordUser] -> err', err)
    return 'code_error_db'
  }
}

export async function saveNewUser ({ userName, fullName, password, email, level }) {
  const salt = await bcrypt.genSaltSync()
  const date = new Date()
  const passwordHash = await bcrypt.hashSync(password, salt)
  const data = {
    uuid: randomUUID(),
    userName,
    fullName,
    password: passwordHash,
    email,
    level,
    status: 'enabled',
    statusHistory: JSON.stringify([
      {
        createdAt: date.toISOString(),
        status: 'enabled',
        updatedAt: date.toISOString()
      }
    ])
  }
  try {
    const result = await Database
      .connection('users')
      .insert(data)
      .returning(['uuid', 'userName', 'fullName', 'email', 'level', 'createdAt', 'updatedAt'])
    console.log('[saveNewUser] -> result', result)
    return result[0]
  } catch (err) {
    console.log('[saveNewUser] -> err', err)
    return 'code_error_db'
  }
}
