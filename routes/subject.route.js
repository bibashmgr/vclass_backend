const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  changeSubjectStatus,
} = require('../controllers/subject.controller.js');

// middlewares
const {
  bodyValidation,
  userValidation,
} = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.post(
  '/create',
  userValidation,
  check('name').not().isEmpty().withMessage('Name is empty').trim(),
  check('codeName').not().isEmpty().withMessage('CodeName is empty').trim(),
  bodyValidation,
  createSubject
);

router.get('/', userValidation, getSubjects);

router.get(
  '/:id',
  userValidation,
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid subjectId');
    }
    return true;
  }),
  bodyValidation,
  getSubject
);

router.patch(
  '/:id',
  userValidation,
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

router.patch(
  '/status/:id',
  userValidation,
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid subjectId');
    }
    return true;
  }),
  bodyValidation,
  changeSubjectStatus
);

module.exports = router;
