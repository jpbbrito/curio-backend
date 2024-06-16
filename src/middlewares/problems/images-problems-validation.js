export function save (request, response, next) {
  const {
    base64
  } = request.body

  if (!request.params.uuid || request.params.uuid.length !== 36) {
    return response.status(400).json({
      error: 'UUID não informado!'
    })
  }
  const errors = []
  if (!base64 || (typeof base64 !== 'string')) {
    errors.push({ base64: 'Esse campo deve preenchido corretamente' })
  }
  if (errors.length > 0) {
    return response.status(400).json({
      errors
    })
  }
  return next()
}

export function getImages (request, response, next) {
  const {
    uuid
  } = request.params

  if (!uuid || uuid.length !== 36) {
    return response.status(400).json({
      error: 'UUID não informado!'
    })
  }
  return next()
}
