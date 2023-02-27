require('dotenv').config();

// environment_variables
const nodeEnv = process.env.NODE_ENV;
const portNumber = process.env.PORT_NUMBER || 9999;
const clientBaseUrl = process.env.CLIENT_BASE_URL;
const serverBaseUrl = process.env.SERVER_BASE_URL;
const mongodbUrl = process.env.MONGODB_LOCAL_URL;
const sessionSecret = process.env.SESSION_SECRET;
const jwtSecret = process.env.JWT_SECRET;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

module.exports = {
  nodeEnv,
  portNumber,
  clientBaseUrl,
  serverBaseUrl,
  mongodbUrl,
  sessionSecret,
  jwtSecret,
  googleClientId,
  googleClientSecret,
};
