import * as problemRepository from '../repositories/problem-repository.js'
import * as imagesProblemsRepository from '../repositories/images-problems-repository.js'

export async function save (request, response) {
  const { base64, description } = request.body
  const { uuid } = request.params
  console.log('[imagesProblemsController.save()] ')

  const problem = await problemRepository.findByUUID(uuid)
  console.log('[imagesProblemsController.save()] problem', problem)

  if (problem === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  if (!problem) {
    return response.status(404).json({ error: 'Problema não foi encontrado' })
  }

  const result = await imagesProblemsRepository.save(base64, description, problem.id)

  if (result === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  if (!result) {
    return response.status(404).json({ error: 'Problema não foi encontrado' })
  }

  return response.status(201).json({ message: 'Item created', uuid })
}

export async function index (request, response) {
  const { uuid } = request.params

  const problem = await problemRepository.findByUUID(uuid)
  console.log('[imagesProblemsController.save()] problem', problem)

  const photos = await imagesProblemsRepository.findByProblemId(problem.id)
  console.log('[imagesProblemsController.save()] photos', photos)

  if (photos === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  if (!photos) {
    return response.status(404).json({ error: 'Fotos não foram encontrados' })
  }

  return response.json(photos)
}

export async function getByUUID (request, response) {
  const { uuid } = request.params

  const photo = await imagesProblemsRepository.findByUUID(uuid, ['uuid', 'base64', 'description', 'createdAt', 'updatedAt'])
  console.log('[imagesProblemsController.save()] photo', photo)

  if (photo === 'code_error_db') {
    return response.status(503).json({ error: 'Deu erro tente novamente!' })
  }
  if (!photo) {
    return response.status(404).json({ error: 'Fotos não foram encontrados' })
  }

  return response.json(photo)
}
