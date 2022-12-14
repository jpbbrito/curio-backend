import { randomUUID } from 'crypto'
import Database from '../../database/index.js'

async function getAll (limit, page) {
  console.log('[problemRepository]->getAll() limit, page-> ', limit, page)
  try {
    const problems = await Database.connection
      .select('uuid', 'description', 'address', 'longitude', 'latitude', 'status', 'createdAt', 'updatedAt')
      .from('problems')
      .where('status', '!=', 'deleted')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset((page - 1) * limit)
    return problems
  } catch (error) {
    console.log('[problemRepository]->getAll() error > ', error)
    return 'code_error_db'
  }
}

async function save (
  {
    description, address, longitude, latitude, category, reporterUsername
  }
) {
  const uuid = await randomUUID()
  console.log('[problemRepository]->save()  ', description, address, longitude, latitude, category, reporterUsername, uuid)
  try {
    await Database.connection('problems')
      .insert({
        uuid,
        description,
        address,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
        category,
        reporterUsername,
        status: 'not_solved'
      })
    return uuid
  } catch (error) {
    console.log('[problemRepository]->save() error > ', error)
    return 'code_error_db'
  }
}

async function findByUUID (uuid, columns = ['*']) {
  console.log('[problemRepository]->findByUUID() uuid-> ', uuid)
  try {
    const problem = await Database.connection
      .select(columns)
      .from('problems')
      .where({ uuid })
    if (problem.length === 0) {
      return false
    }
    return problem[0]
  } catch (error) {
    console.log('[problemRepository]->findByUUID() error > ', error)
    return 'code_error_db'
  }
}

async function updateByUUID (uuid, description) {
  console.log('[problemRepository]->updateByUUID() uuid, description-> ', uuid, description)
  try {
    const result = await Database.connection('problems')
      .where('uuid', '=', uuid)
      .update({
        description,
        updatedAt: Database.connection.fn.now()
      })
    if (result === 1) {
      return true
    }
    return false
  } catch (error) {
    console.log('[problemRepository]->updateByUUID() error > ', error)
    return 'code_error_db'
  }
}

async function removeByUUID (uuid) {
  console.log('[problemRepository]->removeByUUID() uuid-> ', uuid)
  try {
    const result = await Database.connection('problems')
      .where('uuid', '=', uuid)
      .update({
        status: 'deleted',
        updatedAt: Database.connection.fn.now()
      })
    if (result === 1) {
      return true
    }
    return false
  } catch (error) {
    console.log('[problemRepository]->removeByUUID() error > ', error)
    return 'code_error_db'
  }
}

export default {
  removeByUUID,
  updateByUUID,
  findByUUID,
  save,
  getAll
}
