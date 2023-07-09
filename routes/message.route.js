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
  portalValidation,
} = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.post(
  '/:batchId/:subjectId/create',
  check('desc').not().isEmpty().withMessage('Description is empty').trim(),
  check('batchId').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid batchId');
    }
    return true;
  }),
  check('subjectId').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid subjectId');
    }
    return true;
  }),
  userValidation,
  bodyValidation,
  portalValidation,
  createMessage
);

router.get(
  '/:batchId/:subjectId',
  check('batchId').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid batchId');
    }
    return true;
  }),
  check('subjectId').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid subjectId');
    }
    return true;
  }),
  userValidation,
  bodyValidation,
  portalValidation,
  getMessages
);

module.exports = router;
