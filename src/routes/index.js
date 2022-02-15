const express = require('express');

const routes = express.Router();

const { query, body } = require('express-validator');

const ProblemController = require('../controllers/problem');
const validator = require('../middlewares/validator');

routes.get(
  '/problems',
  validator.checkApiKey,
  [
    query('limit').not().isEmpty(),
    query('page').not().isEmpty(),
  ],
  validator.validateRequestSchema,
  ProblemController.index,
);

routes.delete(
  '/problems/:uuid',
  validator.checkApiKey,
  validator.validateRequestSchema,
  ProblemController.remove,
);

routes.put(
  '/problems/:uuid',
  [
    body('description')
      .isLength({ min: 10 })
      .withMessage('must be at least 10 chars long.'),
    body('address')
      .not()
      .isEmpty()
      .isLength({ min: 10 })
      .withMessage('must be at least 10 chars long'),
  ],
  validator.checkApiKey,
  validator.validateRequestSchema,
  ProblemController.update,
);

routes.get(
  '/problems/:uuid',
  validator.checkApiKey,
  ProblemController.getByUUID,
);

routes.post(
  '/problems',
  validator.checkApiKey,
  [
    body('description')
      .isLength({ min: 10 })
      .withMessage('must be at least 10 chars long.'),
    body('address')
      .not()
      .isEmpty()
      .isLength({ min: 10 })
      .withMessage('must be at least 10 chars long'),
    body('longitude')
      .not()
      .isEmpty()
      .isNumeric(),
    body('latitude')
      .not()
      .isEmpty()
      .isNumeric(),
    body('reporterContact')
      .not()
      .isEmpty(),
  ],
  validator.validateRequestSchema,
  ProblemController.save,
);

module.exports = routes;
