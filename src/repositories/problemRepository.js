const { randomUUID } = require('crypto');
const Database = require('../../database');

module.exports = {
  async getAll(limit, page) {
    console.log('[problemRepository]->getAll() limit, page-> ', limit, page);
    try {
      const problems = await Database.connection
        .select('uuid', 'description', 'address', 'longitude', 'latitude', 'status', 'createdAt', 'updatedAt')
        .from('problems')
        .where('status', '!=', 'deleted')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset((page - 1) * limit);
      return problems;
    } catch (err) {
      throw Error(err);
    }
  },
  async save(
    {
      description, address, longitude, latitude, category, reporterUsername,
    },
  ) {
    const uuid = await randomUUID();
    console.log('[problemRepository]->save()  ', description, address, longitude, latitude, category, reporterUsername, uuid);
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
          status: 'not_solved',
        });
      return uuid;
    } catch (err) {
      throw Error(err);
    }
  },
  async findByUUID(uuid) {
    console.log('[problemRepository]->findByUUID() uuid-> ', uuid);
    try {
      const problem = await Database.connection
        .select('uuid', 'description', 'address', 'longitude', 'latitude', 'status', 'createdAt', 'updatedAt')
        .from('problems')
        .where({ uuid });
      if (problem.length === 0) {
        return false;
      }
      return problem;
    } catch (error) {
      throw Error(error);
    }
  },
  async updateByUUID(uuid, description) {
    console.log('[problemRepository]->updateByUUID() uuid, description-> ', uuid, description);
    try {
      const result = await Database.connection('problems')
        .where('uuid', '=', uuid)
        .update({
          description,
          updatedAt: Database.connection.fn.now(),
        });
      if (result === 1) {
        return true;
      }
      return false;
    } catch (error) {
      throw Error(error);
    }
  },
  async removeByUUID(uuid) {
    console.log('[problemRepository]->removeByUUID() uuid-> ', uuid);
    try {
      const result = await Database.connection('problems')
        .where('uuid', '=', uuid)
        .update({
          status: 'deleted',
          updatedAt: Database.connection.fn.now(),
        });
      if (result === 1) {
        return true;
      }
      return false;
    } catch (error) {
      throw Error(error);
    }
  },
};
