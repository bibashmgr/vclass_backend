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
  getBatchByUserId,
  getBatchesByPortal,
} = require('../controllers/batch.controller.js');

// middlewares
const {
  bodyValidation,
  userValidation,
} = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.post(
  '/create',
  userValidation,
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

router.get('/', userValidation, getBatches);

router.get('/userId', userValidation, getBatchByUserId);

router.get('/portal', userValidation, getBatchesByPortal);

router.get(
  '/:id',
  userValidation,
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid batchId');
    }
    return true;
  }),
  bodyValidation,
  getBatch
);

router.patch(
  '/:id',
  userValidation,
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
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid batchId');
    }
    return true;
  }),
  bodyValidation,
  updateBatch
);

router.patch(
  '/status/:id',
  userValidation,
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid batchId');
    }
    return true;
  }),
  bodyValidation,
  changeBatchStatus
);

module.exports = router;
