export async function usersSaveValidation (request, response, next) {
  const mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  const {
    userName,
    fullName,
    password,
    email,
    level
  } = request.body

  const errors = []
  if (!userName || userName.length < 5) {
    errors.push({ userName: 'Esse campo deve ter no minimo 6 caracteres' })
  }
  if (!password || password.length < 6) {
    errors.push({ password: 'Esse campo deve ter no minimo 6 caracteres' })
  }
  if (!fullName || fullName.length < 8) {
    errors.push({ fullName: 'Esse campo deve ter no minimo 8 caracteres' })
  }
  if (!email || !email.match(mailFormat)) {
    errors.push({ email: 'Esse campo deve ter o formato de email adequado ex: "algum@mail.com"' })
  }
  if (!level || (level !== 'administrator' && level !== 'customer')) {
    errors.push({ level: 'Esse campo deve ser preenchido adequadamente com o nivel do usuaro' })
  }

  if (errors.length > 0) {
    return response.status(400).json({
      errors
    })
  }
  return next()
}
