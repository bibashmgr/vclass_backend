const httpStatus = require('http-status');

// utils
const logger = require('../utils/logger.js');

const getUserInfo = async (req, res) => {
  logger.info('Fetch userInfo');
  return res.status(httpStatus.OK).json({
    data: req.user,
    success: true,
    message: 'Fetch userInfo',
  });
};

module.exports = { getUserInfo };
