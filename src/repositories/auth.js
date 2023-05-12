import Database from '../../database/index.js'
import bcrypt from 'bcrypt'

export async function matchUser (userName, password) {
  const user = await Database.connection.select('userName', 'password').from('users')
    .where('userName', '=', userName)
  if (user.length === 0) {
    return false
  }
  const samePassword = bcrypt.compareSync(password, user[0].password)
  if (!samePassword) {
    return false
  }
  return true
}

export async function saveForgotPasswordToken (uuid, email, token) {
  const data = {
    uuidUser: uuid,
    emailUser: email,
    token
  }

  try {
    await Database
      .connection('forgot_password')
      .insert(data)
    console.log('[saveForgotPasswordToken] token inserido no bando -> ', data)
    return true
  } catch (err) {
    console.log('[saveForgotPasswordToken] ERRO ao Inserir no Banco', err)
    return 'code_error_db'
  }
}

export async function findForgotPasswordTokenByUUIDUser (uuid) {
  const forgotPasswordItem = await Database
    .connection
    .select('*')
    .from('forgot_password')
    .where('uuidUser', '=', uuid)
  if (forgotPasswordItem.length === 0) {
    return false
  }
  return forgotPasswordItem[0]
}

export async function updateForgotPasswordToken (uuid, email, token) {
  const data = {
    emailUser: email,
    token,
    expireIn: Database.connection.raw("CURRENT_TIMESTAMP + INTERVAL '30 minutes'"),
    updatedAt: Database.connection.fn.now()
  }
  console.log('[updateForgotPasswordToken] -> atualizando token -> uuid ', uuid, data)
  try {
    await Database
      .connection('forgot_password')
      .where({ uuidUser: uuid })
      .update(data)
    return true
  } catch (err) {
    console.log('[updateForgotPasswordToken] -> errors ', err)
    return 'code_error_db'
  }
}

export async function currentTimestamp () {
  const timestamp = await Database
    .connection
    .raw('SELECT CURRENT_TIMESTAMP')
  console.log('[currentTimestamp] ->', timestamp.rows[0].current_timestamp)
  return timestamp.rows[0].current_timestamp
}
