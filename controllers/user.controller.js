const httpStatus = require('http-status');

// models
const userModel = require('../models/user.model.js');
const batchModel = require('../models/batch.model.js');
const facultyModel = require('../models/faculty.model.js');

// utils
const logger = require('../utils/logger.js');

const getUsers = async (req, res) => {
  try {
    userModel.find().then((users) => {
      logger.info('Fetch users');
      return res.status(httpStatus.OK).json({
        data: users,
        success: true,
        message: 'Fetch users',
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

const getUser = async (req, res) => {
  try {
    userModel.findById(req.params.id).then((user) => {
      if (user) {
        logger.info('Fetch userInfo');
        return res.status(httpStatus.OK).json({
          data: user,
          success: true,
          message: 'Fetch userInfo',
        });
      } else {
        logger.warn('Failed to fetch userInfo');
        return res.status(httpStatus.NOT_FOUND).json({
          data: null,
          success: false,
          message: 'Failed to fetch userInfo',
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

const updateUser = async (req, res) => {
  try {
    batchModel.findById(req.body.faculty).then((batch) => {
      if (batch) {
        facultyModel.findById(req.body.faculty).then((faculty) => {
          if (faculty) {
            userModel
              .findByIdAndUpdate(
                req.params.id,
                {
                  role: req.body.role,
                  college: req.body.college,
                  batch: req.body.batch,
                  faculty: req.body.faculty,
                },
                { new: true }
              )
              .then((user) => {
                if (user) {
                  logger.info('Update userInfo');
                  return res.status(httpStatus.OK).json({
                    data: user,
                    success: true,
                    message: 'Update userInfo',
                  });
                } else {
                  logger.warn('Failed to update userInfo');
                  return res.status(httpStatus.NOT_FOUND).json({
                    data: null,
                    success: false,
                    message: 'Failed to update userInfo',
                  });
                }
              });
          } else {
            logger.warn('Invalid facultyId');
            return res.status(httpStatus.BAD_REQUEST).json({
              data: null,
              success: false,
              message: 'Invalid facultyId',
            });
          }
        });
      } else {
        logger.warn('Invalid batchId');
        return res.status(httpStatus.BAD_REQUEST).json({
          data: null,
          success: false,
          message: 'Invalid batchId',
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

const changeUserStatus = async (req, res) => {
  try {
    userModel.findById(req.params.id).then((user) => {
      if (user) {
        userModel
          .findByIdAndUpdate(
            req.params.id,
            { isHidden: !user.isHidden },
            { new: true }
          )
          .then((updatedUser) => {
            logger.info("Change user's status");
            return res.status(httpStatus.OK).json({
              data: updatedUser,
              success: true,
              message: "Change user's status",
            });
          });
      } else {
        logger.warn('Failed to modify userInfo');
        return res.status(httpStatus.NOT_FOUND).json({
          data: null,
          success: false,
          message: 'Failed to modify userInfo',
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

module.exports = {
  getUsers,
  getUser,
  updateUser,
  changeUserStatus,
};
