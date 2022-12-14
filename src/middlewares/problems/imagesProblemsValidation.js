function save (request, response, next) {
  const {
    base64
  } = request.body

  if (!request.params.uuid || request.params.uuid === 'null') {
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

export default {
  save
}
