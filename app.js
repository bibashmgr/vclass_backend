const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

// routes
const homeRoutes = require('./routes/home.route.js');
const authRoutes = require('./routes/auth.route.js');

// config
const config = require('./config/config.js');

// utils
const logger = require('./utils/logger.js');

// middlewares
const morganMiddleware = require('./middlewares/morgan.middleware.js');

const app = express();

app.use(
  cors({
    origin: config.clientBaseUrl,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport.js')(passport);

app.use(morganMiddleware);

app.use('/', homeRoutes);
app.use('/auth', authRoutes);

const httpServer = http.createServer(app);

mongoose.set('strictQuery', true);
mongoose.connect(
  config.mongodbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) {
      logger.error(error.message);
    } else {
      logger.info('Database Connected');
      httpServer.listen(config.portNumber, (err) => {
        if (err) {
          logger.error(err.message);
        } else {
          logger.info(`Server running on ${config.serverBaseUrl}`);
        }
      });
    }
  }
);
