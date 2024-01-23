import * as problemRepository from '../repositories/problem-repository.js'
import * as imagesProblemsRepository from '../repositories/images-problems-repository.js'
import { getInfoByGeolocation } from '../services/google-maps.js'
import Redis from './../../database/redis.js'

export async function index (request, response) {
  const { limit, page } = request.query

  const problems = await problemRepository.getAll(limit, page)
  if (problems === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  return response.json(problems)
}

export async function getByUsername (request, response) {
  const { query: { user, limit, page } } = request

  const result = await problemRepository.findByUsername(user, [
    'uuid',
    'description',
    'address',
    'longitude',
    'latitude',
    'status',
    'reporterUsername',
    'reporterName',
    'country',
    'state',
    'city',
    'neighborhood',
    'createdAt',
    'updatedAt'
  ],
  limit,
  page
  )
  if (result === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  if (result.length === 0) {
    return response.status(404).json([])
  }
  return response.json(result)
}

export async function location (request, response) {
  const { country, state, city, neighborhood, limit, page } = request.query
  console.log('[problemController]->location() request.query-> ', request.query)

  if (country && state && city && neighborhood) {
    const result = await problemRepository.findByNeighborhood(country, state, city, neighborhood, limit, page)

    if (result === 'code_error_db') {
      return response.status(503).json({ error: 'Deu erro tente novamente!' })
    }
    return response.json(result)
  }

  if (country && state && city) {
    const result = await problemRepository.findByCity(country, state, city, limit, page)

    if (result === 'code_error_db') {
      return response.status(503).json({ error: 'Deu erro tente novamente!' })
    }
    return response.json(result)
  }
  return response.status(400).json({ message: 'Deu erro tente novamente!' })
}

export async function geoLocation (request, response) {
  const { query: { latitude, longitude, limit, page } } = request
  console.log('[problemController]->geoLocation() request.query-> ', request.query)

  const mapsInfo = await getInfoByGeolocation(process.env.GOOGLE_API_KEY, latitude, longitude)

  if (mapsInfo === 'error_api') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }

  const streetAddress = mapsInfo.results.filter((value) => {
    return value.types[0] === 'street_address'
  })

  if (streetAddress.length === 0) {
    const administrativeArea = mapsInfo.results.filter((components) => {
      return components.types[0] === 'route'
    })

    const administrativeAreaArray = administrativeArea[0].address_components
    console.log('[problem.controller].geoLocation() administrativeAreaArray', administrativeAreaArray)
    const city = administrativeAreaArray.filter(value => {
      return value.types[0] === 'administrative_area_level_2' || value.types[1] === 'administrative_area_level_2'
    })
    console.log('[problem.controller].geoLocation() city', city)
    const state = administrativeAreaArray.filter(value => {
      return value.types[0] === 'administrative_area_level_1' || value.types[1] === 'administrative_area_level_1'
    })
    console.log('[problem.controller].geoLocation() state', state)
    const country = administrativeAreaArray.filter(value => {
      return value.types[0] === 'country' || value.types[1] === 'country'
    })
    console.log('[problem.controller].geoLocation() country', country)

    const result = await problemRepository.findByCity(
      country[0]?.long_name,
      state[0]?.long_name,
      city[0]?.long_name,
      limit,
      page
    )
    if (result === 'code_error_db') {
      return response.status(503).json({ error: 'Deu erro tente novamente!' })
    }
    return response.json(result)
  }

  const streetAddressArray = streetAddress[0].address_components

  console.log('[problem.controller].geoLocation() mapsInfo.streetAddressArray', streetAddressArray)
  const city = streetAddressArray.filter(value => {
    return value.types[0] === 'administrative_area_level_2' || value.types[1] === 'administrative_area_level_2'
  })
  console.log('[problem.controller].geoLocation() city', city)
  const state = streetAddressArray.filter(value => {
    return value.types[0] === 'administrative_area_level_1' || value.types[1] === 'administrative_area_level_1'
  })
  console.log('[problem.controller].geoLocation() state', state)
  const country = streetAddressArray.filter(value => {
    return value.types[0] === 'country' || value.types[1] === 'country'
  })
  console.log('[problem.controller].geoLocation() country', country)
  const neighborhood = streetAddressArray.filter(value => {
    return value.types[0] === 'sublocality' || value.types[1] === 'sublocality'
  })
  console.log('[problem.controller].geoLocation() neighborhood', neighborhood)

  const result = await problemRepository.findByNeighborhood(
    country[0]?.long_name,
    state[0]?.long_name,
    city[0]?.long_name,
    neighborhood[0]?.long_name,
    limit,
    page
  )

  if (result === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }

  return response.json(result)
}

export async function update (request, response) {
  const { uuid } = request.params
  const { description } = request.body

  const result = await problemRepository.updateByUUID(uuid, description)
  if (result === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  if (result) {
    return response.json({ message: 'Problem updated' })
  }
  return response.status(404).json({ message: 'Problem not found' })
}

export async function remove (request, response) {
  const { uuid } = request.params

  const result = await problemRepository.removeByUUID(uuid)
  if (result === 'deleted') {
    return response.json({ message: 'Item já esta deletado!' })
  }

  if (result === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  if (result) {
    return response.json({ message: 'Deleted' })
  }
  return response.status(404).json({ message: 'Problem not found' })
}

export async function save (request, response) {
  const { body } = request

  const mapsInfo = await getInfoByGeolocation(process.env.GOOGLE_API_KEY, body.latitude, body.longitude)

  let uuid
  console.log('[problem.controller].save() response', mapsInfo)

  if (mapsInfo === 'error_api') {
    uuid = await problemRepository.save({
      ...body,
      reporterName: body.reporterName ?? 'SEM_REGISTRO',
      country: 'error_api',
      state: 'error_api',
      city: 'error_api',
      neighborhood: 'error_api',
      dataJson: 'error_api'
    })
  } else {
    const arr = mapsInfo.results[0].address_components
    console.log('[problem.controller].save() mapsInfo.arr', arr)
    const city = arr.filter(value => {
      console.log('[problem.controller].save() value.types[0]', value.types[0])
      return value.types[0] === 'administrative_area_level_2' || value.types[1] === 'administrative_area_level_2'
    })
    console.log('[problem.controller].save() city', city)
    const state = arr.filter(value => {
      console.log('[problem.controller].save() value.types[0]', value.types[0])
      return value.types[0] === 'administrative_area_level_1' || value.types[1] === 'administrative_area_level_1'
    })
    console.log('[problem.controller].save() state', state)
    const country = arr.filter(value => {
      console.log('[problem.controller].save() value.types[0]', value.types[0])
      return value.types[0] === 'country' || value.types[1] === 'country'
    })
    console.log('[problem.controller].save() country', country)
    const neighborhood = arr.filter(value => {
      console.log('[problem.controller].save() value.types[0]', value.types[0])
      return value.types[0] === 'sublocality' || value.types[1] === 'sublocality'
    })
    console.log('[problem.controller].save() neighborhood', neighborhood)

    uuid = await problemRepository.save({
      ...body,
      reporterName: body.reporterName ?? 'SEM_REGISTRO',
      country: country[0]?.long_name ?? 'SEM_REGISTRO',
      state: state[0]?.long_name ?? 'SEM_REGISTRO',
      city: city[0]?.long_name ?? 'SEM_REGISTRO',
      neighborhood: neighborhood[0]?.long_name ?? 'SEM_REGISTRO',
      dataJson: { googleMapsData: mapsInfo }
    })
  }

  if (uuid === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  if (uuid) {
    return response.status(201).json({ message: 'Item created', uuid })
  }
  return response.status(400).json({ message: 'Deu erro tente novamente!' })
}

export async function getByUUID (request, response) {
  const { uuid } = request.params

  const problem = await problemRepository.findByUUID(uuid)
  if (problem === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  if (!problem) {
    return response.status(404).json({ message: 'Not found' })
  }
  const photos = await imagesProblemsRepository.findByProblemId(problem.id)
  if (photos === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  if (!photos) {
    return response.status(404).json({ message: 'Not found' })
  }

  delete problem.id
  return response.json({ ...problem, photos })
}
export async function cities (request, response) {
  const cache = await Redis.get('problems-cities')
  if (cache !== 'error_redis') {
    return response.json(cache)
  }
  const cities = await problemRepository.fetchCities()
  await Redis.set('problems-cities', cities, 60)
  if (cities === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  return response.json(cities)
}
