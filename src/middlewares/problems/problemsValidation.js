module.exports = {
  index(request, response, next) {
    const { limit, page } = request.query;
    if (!limit || limit.length == 0) {
      request.query.limit = 10;
    }
    if (!page || page.length == 0) {
      request.query.page = 1;
    }
    return next();
  },
  remove(request, response, next) {
    const { uuid } = request.params;
    if (!uuid) {
      return response.status(400).json({
        error: "UUID não encontrado como parametro!"
      });
    }
    return next();
  },
  update(request, response, next) {
    const { uuid } = request.params;
    const { description } = request.body;
    if (!uuid) {
      return response.status(400).json({
        error: "UUID não encontrado como parametro!"
      });
    }
    if (!description || description.length < 10) {
      return response.status(400).json({ description: 'Esse campo deve ter no minimo 10 caracteres' });
    }
    return next();
  },
  save(request, response, next) {
    const {
      description,
      address,
      longitude,
      latitude,
      category,
      reporterUsername
    } = request.body;

    let errors = [];
    if (!description || description.length < 10) {
      errors.push({ description: 'Esse campo deve ter no minimo 10 caracteres' });
    }
    if (!address || address.length < 10) {
      errors.push({ address: 'Esse campo deve ter no minimo 10 caracteres' });
    }
    if (!longitude) {
      errors.push({ longitude: 'Esse campo é obrigatorio' });
    }
    if (!latitude) {
      errors.push({ latitude: 'Esse campo é obrigatorio' });
    }
    if (!category) {
      errors.push({ category: 'Esse campo é obrigatorio' });
    }
    if (!reporterUsername || reporterUsername.length < 12) {
      errors.push({ reporterUsername: 'Esse campo é obrigatorio, é numero de contato' });
    }

    if (errors.length > 0) {
      return response.status(400).json({
        errors
      });
    }
    return next();
  },
};
