const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const { Server } = require('socket.io');

// routes
const homeRoutes = require('./routes/home.route.js');
const authRoutes = require('./routes/auth.route.js');
const dashboardRoutes = require('./routes/dashboard.route.js');
const subjectRoutes = require('./routes/subject.route.js');
const facultyRoutes = require('./routes/faculty.route.js');
const batchRoutes = require('./routes/batch.route.js');
const userRoutes = require('./routes/user.route.js');
const portalRoutes = require('./routes/portal.route.js');
const messageRoutes = require('./routes/message.route.js');
const fileRoutes = require('./routes/file.route.js');
const postRoutes = require('./routes/post.route.js');
const attendanceRoutes = require('./routes/attendance.route.js');

// config
const config = require('./config/config.js');

// utils
const logger = require('./utils/logger.js');

// middlewares
const morganMiddleware = require('./middlewares/morgan.middleware.js');

// services
const socketProvider = require('./services/socket.service.js');

// helpers
const GfsBucket = require('./helpers/gridfsManager.js');

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

app.use(passport.initialize());
require('./utils/passport.js')(passport);

app.use(morganMiddleware);

app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/subjects', subjectRoutes);
app.use('/faculties', facultyRoutes);
app.use('/batches', batchRoutes);
app.use('/users', userRoutes);
app.use('/portals', portalRoutes);
app.use('/messages', messageRoutes);
app.use('/files', fileRoutes);
app.use('/posts', postRoutes);
app.use('/attendances', attendanceRoutes);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_BASE_URL,
  },
});

socketProvider(io);

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
      new GfsBucket();
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
