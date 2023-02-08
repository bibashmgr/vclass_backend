const express = require('express');

// controllers
const { welcomeScreen } = require('../controllers/home.controller.js');

const router = express.Router();

router.get('/', welcomeScreen);

module.exports = router;
