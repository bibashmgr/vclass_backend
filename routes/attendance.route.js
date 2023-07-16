const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const {
  getAttendanceByDate,
  markAllPresent,
  markAllAbsent,
} = require('../controllers/attendance.controller.js');

// middlewares
const {
  bodyValidation,
  userValidation,
  portalValidation,
} = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.post(
  '/:batchId/:subjectId/present',
  userValidation,
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
  check('date').isDate().withMessage('Invalid query'),
  bodyValidation,
  portalValidation,
  markAllPresent
);

router.post(
  '/:batchId/:subjectId/absent',
  userValidation,
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
  check('date').isDate().withMessage('Invalid query'),
  bodyValidation,
  portalValidation,
  markAllAbsent
);

router.get(
  '/:batchId/:subjectId',
  userValidation,
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
  check('date').isDate().withMessage('Invalid query'),
  bodyValidation,
  getAttendanceByDate
);

module.exports = router;
