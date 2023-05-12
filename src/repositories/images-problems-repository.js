import { randomUUID } from 'crypto'
import Database from '../../database/index.js'

export async function findByUUID (uuid, columns = ['*']) {
  console.log('[imagesProblemsRepository]->findByUUID() uuid > ', uuid)
  try {
    const image = await Database
      .connection
      .select(columns)
      .from('images_problems')
      .where('uuid', '=', uuid)
    if (image.length === 0) {
      return false
    }
    return image[0]
  } catch (error) {
    console.log('[imagesProblemsRepository]->findByUUID() error > ', error)
    return 'code_error_db'
  }
}

export async function findByProblemId (problemId, columns = ['uuid', 'description']) {
  console.log('[imagesProblemsRepository]->findByUUID() problemId > ', problemId)
  try {
    const datas = await Database
      .connection
      .select(columns)
      .from('images_problems')
      .where('problemId', '=', problemId)
    return datas
  } catch (error) {
    console.log('[imagesProblemsRepository]->findByUUID() error > ', error)
    return 'code_error_db'
  }
}

export async function save (base64, description, problemId) {
  const uuid = await randomUUID()
  console.log('[imagesProblemsRepository]->save()  description, problemId', description, problemId)

  try {
    await Database
      .connection('images_problems')
      .insert({ uuid, base64, description, problemId })
    return uuid
  } catch (error) {
    console.log('[imagesProblemsRepository]->save() error: ', error)
    return 'code_error_db'
  }
}
