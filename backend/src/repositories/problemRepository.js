const { v4: uuidv4 } = require('uuid');
const { Database } = require('../database');

module.exports = {
  async getAll(limit, page) {
    try {
      const problems = await Database.connection
        .select('uuid', 'description', 'address', 'longitude', 'latitude', 'status', 'created_at')
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
    const uuid = await uuidv4();
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
    try {
      const problem = await Database.connection
        .select('uuid', 'description', 'address', 'longitude', 'latitude', 'status', 'created_at')
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
    try {
      const result = await Database.connection('problems')
        .where('uuid', '=', uuid)
        .update({
          description,
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
    try {
      const result = await Database.connection('problems')
        .where('uuid', '=', uuid)
        .update({
          status: 'deleted',
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
