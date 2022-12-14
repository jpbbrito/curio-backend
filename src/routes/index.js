import express from 'express'

import problemController from '../controllers/problem.js'
import imagesProblemsController from '../controllers/imagesProblems.js'

import validator from '../middlewares/validator.js'
import problemsValidation from '../middlewares/problems/problemsValidation.js'
import imagesProblemsValidation from '../middlewares/problems/imagesProblemsValidation.js'

const routes = express.Router()

routes.get(
  '/problems',
  validator.checkApiKey,
  problemsValidation.index,
  problemController.index
)

routes.delete(
  '/problems/:uuid',
  validator.checkApiKey,
  problemsValidation.remove,
  problemController.remove
)

routes.put(
  '/problems/:uuid',
  validator.checkApiKey,
  problemsValidation.update,
  problemController.update
)

routes.get(
  '/problems/:uuid',
  validator.checkApiKey,
  problemController.getByUUID
)

routes.post(
  '/problems',
  validator.checkApiKey,
  problemsValidation.save,
  problemController.save
)

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

export default routes
