const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

// utils
const logger = require('../utils/logger.js');

// config
const config = require('../config/config.js');
const userModel = require('../models/user.model.js');

const customFormat = ({ msg }) => {
  return `${msg}`;
};

const bodyValidation = (req, res, next) => {
  const errors = validationResult(req).formatWith(customFormat);
  if (!errors.isEmpty()) {
    logger.error(errors.array());
    return res.status(httpStatus.BAD_REQUEST).json({
      data: null,
      success: false,
      message: errors.array(),
    });
  } else {
    next();
  }
};

const userValidation = (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
          res.status(httpStatus.UNAUTHORIZED).json({
            data: null,
            success: false,
            message: 'ACCESS DENIED',
          });
        } else {
          userModel.findById(decoded.id).then((user) => {
            if (user) {
              req.userId = user._id;
              next();
            } else {
              res.status(httpStatus.UNAUTHORIZED).json({
                data: null,
                success: false,
                message: 'ACCESS DENIED',
              });
            }
          });
        }
      });
    } else {
      res.status(httpStatus.BAD_REQUEST).json({
        data: null,
        success: false,
        message: 'TOKEN NOT FOUND',
      });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

const roleValidation = (roles) => {
  if (roles.includes(req.userId)) {
    // next();
  } else {
    res.status(httpStatus.UNAUTHORIZED).json({
      data: null,
      success: false,
      message: 'ACCESS DENIED',
    });
  }
};

module.exports = { bodyValidation, userValidation, roleValidation };
