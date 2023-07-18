const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const {
  getUsers,
  getUser,
  updateUser,
  changeUserStatus,
  getUsersByBatch,
} = require('../controllers/user.controller.js');

// middlewares
const {
  bodyValidation,
  userValidation,
} = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.get('/', userValidation, getUsers);

router.get(
  '/:id',
  userValidation,
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid userId');
    }
    return true;
  }),
  bodyValidation,
  getUser
);

router.patch(
  '/:id',
  userValidation,
  check('role').not().isEmpty().withMessage('Role is empty').trim(),
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid userId');
    }
    return true;
  }),
  bodyValidation,
  updateUser
);

router.patch(
  '/status/:id',
  userValidation,
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid userId');
    }
    return true;
  }),
  bodyValidation,
  changeUserStatus
);

router.get(
  '/batch/:batchId',
  userValidation,
  check('batchId').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid batchId');
    }
    return true;
  }),
  bodyValidation,
  getUsersByBatch
);

module.exports = router;
