const { validationResult } = require('express-validator');

// utils
const logger = require('../utils/logger');

const customFormat = ({ msg }) => {
  return `${msg}`;
};

const bodyValidation = (req, res, next) => {
  const errors = validationResult(req).formatWith(customFormat);
  if (!errors.isEmpty()) {
    logger.error(errors.array());
    return res.status(400).json({
      data: null,
      success: false,
      message: errors.array(),
    });
  } else {
    next();
  }
};

module.exports = { bodyValidation };
