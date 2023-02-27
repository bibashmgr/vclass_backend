const express = require('express');

// controllers
const {
  welcomeScreen,
  errorScreen,
} = require('../controllers/home.controller.js');

const router = express.Router();

// middlewares
const { userValidation } = require('../middlewares/validation.middleware.js');

router.get('/', userValidation, welcomeScreen);

module.exports = router;
