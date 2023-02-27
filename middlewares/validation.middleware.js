const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// utils
const logger = require('../utils/logger.js');

// config
const config = require('../config/config.js');

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

const userValidation = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
          res.status(400).json({
            data: null,
            success: false,
            message: 'TOKEN EXPIRED',
          });
        } else {
          req.userId = decoded.id;
          next();
        }
      });
    } catch (error) {
      res.status(403).json({
        data: null,
        success: false,
        message: 'ACCESS DENIED',
      });
    }
  } else {
    res.status(401).json({
      data: null,
      success: false,
      message: 'TOKEN NOT FOUND',
    });
  }
};

module.exports = { bodyValidation, userValidation };
