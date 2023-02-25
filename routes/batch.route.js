const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const {
  createBatch,
  getBatches,
  getBatch,
  updateBatch,
  deleteBatch,
} = require('../controllers/batch.controller.js');

// middlewares
const { bodyValidation } = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.post(
  '/create',
  check('year')
    .trim()
    .isNumeric()
    .withMessage('Year is required')
    .isLength({ min: 4, max: 4 })
    .withMessage('Year is invalid')
    .toInt(),
  check('facultyId').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid facultyId');
    }
    return true;
  }),
  check('semester')
    .trim()
    .isNumeric()
    .withMessage('Semester is required')
    .toInt(),
  bodyValidation,
  createBatch
);

router.get('/', getBatches);

router.get(
  '/:id',
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid batchId');
    }
    return true;
  }),
  bodyValidation,
  getBatch
);

router.put(
  '/:id',
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid batchId');
    }
    return true;
  }),
  check('year')
    .trim()
    .isNumeric()
    .withMessage('Year is required')
    .isLength({ min: 4, max: 4 })
    .withMessage('Year is invalid')
    .toInt(),
  check('facultyId').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid facultyId');
    }
    return true;
  }),
  check('semester')
    .trim()
    .isNumeric()
    .withMessage('Semester is required')
    .toInt(),
  bodyValidation,
  updateBatch
);

router.delete(
  '/:id',
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid batchId');
    }
    return true;
  }),
  bodyValidation,
  deleteBatch
);

module.exports = router;
