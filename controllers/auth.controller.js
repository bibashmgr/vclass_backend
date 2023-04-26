const httpStatus = require('http-status');

// utils
const logger = require('../utils/logger.js');

// models
const userModel = require('../models/user.model.js');

const getUserInfo = async (req, res) => {
  try {
    if (req.userId) {
      userModel.findById(req.userId).then((existingUser) => {
        if (existingUser) {
          logger.info('Fetch userInfo');
          return res.status(httpStatus.CREATED).json({
            data: existingUser,
            success: true,
            message: 'Fetch userInfo',
          });
        } else {
          logger.warn('Fail to fetch userInfo');
          return res.status(httpStatus.NOT_FOUND).json({
            data: null,
            success: false,
            message: 'Fail to fetch userInfo',
          });
        }
      });
    } else {
      logger.warn('Fail to fetch userInfo');
      return res.status(httpStatus.UNAUTHORIZED).json({
        data: null,
        success: false,
        message: 'Fail to fetch userInfo',
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getUserInfo };
