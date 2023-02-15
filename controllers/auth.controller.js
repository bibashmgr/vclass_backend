// config
const logger = require('../utils/logger.js');

const getUserInfo = async (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({
        data: req.user,
        success: true,
        message: 'Fetch userInfo',
      });
      logger.info('Fetch userInfo');
    } else {
      res.status(404).json({
        data: null,
        success: false,
        message: 'Fail to fetch userInfo',
      });
      logger.warn('Fail to fetch userInfo');
    }
  } catch (error) {
    res.status(200).json({
      data: null,
      success: false,
      message: error.message,
    });
    logger.error(error.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        res.status(500).json({
          data: null,
          success: false,
          message: err.message,
        });
        logger.error(err.message);
      } else {
        res.status(200).json({
          data: null,
          success: true,
          message: 'Logout user',
        });
        logger.info('Logout user');
      }
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      success: false,
      message: error.message,
    });
    logger.error(error.message);
  }
};

module.exports = { getUserInfo, logoutUser };
