// config
const logger = require('../utils/logger.js');

const welcomeScreen = (req, res) => {
  try {
    res.status(200).json({
      data: null,
      success: true,
      message: 'Hello',
    });
    logger.info('Hello');
  } catch (error) {
    res.status(500).json({
      data: null,
      success: false,
      message: error.message,
    });
    logger.error(error.message);
  }
};

const errorScreen = (req, res, next) => {
  next();
  logger.error('This is Error');
};

module.exports = { welcomeScreen, errorScreen };
