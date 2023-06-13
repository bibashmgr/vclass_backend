const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const {
  createFaculty,
  getFaculties,
  getFaculty,
  getFacultyByBatch,
  updateFaculty,
  changeFacultyStatus,
} = require('../controllers/faculty.controller.js');

// middlewares
const {
  bodyValidation,
  userValidation,
} = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.post(
  '/create',
  userValidation,
  check('name').not().isEmpty().withMessage('Name is required').trim(),
  check('semesters')
    .isArray()
    .withMessage('Semesters must be Array')
    .custom((value) => {
      if (value?.length === 0) {
        return Promise.reject('Semesters are required');
      }
      return true;
    }),
  bodyValidation,
  createFaculty
);

router.get('/', userValidation, getFaculties);

router.get('/batch', userValidation, bodyValidation, getFacultyByBatch);

router.get(
  '/:id',
  userValidation,
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid facultyId');
    }
    return true;
  }),
  bodyValidation,
  getFaculty
);

router.patch(
  '/:id',
  userValidation,
  check('name').not().isEmpty().withMessage('Name is required').trim(),
  check('semesters')
    .isArray()
    .withMessage('Semesters must be Array')
    .custom((value) => {
      if (value?.length === 0) {
        return Promise.reject('Semesters are required');
      }
      return true;
    }),
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid facultyId');
    }
    return true;
  }),
  bodyValidation,
  updateFaculty
);

router.patch(
  '/status/:id',
  userValidation,
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid facultyId');
    }
    return true;
  }),
  bodyValidation,
  changeFacultyStatus
);

module.exports = router;
