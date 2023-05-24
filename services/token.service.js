const jwt = require('jsonwebtoken');

// config
const config = require('../config/config.js');

const generateToken = (payload) => {
  let token = jwt.sign(
    {
      id: payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * config.jwtAccessExpirationMins,
    },
    config.jwtSecret
  );
  return token;
};

module.exports = { generateToken };
