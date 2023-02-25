const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const {
  createFaculty,
  getFaculties,
  getFaculty,
  updateFaculty,
  deleteFaculty,
} = require('../controllers/faculty.controller.js');

// middlewares
const { bodyValidation } = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.post(
  '/create',
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

router.get('/', getFaculties);

router.get(
  '/:id',
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid facultyId');
    }
    return true;
  }),
  bodyValidation,
  getFaculty
);

router.put(
  '/:id',
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

router.delete(
  '/:id',
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid facultyId');
    }
    return true;
  }),
  bodyValidation,
  deleteFaculty
);

module.exports = router;
