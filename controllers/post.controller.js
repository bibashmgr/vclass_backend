const httpStatus = require('http-status');

// models
const portalModel = require('../models/portal.model.js');
const postModel = require('../models/post.model.js');
const fileModel = require('../models/file.model.js');

// utils
const logger = require('../utils/logger.js');

const createPost = async (req, res) => {
  try {
    portalModel
      .findOne({
        subject: req.body.subject,
        batch: req.user.batch,
      })
      .then((portal) => {
        if (portal) {
          new postModel({
            portal: portal._id,
            user: req.user._id,
            category: req.body.category,
            title: req.body.title,
            desc: req.body.desc,
            files: req.body.files,
            assignmentRef: req.body.assignmentRef,
          })
            .save()
            .then(async (post) => {
              if (req.body.category === 'submission') {
                postModel
                  .findByIdAndUpdate(req.body.assignmentRef, {
                    $push: {
                      submittedBy: post._id,
                    },
                  })
                  .then(() => {
                    logger.info('Push postRef to assignment');
                  });
              }

              const populatedPost = await post.populate(['user', 'files']);

              logger.info('Create Post');
              return res.status(httpStatus.CREATED).json({
                data: populatedPost,
                success: true,
                message: 'Create Post',
              });
            });
        } else {
          new portalModel({
            subject: req.body.subject,
            batch: req.user.batch,
          })
            .save()
            .then((newPortal) => {
              new postModel({
                portal: newPortal._id,
                user: req.user._id,
                category: req.body.category,
                title: req.body.title,
                desc: req.body.desc,
                files: req.body.files,
                assignmentRef: req.body.assignmentRef,
              })
                .save()
                .then(async (post) => {
                  if (req.body.category === 'submission') {
                    postModel
                      .findByIdAndUpdate(req.body.assignmentRef, {
                        $push: {
                          submittedBy: post._id,
                        },
                      })
                      .then(() => {
                        logger.info('Push postRef to assignment');
                      });
                  }

                  const populatedPost = await post.populate(['user', 'files']);

                  logger.info('Create Post');
                  return res.status(httpStatus.CREATED).json({
                    data: populatedPost,
                    success: true,
                    message: 'Create Post',
                  });
                });
            });
        }
      });
  } catch (error) {
    logger.error(error.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    portalModel
      .findOne({
        subject: req.params.subjectId,
        batch: req.user.batch,
      })
      .then((portal) => {
        if (portal) {
          postModel
            .find({
              portal: portal._id,
            })
            .populate(['user', 'files'])
            .then((posts) => {
              logger.info('Fetch posts');
              return res.status(httpStatus.OK).json({
                data: posts,
                success: true,
                message: 'Fetch posts',
              });
            });
        } else {
          new portalModel({
            subject: req.params.subjectId,
            batch: req.user.batch,
          })
            .save()
            .then((newPortal) => {
              postModel
                .find({
                  portal: newPortal._id,
                })
                .populate(['user', 'files'])
                .then((posts) => {
                  logger.info('Fetch posts');
                  return res.status(httpStatus.OK).json({
                    data: posts,
                    success: true,
                    message: 'Fetch posts',
                  });
                });
            });
        }
      });
  } catch (error) {
    logger.error(error.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

const getPost = async (req, res) => {
  try {
    postModel
      .findById(req.params.id)
      .populate(['user', 'files'])
      .then((post) => {
        if (post) {
          logger.info('Fetch postInfo');
          return res.status(httpStatus.OK).json({
            data: post,
            success: true,
            message: 'Fetch postInfo',
          });
        } else {
          logger.warn('Failed to fetch postInfo');
          return res.status(httpStatus.NOT_FOUND).json({
            data: null,
            success: false,
            message: 'Failed to fetch postInfo',
          });
        }
      });
  } catch (error) {
    logger.error(error.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    postModel
      .findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          desc: req.body.desc,
          files: req.body.files,
        },
        { new: true }
      )
      .populate(['user', 'files'])
      .then((post) => {
        if (post) {
          logger.info('Update post');
          return res.status(httpStatus.OK).json({
            data: post,
            success: true,
            message: 'Update post',
          });
        } else {
          logger.warn('Failed to update postInfo');
          return res.status(httpStatus.NOT_FOUND).json({
            data: null,
            success: false,
            message: 'Failed to update postInfo',
          });
        }
      });
  } catch (error) {
    logger.error(error.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    postModel.findByIdAndDelete(req.params.id).then((post) => {
      if (post) {
        if (post.category === 'submission') {
          postModel
            .findByIdAndUpdate(post.assignmentRef, {
              $pull: {
                submittedBy: post._id,
              },
            })
            .then(() => {
              logger.info('Pull postRef from assignment');
            });
        }

        logger.info('Delete post');
        return res.status(httpStatus.OK).json({
          data: null,
          success: true,
          message: 'Delete post',
        });
      } else {
        logger.warn('Failed to delete postInfo');
        return res.status(httpStatus.NOT_FOUND).json({
          data: null,
          success: false,
          message: 'Failed to delete postInfo',
        });
      }
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createPost, getPosts, getPost, updatePost, deletePost };