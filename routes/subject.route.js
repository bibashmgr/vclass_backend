const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subject.controller.js');

// middlewares
const { bodyValidation } = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.post(
  '/create',
  check('name').not().isEmpty().withMessage('Name is empty').trim(),
  check('codeName').not().isEmpty().withMessage('CodeName is empty').trim(),
  bodyValidation,
  createSubject
);

router.get('/', getSubjects);

router.get(
  '/:id',
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid subjectId');
    }
    return true;
  }),
  bodyValidation,
  getSubject
);

router.put(
  '/:id',
  check('name').not().isEmpty().withMessage('Name is empty').trim(),
  check('codeName').not().isEmpty().withMessage('CodeName is empty').trim(),
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid subjectId');
    }
    return true;
  }),
  bodyValidation,
  updateSubject
);

router.delete(
  '/:id',
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid subjectId');
    }
    return true;
  }),
  bodyValidation,
  deleteSubject
);

module.exports = router;
