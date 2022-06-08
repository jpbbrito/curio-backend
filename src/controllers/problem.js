const problemRepository = require('../repositories/problemRepository');
const imagesProblemsRepository = require('../repositories/imagesProblemsRepository');

module.exports = {
  async index(request, response) {
    const { limit, page } = request.query;

    const problems = await problemRepository.getAll(limit, page);
    if (problems === 'code_error_db') {
      return response.status(503).json({ error: 'Deu erro tente novamente!' });
    }
    return response.json(problems);
  },
  async update(request, response) {
    const { uuid } = request.params;
    const { description } = request.body;

    const result = await problemRepository.updateByUUID(uuid, description);
    if (result === 'code_error_db') {
      return response.status(503).json({ error: 'Deu erro tente novamente!' });
    }
    if (result) {
      return response.json({ message: 'Problem updated' });
    }
    return response.status(404).json({ message: 'Problem not found' });
  },
  async remove(request, response) {
    const { uuid } = request.params;

    const result = await problemRepository.removeByUUID(uuid);
    if (result === 'code_error_db') {
      return response.status(503).json({ error: 'Deu erro tente novamente!' });
    }
    if (result) {
      return response.json({ message: 'Deleted' });
    }
    return response.status(404).json({ message: 'Problem not found' });
  },
  async save(request, response) {
    const { body } = request;

    const uuid = await problemRepository.save(body);
    if (uuid === 'code_error_db') {
      return response.status(503).json({ error: 'Deu erro tente novamente!' });
    }
    if (uuid) {
      return response.status(201).json({ message: 'Item created', problemId: uuid });
    }
    return response.status(400).json({ message: 'There was an error ' });
  },
  async getByUUID(request, response) {
    const { uuid } = request.params;

    const problem = await problemRepository.findByUUID(uuid);
    if (problem === 'code_error_db') {
      return response.status(503).json({ error: 'Deu erro tente novamente!' });
    }
    if (!problem) {
      return response.status(404).json({ message: 'Not found' });
    }
    const photos = await imagesProblemsRepository.findByProblemId(problem.id);
    if (photos === 'code_error_db') {
      return response.status(503).json({ error: 'Deu erro tente novamente!' });
    }
    if (!photos) {
      return response.status(404).json({ message: 'Not found' });
    }

    delete problem.id;
    return response.json({ ...problem, photos });
  },
};
