const problemRepository = require('../repositories/problemRepository');

module.exports = {
  async index(request, response) {
    const { limit, page } = request.query;
    const problems = await problemRepository.getAll(limit, page);
    return response.json(problems);
  },
  async update(request, response) {
    const { uuid } = request.params;
    const { description } = request.body;
    const responseult = await problemRepository.updateByUUID(uuid, description);
    if (responseult) {
      return response.json({ message: 'Problem updated' });
    }
    return response.status(404).json({ message: 'Problem not found' });
  },
  async remove(request, response) {
    const { uuid } = request.params;
    const responseult = await problemRepository.removeByUUID(uuid);
    if (responseult) {
      return response.json({ message: 'Deleted' });
    }
    return response.status(404).json({ message: 'Problem not found' });
  },
  async save(request, response) {
    const { body } = request;

    const uuid = await problemRepository.save(body);
    if (uuid) {
      return response.status(201).json({ message: 'Item created', problemId: uuid });
    }
    return response.status(400).json({ message: 'There was an error ' });
  },
  async getByUUID(request, response) {
    const { uuid } = request.params;
    const problem = await problemRepository.findByUUID(uuid);
    if (problem) {
      return response.json(problem);
    }
    return response.status(404).json({ message: 'Not found' });
  },
};
