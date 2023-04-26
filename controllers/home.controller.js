const httpStatus = require('http-status');

// config
const logger = require('../utils/logger.js');

const welcomeScreen = (req, res) => {
  try {
    res.status(httpStatus.OK).json({
      data: null,
      success: true,
      message: 'Welcome to vclass',
    });
    logger.info('Welcome to vclass');
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      success: false,
      message: error.message,
    });
    logger.error(error.message);
  }
};

module.exports = { welcomeScreen };
