const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const { getDashboard } = require('../controllers/dashboard.controller.js');

// middlewares
const { userValidation } = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.get('/', userValidation, getDashboard);

module.exports = router;
