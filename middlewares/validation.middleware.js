const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

// utils
const logger = require('../utils/logger.js');

// config
const config = require('../config/config.js');

// models
const userModel = require('../models/user.model.js');
const portalModel = require('../models/portal.model.js');

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

const userValidation = async (req, res, next) => {
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
              req.user = user;
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

const portalValidation = async (req, res, next) => {
  try {
    portalModel
      .findOne({
        batch: req.params.batchId,
        subject: req.params.subjectId,
      })
      .then((portal) => {
        if (portal) {
          req.portalId = portal._id;
          next();
        } else {
          new portalModel({
            batch: req.params.batchId,
            subject: req.params.subjectId,
          })
            .save()
            .then((newPortal) => {
              req.portalId = newPortal._id;
              next();
            });
        }
      });
  } catch (error) {
    logger.error(error.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  bodyValidation,
  userValidation,
  portalValidation,
};
