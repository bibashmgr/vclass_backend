const morgan = require('morgan');

// config
const config = require('./config.js');
const logger = require('./logger.js');

const stream = {
  write: (message) => logger.http(message),
};

const skip = () => {
  return config.nodeEnv !== 'development';
};

const morganMiddleware = morgan(':method :url :status', {
  stream,
  skip,
});

module.exports = morganMiddleware;
