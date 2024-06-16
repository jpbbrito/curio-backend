export function index (request, response, next) {
  const { limit, page } = request.query
  if (!limit || limit.length === 0) {
    request.query.limit = 10
  }
  if (!page || page.length === 0) {
    request.query.page = 1
  }
  return next()
}

export function location (request, response, next) {
  const { country, state, city, limit, page } = request.query
  console.log('location -> ', request.query)

  if (!country || !state || !city) {
    return response.status(400).json({
      error: 'os campos a seguir não foram encontrados como parametros: country, state, city'
    })
  }

  if (!limit || limit.length === 0) {
    request.query.limit = 10
  }
  if (!page || page.length === 0) {
    request.query.page = 1
  }

  return next()
}

export function geoLocation (request, response, next) {
  const { longitude, latitude, limit, page } = request.query
  console.log('location -> ', request.query)

  if (!longitude || !latitude) {
    return response.status(400).json({
      error: 'os campos a seguir não foram encontrados como parametros: country, state, city'
    })
  }

  if (!limit || limit.length === 0) {
    request.query.limit = 10
  }
  if (!page || page.length === 0) {
    request.query.page = 1
  }

  return next()
}

export function getByUsername (request, response, next) {
  const { user, limit, page } = request.query
  console.log('location -> ', request.query)

  if (!user) {
    return response.status(400).json({
      error: 'os campos a seguir não foram encontrados como parametros: user'
    })
  }

  if (!limit || limit.length === 0) {
    request.query.limit = 10
  }
  if (!page || page.length === 0) {
    request.query.page = 1
  }

  return next()
}
export function remove (request, response, next) {
  const { uuid } = request.params
  if (!uuid) {
    return response.status(400).json({
      error: 'UUID não encontrado como parametro!'
    })
  }
  return next()
}

export function update (request, response, next) {
  const { description } = request.body
  if (!request.params.uuid || request.params.uuid === 'null') {
    return response.status(400).json({
      error: 'UUID não informado!'
    })
  }
  if (!description || description.length < 10) {
    return response.status(400).json({ description: 'Esse campo deve ter no minimo 10 caracteres' })
  }
  return next()
}

export function save (request, response, next) {
  const {
    description,
    address,
    longitude,
    latitude,
    category,
    reporterUsername
  } = request.body

  const errors = []
  if (!description || description.length < 10) {
    errors.push({ description: 'Esse campo deve ter no minimo 10 caracteres' })
  }
  if (!address || address.length < 5) {
    errors.push({ address: 'Esse campo deve ter no minimo 5 caracteres' })
  }
  if (!longitude) {
    errors.push({ longitude: 'Esse campo é obrigatorio' })
  }
  if (!latitude) {
    errors.push({ latitude: 'Esse campo é obrigatorio' })
  }
  if (!category) {
    errors.push({ category: 'Esse campo é obrigatorio' })
  }
  if (!reporterUsername) {
    errors.push({ reporterUsername: 'Esse campo é obrigatorio, é numero de contato' })
  }

  if (errors.length > 0) {
    return response.status(400).json({
      errors
    })
  }
  return next()
}

