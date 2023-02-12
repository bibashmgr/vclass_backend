const express = require('express');

// controllers
const {
  welcomeScreen,
  errorScreen,
} = require('../controllers/home.controller.js');

const router = express.Router();

router.get('/', welcomeScreen);
router.get('/error', errorScreen);

module.exports = router;
