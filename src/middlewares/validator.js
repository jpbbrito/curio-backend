const { validationResult } = require('express-validator');
const { apiKeys } = require(process.env.PATH_API_KEYS);

module.exports = {
  validateRequestSchema(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json(errors);
  },
  checkApiKey(req, res, next) {
    if (apiKeys.includes(req.headers.api_key)) {
      return next();
    }
    return res.status(401).json({ error: 'API_KEY invalid.' });
  },
};
