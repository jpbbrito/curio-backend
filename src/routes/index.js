const express = require('express');
const routes = express.Router();

const problemController = require('../controllers/problem');
const validator = require('../middlewares/validator');
const problemsValidation = require('../middlewares/problems/problemsValidation');

routes.get(
  '/problems',
  validator.checkApiKey,
  problemsValidation.index,
  problemController.index,
);

routes.delete(
  '/problems/:uuid',
  validator.checkApiKey,
  problemsValidation.remove,
  problemController.remove,
);

routes.put(
  '/problems/:uuid',
  validator.checkApiKey,
  problemsValidation.update,
  problemController.update,
);

routes.get(
  '/problems/:uuid',
  validator.checkApiKey,
  problemController.getByUUID,
);

routes.post(
  '/problems',
  validator.checkApiKey,
  problemsValidation.save,
  problemController.save,
);

module.exports = routes;
