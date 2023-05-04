import { randomUUID } from 'crypto'
import Database from '../../database/index.js'

async function getAll(limit, page) {
  console.log('[problemRepository]->getAll() limit, page-> ', limit, page)
  try {
    const problems = await Database.connection
      .select('uuid', 'description', 'address', 'longitude', 'latitude', 'status', 'reporterUsername', 'reporterName', 'country', 'state', 'city', 'neighborhood', 'createdAt', 'updatedAt')
      .from('problems')
      .where('status', '!=', 'deleted')
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
    return problems
  } catch (error) {
    console.log('[problemRepository]->getAll() error > ', error)
    return 'code_error_db'
  }
}

async function save(
  {
    description,
    address,
    longitude,
    latitude,
    category,
    reporterUsername,
    reporterName,
    country,
    state,
    city,
    neighborhood,
    dataJson
  }
) {
  const uuid = await randomUUID()
  console.log('[problemRepository]->save()  ', description, address, longitude, latitude, category, reporterUsername, uuid)
  const date = new Date()
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
        reporterName,
        country,
        state,
        city,
        neighborhood,
        statusHistory: JSON.stringify([
          {
            createdAt: date.toISOString(),
            status: 'not_solved',
            updatedAt: date.toISOString(),
          }
        ])
        ,
        dataJson,
        status: 'not_solved'
      })
    return uuid
  } catch (error) {
    console.log('[problemRepository]->save() error > ', error)
    return 'code_error_db'
  }
}

async function findByUUID(uuid, columns = ['*']) {
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

async function findByUsername(user, columns = ['*'], limit, page) {
  console.log('[problemRepository]->findByUsername() user-> ', user)
  try {
    const problem = await Database.connection
      .select(columns)
      .from('problems')
      .where({ reporterUsername: user })
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
    return problem
  } catch (error) {
    console.log('[problemRepository]->findByUUID() error > ', error)
    return 'code_error_db'
  }
}

async function updateByUUID(uuid, description) {
  console.log('[problemRepository]->updateByUUID() uuid, description-> ', uuid, description)

  try {
    const problem = await findByUUID(uuid, ['status', 'statusHistory', 'createdAt', 'updatedAt'])
    console.log('[problemRepository]->updateByUUID() problem-> ', problem)

    if (problem.statusHistory === null && problem.status === 'not_solved') {
      let result = await Database.connection('problems')
        .where('uuid', '=', uuid)
        .update({
          description,
          statusHistory: JSON.stringify([
            {
              createdAt: problem.createdAt,
              status: 'not_solved',
              updatedAt: problem.createdAt,
            }
          ]),
          updatedAt: Database.connection.fn.now()
        })
      if (result === 1) {
        return true
      }
    }

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

async function removeByUUID(uuid) {
  console.log('[problemRepository]->removeByUUID() uuid-> ', uuid)
  const date = new Date()

  try {
    const problem = await findByUUID(uuid, ['status', 'statusHistory', 'createdAt'])
    console.log('[problemRepository]->removeByUUID() problem-> ', problem)
    if (problem.status === 'deleted') {
      return 'deleted'
    }

    if(problem.statusHistory === null) {
      problem.statusHistory = [
        {
          createdAt: problem.createdAt,
          status: 'not_solved',
          updatedAt: problem.createdAt,
        },
        {
          createdAt: date.toISOString(),
          status: 'deleted',
          updatedAt: date.toISOString(),
        }
      ]
    } else {
      problem.statusHistory.push(
        {
          createdAt: date.toISOString(),
          status: 'deleted',
          updatedAt: date.toISOString(),
        }
      )
    }

    
    console.log('[problemRepository]->removeByUUID() problem-> ', problem)
    const result = await Database.connection('problems')
      .where('uuid', '=', uuid)
      .update({
        status: 'deleted',
        updatedAt: Database.connection.fn.now(),
        statusHistory: JSON.stringify(problem.statusHistory)
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

async function findByNeighborhood(country, state, city, neighborhood, limit, page) {
  console.log('[problemRepository]->findByNeighborhood() country, state, city, neighborhood-> ', country, state, city, neighborhood)
  try {
    const result = await Database.connection('problems')
      .select('uuid', 'description', 'address', 'longitude', 'latitude', 'status', 'reporterUsername', 'reporterName', 'country', 'state', 'city', 'neighborhood', 'createdAt', 'updatedAt')
      .where('status', '!=', 'deleted')
      .andWhere({ country })
      .andWhere({ state })
      .andWhere({ city })
      .andWhere({ neighborhood })
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
    return result
  } catch (error) {
    console.log('[problemRepository]->findByNeighborhood() error > ', error)
    return 'code_error_db'
  }
}

async function findByCity(country, state, city, limit, page) {
  console.log('[problemRepository]->findByCity() country, state, city, neighborhood-> ', country, state, city)
  try {
    const result = await Database.connection('problems')
      .select('uuid', 'description', 'address', 'longitude', 'latitude', 'status', 'reporterUsername', 'reporterName', 'country', 'state', 'city', 'neighborhood', 'createdAt', 'updatedAt')
      .where('status', '!=', 'deleted')
      .andWhere({ country })
      .andWhere({ state })
      .andWhere({ city })
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
    return result
  } catch (error) {
    console.log('[problemRepository]->findByCity() error > ', error)
    return 'code_error_db'
  }
}

export default {
  findByUsername,
  findByCity,
  findByNeighborhood,
  removeByUUID,
  updateByUUID,
  findByUUID,
  save,
  getAll
}
