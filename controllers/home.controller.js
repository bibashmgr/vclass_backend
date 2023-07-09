const httpStatus = require('http-status');

// config
const logger = require('../utils/logger.js');

const welcomeScreen = (req, res) => {
  try {
    logger.info('Welcome to vclass');
    res.status(httpStatus.OK).json({
      data: null,
      success: true,
      message: 'Welcome to vclass',
    });
  } catch (error) {
    logger.error(error.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

module.exports = { welcomeScreen };
