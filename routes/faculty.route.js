const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const {
  createFaculty,
  getFaculties,
  getFaculty,
  updateFaculty,
  changeFacultyStatus,
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
  check('id').isMongoId().withMessage('Invalid facultyId'),
  bodyValidation,
  getFaculty
);

router.patch(
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
  check('id').isMongoId().withMessage('Invalid facultyId'),
  bodyValidation,
  updateFaculty
);

router.patch(
  '/status/:id',
  check('id').isMongoId().withMessage('Invalid facultyId'),
  bodyValidation,
  changeFacultyStatus
);

module.exports = router;
