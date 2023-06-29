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

router.post(
  '/create',
  check('desc').not().isEmpty().withMessage('Description is empty').trim(),
  check('subject').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid subjectId');
    }
    return true;
  }),
  userValidation,
  bodyValidation,
  createMessage
);

router.get(
  '/subject/:subjectId',
  check('subjectId').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid subjectId');
    }
    return true;
  }),
  userValidation,
  bodyValidation,
  getMessages
);

module.exports = router;
