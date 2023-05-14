import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { findUserByEmail, updatePasswordUser, findUserByUsername } from '../repositories/users.js'
import {
  matchUser,
  findForgotPasswordTokenByUUIDUser,
  saveForgotPasswordToken,
  updateForgotPasswordToken,
  currentTimestamp
} from './../repositories/auth.js'
import transporterEmail from './../services/nodemailer.js'
import Redis from '../../database/redis.js'

export async function authenticate (request, response) {
  const { userName, password } = request.body
  const result = await matchUser(userName, password)
  if (!result) {
    return response.status(403).json({ error: 'userName or password is wrong' })
  }
  const user = await findUserByUsername(userName)
  const token = jwt.sign({ data: { userName, level: user.level } }, process.env.TOKEN_SECRET, { expiresIn: 30 * 60 })
  const decoded = jwt.decode(token, { complete: true })
  console.log('[auth.authenticate()] token', decoded)
  await Redis.set(`jwt-username-${userName}`, decoded)

  return response.json({
    token
  })
}

export async function forgotPassword (request, response) {
  const { email } = request.body
  const token = crypto.randomBytes(20).toString('hex')
  const message = {
    from: 'reply@projetocurio.com.br', // sender address
    to: email, // list of receivers
    subject: 'Recuperação de senha - Projeto Curio ', // Subject line
    text: `Esse e-mail foi enviado para alteração de senha.\n
        O token abaixo ira expira em 30 minutos \n\n
        Token: ${token}`, // plain text body
    html: `<p> Esse e-mail foi enviado para alteração de senha.
        O token abaixo ira expira em 30 minutos </p> token:<b> ${token}</b>` // html body

  }
  const user = await findUserByEmail(email)

  if (!user) {
    return response.status(404).json({ error: 'Usuario com esse email não foi encontrado!' })
  }

  const forgotPasswordItem = await findForgotPasswordTokenByUUIDUser(user.uuid)

  if (!forgotPasswordItem) {
    const okay = await saveForgotPasswordToken(user.uuid, email, token)
    if (okay === 'code_error_db') {
      return response.status(503).json({ error: 'Deu erro tente novamente!' })
    }
    try {
      await transporterEmail.sendMail(message)
      return response.status(201).json({ message: 'Email enviado com o token!' })
    } catch (err) {
      console.log('transporterEmail.sendMail() err', err)
    }
  }
  const okay = updateForgotPasswordToken(user.uuid, email, token)
  if (okay === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro! tente novamente!' })
  }
  try {
    await transporterEmail.sendMail(message)
    return response.status(201).json({ message: 'Email enviado com o token!' })
  } catch (err) {
    console.log('transporterEmail.sendMail() err', err)
  }
}

export async function resetPassword (request, response) {
  const { email, password, token } = request.body

  const user = await findUserByEmail(email)

  if (!user) {
    return response.status(404).json({ error: 'Usuario com esse email não foi encontrado!' })
  }

  const forgotPasswordItem = await findForgotPasswordTokenByUUIDUser(user.uuid)

  if (!forgotPasswordItem) {
    return response.status(404).json({ error: 'Token não foi criado!' })
  }

  if (forgotPasswordItem.token !== token) {
    console.log('[resetPassword] token invalide -> forgotPasswordItem.token -- ', forgotPasswordItem.token)
    console.log('[resetPassword] token invalide -> token -- ', token)
    return response.status(403).json({
      message: 'Token não existe'
    })
  }
  const now = await currentTimestamp()
  const okay = now < forgotPasswordItem.expireIn
  console.log('[resetPassword] token valide -> ', okay)
  console.log('[resetPassword] token forgotPasswordItem.expireIn -> ', forgotPasswordItem.expireIn)
  console.log('[resetPassword] token now -> ', now)
  if (!okay) {
    return response.status(403).json({
      message: 'Token JWT expirado!'
    })
  }

  const updatedOkay = await updatePasswordUser(user.uuid, password)
  if (updatedOkay === 'code_error_db') {
    console.log('[resetPassword] - erro ao tentar atualizadar senha')
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  return response.status(200).json({
    message: 'Senha alterada'
  })
}
