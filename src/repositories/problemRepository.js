const { randomUUID } = require('crypto');
const Database = require('../database');

module.exports = {
  async getAll(limit, page) {
    console.log('[problemRepository]->getAll() limit, page-> ', limit, page);
    try {
      const problems = await Database.connection
        .select('uuid', 'description', 'address', 'longitude', 'latitude', 'status', 'created_at', 'updated_at')
        .from('problems')
        .where('status', '!=', 'deleted')
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset((page - 1) * limit);
      return problems;
    } catch (err) {
      throw Error(err);
    }
  },
  async save(
    {
      description, address, longitude, latitude, reporterContact,
    },
  ) {
    const uuid = await randomUUID();
    console.log('[problemRepository]->save()  ', description, address, longitude, latitude, reporterContact, uuid);
    try {
      await Database.connection('problems')
        .insert({
          uuid,
          description,
          address,
          longitude,
          latitude,
          reporter_contact: reporterContact,
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
        .select('uuid', 'description', 'address', 'longitude', 'latitude', 'status', 'created_at', 'updated_at')
        .from('problems')
        .where({ uuid });
      if (problem.length === 0) {
        return undefined;
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
          updated_at: Database.connection.fn.now(),
        });
      if (result === 1) {
        return true;
      }
      return undefined;
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
          updated_at: Database.connection.fn.now(),
        });
      if (result === 1) {
        return true;
      }
      return undefined;
    } catch (error) {
      throw Error(error);
    }
  },
};
