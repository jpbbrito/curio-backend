const problemRepository = require('../repositories/problemRepository');

module.exports = {
  async index(req, res) {
    const { limit, page } = req.query;
    const problems = await problemRepository.getAll(limit, page);
    return res.json(problems);
  },
  async update(req, res) {
    const { uuid } = req.params;
    const { description } = req.body;
    const result = await problemRepository.updateByUUID(uuid, description);
    if (result) {
      return res.json({ message: 'Problem updated' });
    }
    return res.status(404).json({ message: 'Problem not found' });
  },
  async remove(req, res) {
    const { uuid } = req.params;
    const result = await problemRepository.removeByUUID(uuid);
    if (result) {
      return res.json({ message: 'Deleted' });
    }
    return res.status(404).json({ message: 'Problem not found' });
  },
  async save(req, res) {
    const { body } = req;

    const uuid = await problemRepository.save(body);
    if (uuid) {
      return res.status(201).json({ message: 'Item created', problemId: uuid });
    }
    return res.status(400).json({ message: 'There was an error ' });
  },
  async getByUUID(req, res) {
    const { uuid } = req.params;
    const problem = await problemRepository.findByUUID(uuid);
    if (problem) {
      return res.json(problem);
    }
    return res.status(404).json({ message: 'Not found' });
  },
};
