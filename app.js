const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
// const session = require('express-session');

// routes
const homeRoutes = require('./routes/home.route.js');
const authRoutes = require('./routes/auth.route.js');
const subjectRoutes = require('./routes/subject.route.js');
const facultyRoutes = require('./routes/faculty.route.js');
const batchRoutes = require('./routes/batch.route.js');
const userRoutes = require('./routes/user.route.js');

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
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  bodyParser.json({
    extended: true,
    verify: (req, res, buf, encoding) => {
      if (!req.is('application/json')) {
        return res.status(400).json({
          data: null,
          success: false,
          message: 'Invalid Request',
        });
      }

      try {
        JSON.parse(buf.toString(encoding));
      } catch (err) {
        logger.error('Invalid Request');
        return res.status(400).json({
          data: null,
          success: false,
          message: 'Invalid Request',
        });
      }
    },
  })
);

// app.use(
//   session({
//     secret: config.sessionSecret,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

app.use(passport.initialize());
// app.use(passport.session());
require('./utils/passport.js')(passport);

app.use(morganMiddleware);

app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/subjects', subjectRoutes);
app.use('/faculties', facultyRoutes);
app.use('/batches', batchRoutes);
app.use('/users', userRoutes);

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
