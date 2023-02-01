const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const indexRoutes = require('./routes/testRoutes.js');

const app = express();
dotenv.config();

// environment_variables
const PORT_NUMBER = process.env.PORT_NUMBER || 9999;
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(
  cors({
    origin: CLIENT_BASE_URL,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// routes
app.use('/', indexRoutes);

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
