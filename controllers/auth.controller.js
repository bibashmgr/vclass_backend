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
          return res.status(200).json({
            data: existingUser,
            success: true,
            message: 'Fetch userInfo',
          });
        } else {
          logger.warn('Fail to fetch userInfo');
          return res.status(404).json({
            data: null,
            success: false,
            message: 'Fail to fetch userInfo',
          });
        }
      });
    } else {
      logger.warn('Fail to fetch userInfo');
      return res.status(404).json({
        data: null,
        success: false,
        message: 'Fail to fetch userInfo',
      });
    }
  } catch (error) {
    res.status(500).json({
      data: null,
      success: false,
      message: error.message,
    });
    logger.error(error.message);
  }
};

module.exports = { getUserInfo };
