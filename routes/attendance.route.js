const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const {
  markStudents,
  getAttendanceByDate,
  getAttendanceByUser,
} = require('../controllers/attendance.controller.js');

// middlewares
const {
  bodyValidation,
  userValidation,
  portalValidation,
} = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.post(
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
  check('students').isArray().withMessage('Students must be Array'),
  bodyValidation,
  portalValidation,
  markStudents
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
  portalValidation,
  getAttendanceByDate
);

router.get(
  '/:batchId/:subjectId/:userId',
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
  check('userId').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid userId');
    }
    return true;
  }),
  bodyValidation,
  portalValidation,
  getAttendanceByUser
);

module.exports = router;
