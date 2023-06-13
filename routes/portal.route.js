const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const {} = require('../controllers/portal.controller.js');

// middlewares
const {
  bodyValidation,
  userValidation,
} = require('../middlewares/validation.middleware.js');

const router = express.Router();

module.exports = router;
