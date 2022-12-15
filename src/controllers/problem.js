import problemRepository from '../repositories/problemRepository.js'
import imagesProblemsRepository from '../repositories/imagesProblemsRepository.js'
import { getInfoByGeolocation } from '../services/google-maps.js'

async function index (request, response) {
  const { limit, page } = request.query

  const problems = await problemRepository.getAll(limit, page)
  if (problems === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  return response.json(problems)
}

async function update (request, response) {
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
  if (result === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  if (result) {
    return response.json({ message: 'Deleted' })
  }
  return response.status(404).json({ message: 'Problem not found' })
}

async function save (request, response) {
  const { body } = request

  const mapsInfo = await getInfoByGeolocation(process.env.GOOGLE_API_KEY, body.latitude, body.longitude)

  console.log('[problem.controller].save() response', mapsInfo)

  const uuid = await problemRepository.save(body)
  if (uuid === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  if (uuid) {
    return response.status(201).json({ message: 'Item created', uuid })
  }
  return response.status(400).json({ message: 'There was an error ' })
}

async function getByUUID (request, response) {
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

export default {
  index,
  update,
  remove,
  save,
  getByUUID
}
