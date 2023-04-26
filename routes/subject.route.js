const express = require('express');
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
  check('id').isMongoId().withMessage('Invalid subjectId'),
  bodyValidation,
  getSubject
);

router.patch(
  '/:id',
  check('name').not().isEmpty().withMessage('Name is empty').trim(),
  check('codeName').not().isEmpty().withMessage('CodeName is empty').trim(),
  check('id').isMongoId().withMessage('Invalid subjectId'),
  bodyValidation,
  updateSubject
);

router.patch(
  '/status/:id',
  check('id').isMongoId().withMessage('Invalid subjectId'),
  bodyValidation,
  changeSubjectStatus
);

module.exports = router;
