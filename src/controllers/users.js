import { findUserByEmail, findUserByUsername, saveNewUser } from '../repositories/users.js'

export async function save (request, response) {
  const {
    userName,
    fullName,
    password,
    email,
    level
  } = request.body
  const { authenticatedUser } = request

  console.log('[usersController].save() authenticatedUser -> ', authenticatedUser)
  if (authenticatedUser.level !== 'administrator') {
    return response.status(401).json({
      error: 'Usuario não tem privilegio para tal tarefa'
    })
  }
  const userWithEmail = await findUserByEmail(email)
  if (userWithEmail) {
    return response.status(403).json({
      error: 'Já existe um usuario com esse email'
    })
  }
  const userWithUsername = await findUserByUsername(userName)
  if (userWithUsername) {
    return response.status(403).json({
      error: 'Já existe um usuario com esse userName'
    })
  }

  const userSaveOkay = await saveNewUser({ userName, fullName, password, email, level })
  if (userSaveOkay === 'code_error_db') {
    return response.status(500).json({ error: 'Houve algum problema, tentar novamente!' })
  }

  return response.status(201).json(userSaveOkay)
}

export async function getInfoUser (request, response) {
  const { authenticatedUser } = request
  const user = await findUserByUsername(authenticatedUser.userName, ['uuid', 'userName', 'fullName', 'email', 'level', 'status', 'statusHistory', 'createdAt', 'updatedAt'])
  return response.json(user)
}
