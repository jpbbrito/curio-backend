const express = require('express');

const routes = express.Router();

const { query, body } = require('express-validator');

const ProblemController = require('../controllers/problem');
const validator = require('../middlewares/validator');

routes.get('/problems', [
  query('limit').not().isEmpty(),
  query('page').not().isEmpty(),
],
validator.problemIndexValidation,
ProblemController.index);

routes.delete('/problems/:uuid', ProblemController.remove);
routes.put('/problems/:uuid', ProblemController.update);
routes.get('/problems/:uuid', ProblemController.getByUUID);
routes.post('/problems', [
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
    .isEmpty().isNumeric(),
  body('reporterContact')
    .not()
    .isEmpty(),
],
validator.problemSaveValidation,
ProblemController.save);

module.exports = routes;
