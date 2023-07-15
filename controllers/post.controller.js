const httpStatus = require('http-status');

// models
const userModel = require('../models/user.model.js');
const postModel = require('../models/post.model.js');
const fileModel = require('../models/file.model.js');

// utils
const logger = require('../utils/logger.js');

// helpers
const GfsBucket = require('../helpers/gridfsManager.js');

const createPost = async (req, res) => {
  try {
    new postModel({
      portal: req.portalId,
      user: req.user._id,
      category: req.body.category,
      title: req.body.title,
      desc: req.body.desc,
      files: req.body.files,
      assignmentRef: req.body.assignmentRef,
      dueDate: req.body.dueDate,
      credit: req.body.credit,
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
    postModel
      .find({
        portal: req.portalId,
        category: {
          $in: ['material', 'assignment'],
        },
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
      .populate([
        'user',
        'files',
        {
          path: 'submittedBy',
          populate: ['user', 'files'],
        },
      ])
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
          dueDate: req.body.dueDate,
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
    let gfsBucket = new GfsBucket();
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

        post.files.map((file) => {
          gfsBucket.delete(file);
          logger.info('Delete file');
        });

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

const getAllStats = async (req, res) => {
  try {
    let results = [];

    const users = await userModel.find({
      batch: req.params.batchId,
      role: 'student',
    });

    const posts = await postModel
      .find({
        portal: req.portalId,
        category: 'assignment',
      })
      .populate(['submittedBy']);

    users.map((user) => {
      let stats = {
        done: 0,
        late: 0,
        missing: 0,
      };
      let mappedPosts = [];

      posts.map((post) => {
        let mappedPost = {
          title: post.title,
          status: '',
        };

        let isSubmitted = post.submittedBy.find(
          (subPost) => subPost.user.toString() === user._id.toString()
        );

        if (isSubmitted) {
          let submittedDate = new Date(isSubmitted.createdAt).getTime();
          let dueDate = new Date(post.dueDate).getTime();

          if (submittedDate <= dueDate) {
            stats.done += 1;
            mappedPost.status = 'done';
          } else {
            stats.late += 1;
            mappedPost.status = 'late';
          }
        } else {
          stats.missing += 1;
          mappedPost.status = 'missing';
        }

        mappedPosts.push(mappedPost);
      });

      results.push({
        user: {
          name: user.name,
          email: user.email,
        },
        posts: mappedPosts,
        stats: stats,
      });
    });

    return res.status(httpStatus.OK).json({
      data: results,
      success: true,
      message: 'Fetch all stats',
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

const getSingleStats = async (req, res) => {
  try {
    let results = [];

    const post = await postModel
      .findById(req.params.id)
      .populate(['portal', 'submittedBy']);

    const users = await userModel.find({
      batch: post.portal.batch,
      role: 'student',
    });

    users.map((user) => {
      let status = '';
      let isSubmitted = post.submittedBy.find(
        (subPost) => subPost.user.toString() === user._id.toString()
      );

      if (isSubmitted) {
        let submittedDate = new Date(isSubmitted.createdAt).getTime();
        let dueDate = new Date(post.dueDate).getTime();

        if (submittedDate <= dueDate) {
          status = 'done';
        } else {
          status = 'late';
        }
      } else {
        status = 'missing';
      }

      results.push({
        name: user.name,
        email: user.email,
        status: status,
      });
    });

    return res.status(httpStatus.OK).json({
      data: results,
      success: true,
      message: 'Fetch all stats',
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

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getAllStats,
  getSingleStats,
};
