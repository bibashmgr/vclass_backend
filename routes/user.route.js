const express = require('express');
const { check } = require('express-validator');

// controllers
const {
  getUsers,
  getUser,
  updateUser,
  changeUserStatus,
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
  check('id').isMongoId().withMessage('Invalid userId'),
  bodyValidation,
  getUser
);

router.patch(
  '/:id',
  userValidation,
  check('role').not().isEmpty().withMessage('Role is empty').trim(),
  check('college').not().isEmpty().withMessage('College is empty').trim(),
  check('batch').isMongoId().withMessage('Invalid batchId'),
  check('faculty').isMongoId().withMessage('Invalid facultyId'),
  check('id').isMongoId().withMessage('Invalid userId'),
  bodyValidation,
  updateUser
);

router.patch(
  '/status/:id',
  userValidation,
  check('id').isMongoId().withMessage('Invalid userId'),
  bodyValidation,
  changeUserStatus
);

module.exports = router;
