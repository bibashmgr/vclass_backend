const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const {
  createBatch,
  getBatches,
  getBatch,
  updateBatch,
  changeBatchStatus,
} = require('../controllers/batch.controller.js');

// middlewares
const { bodyValidation } = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.post(
  '/create',
  check('year')
    .trim()
    .isInt()
    .withMessage('Year is required')
    .isLength({ min: 4, max: 4 })
    .withMessage('Year is invalid'),
  check('faculty').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid facultyId');
    }
    return true;
  }),
  check('currentSemester')
    .trim()
    .not()
    .isEmpty()
    .withMessage('CurrentSemester is required')
    .isInt({ min: 1, max: 10 })
    .withMessage('Invalid currentSemester'),
  bodyValidation,
  createBatch
);

router.get('/', getBatches);

router.get(
  '/:id',
  check('id').isMongoId().withMessage('Invalid batchId'),
  bodyValidation,
  getBatch
);

router.patch(
  '/:id',
  check('year')
    .trim()
    .isNumeric()
    .withMessage('Year is required')
    .isLength({ min: 4, max: 4 })
    .withMessage('Year is invalid')
    .toInt(),
  check('faculty').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid facultyId');
    }
    return true;
  }),
  check('currentSemester')
    .not()
    .isEmpty()
    .withMessage('CurrentSemester is required')
    .isInt({ min: 1, max: 10 })
    .withMessage('Invalid currentSemester')
    .trim(),
  check('id').isMongoId().withMessage('Invalid batchId'),
  bodyValidation,
  updateBatch
);

router.patch(
  '/status/:id',
  check('id').isMongoId().withMessage('Invalid batchId'),
  bodyValidation,
  changeBatchStatus
);

module.exports = router;
