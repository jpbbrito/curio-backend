import jwt from 'jsonwebtoken'

export async function authenticateToken (request, response, next) {
  console.log('[authenticateToken.js] request.headers', request.headers)
  const token = request.headers.authorization.split(' ')[1]

  if (token == null) return response.status(401).json({ error: 'token invalido!' })

  jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
    if (err) return response.status(401).json({ error: 'token invalido!' })
    console.log('jwt.verify() -> ', data)
    request.authenticatedUser = {
      ...data.data
    }
    return next()
  })
}

export async function validationAuthenticate (request, response, next) {
  const { userName, password } = request.body
  if (!userName || !password || userName.length === 0 || password.length === 0) {
    return response.status(400).json({
      error: 'userName e/ou password não foram enviados!'
    })
  }
  return next()
}

export async function validationForgotPassword (request, response, next) {
  const { email } = request.body
  if (!email || email.length === 0) {
    return response.status(400).json({
      error: 'email não foi enviado!'
    })
  }
  return next()
}

export async function validationResetPassword (request, response, next) {
  const { email, password, token } = request.body
  if (
    !email || email.length === 0 ||
        !password || password.length === 0 ||
        !token || token.length === 0
  ) {
    return response.status(400).json({
      error: 'email e/ou password e/ou token não fooram enviados!'
    })
  }
  return next()
}
