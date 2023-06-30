const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

// controllers
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} = require('../controllers/post.controller.js');

// middlewares
const {
  bodyValidation,
  userValidation,
} = require('../middlewares/validation.middleware.js');

// models
const postModel = require('../models/post.model.js');

const router = express.Router();

router.post(
  '/create',
  userValidation,
  check('subject').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid subjectId');
    }
    return true;
  }),
  check('title').not().isEmpty().withMessage('Title is empty').trim(),
  check('files')
    .isArray()
    .withMessage('Files must be Array')
    .custom((value) => {
      if (value?.length === 0) {
        return Promise.reject('Files are required');
      }
      return true;
    }),
  check('category').custom(async (value, { req }) => {
    let options = ['material', 'submission', 'assignment'];
    if (options.includes(value)) {
      if (value === 'submission') {
        if (mongoose.isObjectIdOrHexString(req.body.assignmentRef)) {
          try {
            let post = await postModel.findById(req.body.assignmentRef);

            if (post) {
              if (post.category === 'assignment') {
                return true;
              } else {
                return Promise.reject('Invalid AssignmentRef');
              }
            } else {
              return Promise.reject('Invalid AssignmentRef');
            }
          } catch (error) {
            return Promise.reject(error);
          }
        }
        {
          return Promise.reject('Invalid AssignmentRef');
        }
      } else {
        req.body.assignmentRef = null;
        return true;
      }
    } else {
      return Promise.reject('Invalid Category');
    }
  }),
  bodyValidation,
  createPost
);

router.get(
  '/subject/:subjectId',
  check('subjectId').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid subjectId');
    }
    return true;
  }),
  userValidation,
  bodyValidation,
  getPosts
);

router.get(
  '/:id',
  userValidation,
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid postId');
    }
    return true;
  }),
  bodyValidation,
  getPost
);

router.patch(
  '/:id',
  userValidation,
  check('title').not().isEmpty().withMessage('Title is empty').trim(),
  check('files')
    .isArray()
    .withMessage('Files must be Array')
    .custom((value) => {
      if (value?.length === 0) {
        return Promise.reject('Files are required');
      }
      return true;
    }),
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid postId');
    }
    return true;
  }),
  bodyValidation,
  updatePost
);

router.delete(
  '/:id',
  userValidation,
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid postId');
    }
    return true;
  }),
  bodyValidation,
  deletePost
);

module.exports = router;