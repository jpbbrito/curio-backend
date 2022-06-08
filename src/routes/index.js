const express = require('express');
const routes = express.Router();

const problemController = require('../controllers/problem');
const imagesProblemsController = require('../controllers/imagesProblems');

const validator = require('../middlewares/validator');
const problemsValidation = require('../middlewares/problems/problemsValidation');
const imagesProblemsValidation = require('../middlewares/problems/imagesProblemsValidation');

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

routes.post(
  '/problems/:uuid/images',
  validator.checkApiKey,
  imagesProblemsValidation.save,
  imagesProblemsController.save
)

routes.get(
  '/problems/:uuid/images',
  validator.checkApiKey,
  imagesProblemsController.index
)

routes.get(
  '/problems/images/:uuid',
  validator.checkApiKey,
  imagesProblemsController.getByUUID
)
module.exports = routes;
