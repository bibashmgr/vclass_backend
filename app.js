const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

// routes
const homeRoutes = require('./routes/home.route.js');
const authRoutes = require('./routes/auth.route.js');

const app = express();
dotenv.config();

// environment_variables
const PORT_NUMBER = process.env.PORT_NUMBER || 9999;
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;
const MONGODB_URL = process.env.MONGODB_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(
  cors({
    origin: CLIENT_BASE_URL,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport.js')(passport);

app.use('/', homeRoutes);
app.use('/auth', authRoutes);

const httpServer = http.createServer(app);

mongoose.set('strictQuery', true);
mongoose.connect(
  MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Database connected');
      httpServer.listen(PORT_NUMBER, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Server running on http://localhost:${PORT_NUMBER}`);
        }
      });
    }
  }
);
