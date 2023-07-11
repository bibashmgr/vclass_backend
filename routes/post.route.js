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
  portalValidation,
} = require('../middlewares/validation.middleware.js');

// models
const postModel = require('../models/post.model.js');

const router = express.Router();

router.post(
  '/:batchId/:subjectId/create',
  userValidation,
  check('batchId').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid batchId');
    }
    return true;
  }),
  check('subjectId').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid subjectId');
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
                req.body.dueDate = null;
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
        } else {
          return Promise.reject('Invalid AssignmentRef');
        }
      } else if (value === 'assignment') {
        let isValid = !isNaN(Date.parse(req.body.dueDate));

        if (isValid) {
          let dueDate = new Date(req.body.dueDate);
          let currentDate = new Date(Date.now() + 3600 * 1000 * 24);

          if (dueDate.getTime() > currentDate.getTime()) {
            req.body.assignmentRef = null;
            return true;
          } else {
            return Promise.reject('dueDate cannot be earlier than today');
          }
        } else {
          return Promise.reject('Invalid dueDate');
        }
      } else {
        req.body.assignmentRef = null;
        req.body.dueDate = null;
        return true;
      }
    } else {
      return Promise.reject('Invalid Category');
    }
  }),
  bodyValidation,
  portalValidation,
  createPost
);

router.get(
  '/:batchId/:subjectId',
  check('batchId').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid batchId');
    }
    return true;
  }),
  check('subjectId').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid subjectId');
    }
    return true;
  }),
  userValidation,
  bodyValidation,
  portalValidation,
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
  check('id').custom((value) => {
    if (!mongoose.isObjectIdOrHexString(value)) {
      return Promise.reject('Invalid postId');
    }
    return true;
  }),
  check('dueDate').custom((value) => {
    let isValid = !isNaN(Date.parse(value));

    if (isValid) {
      let dueDate = new Date(value);
      let currentDate = new Date(Date.now() + 3600 * 1000 * 24);

      if (dueDate.getTime() > currentDate.getTime()) {
        req.body.assignmentRef = null;
        return true;
      } else {
        return Promise.reject('dueDate cannot be earlier than today');
      }
    } else {
      return Promise.reject('Invalid dueDate');
    }
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
