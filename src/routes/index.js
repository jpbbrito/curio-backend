import express from 'express'

import problemController from '../controllers/problem.js'
import imagesProblemsController from '../controllers/images-problems.js'

import validator from '../middlewares/validator.js'
import problemsValidation from '../middlewares/problems/problems-validation.js'
import imagesProblemsValidation from '../middlewares/problems/images-problems-validation.js'

const routes = express.Router()

routes.get(
  '/problems',
  validator.checkApiKey,
  problemsValidation.index,
  problemController.index
)

routes.get(
  '/problems/location?',
  validator.checkApiKey,
  problemsValidation.location,
  problemController.location
)

routes.get(
  '/problems/geolocation?',
  validator.checkApiKey,
  problemsValidation.geoLocation,
  problemController.geoLocation
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
  imagesProblemsValidation.getImages,
  imagesProblemsController.index
)

routes.get(
  '/problems/images/:uuid',
  validator.checkApiKey,
  imagesProblemsController.getByUUID
)

export default routes
