const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const {
  createMessage,
  getMessages,
} = require('../controllers/message.controller.js');

// middlewares
const {
  bodyValidation,
  userValidation,
} = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.post('/create', userValidation, bodyValidation, createMessage);

router.get('/:subjectId', userValidation, bodyValidation, getMessages);

module.exports = router;
