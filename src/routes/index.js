import express from 'express'

import * as problemController from '../controllers/problem.js'
import * as imagesProblemsController from '../controllers/images-problems.js'
import * as authController from '../controllers/auth.js'
import * as usersController from '../controllers/users.js'

import validator from '../middlewares/validator.js'
import problemsValidation from '../middlewares/problems/problems-validation.js'
import imagesProblemsValidation from '../middlewares/problems/images-problems-validation.js'
import * as usersValidation from '../middlewares/users/users-validation.js'
import * as authValidation from '../middlewares/users/auth-validation.js'

const routes = express.Router()

routes.post('/authenticate', validator.checkApiKey, authValidation.validationAuthenticate, authController.authenticate)
routes.post('/forgot-password', validator.checkApiKey, authValidation.validationForgotPassword, authController.forgotPassword)
routes.post('/reset-password', validator.checkApiKey, authValidation.validationResetPassword, authController.resetPassword)
routes.post('/users', authValidation.authenticateToken, usersValidation.usersSaveValidation, usersController.save)
routes.get('/users', authValidation.authenticateToken, usersController.getInfoUser)

routes.get(
  '/problems',
  validator.checkApiKey,
  problemsValidation.index,
  problemController.index
)

routes.get(
  '/problems/cities',
  validator.checkApiKey,
  problemController.cities
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

routes.get(
  '/problems/username?',
  validator.checkApiKey,
  problemsValidation.getByUsername,
  problemController.getByUsername
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
