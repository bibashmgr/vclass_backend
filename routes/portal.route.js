const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const { getPortalsByBatch } = require('../controllers/portal.controller.js');

// middlewares
const { userValidation } = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.get('/:batchId', userValidation, getPortalsByBatch);

module.exports = router;
