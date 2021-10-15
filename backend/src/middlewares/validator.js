const { validationResult } = require('express-validator');

module.exports = {
  problemIndexValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.query.limit = 10;
      req.query.page = 1;
    }
    next();
  },
  problemSaveValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors);
    }
    next();
  },
};
