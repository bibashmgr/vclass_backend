const httpStatus = require('http-status');

// models
const userModel = require('../models/user.model.js');
const batchModel = require('../models/batch.model.js');

// utils
const logger = require('../utils/logger.js');

const getUsers = async (req, res) => {
  try {
    userModel
      .find()
      .populate('batch')
      .then((users) => {
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
    userModel
      .findById(req.params.id)
      .populate('batch')
      .then((user) => {
        if (user) {
          logger.info('Fetch userInfo');
          return res.status(httpStatus.OK).json({
            data: user,
            success: true,
            message: 'Fetch userInfo',
          });
        } else {
          logger.error('Failed to fetch userInfo');
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
    batchModel.findById(req.body.batch).then((batch) => {
      if (batch) {
        userModel
          .findByIdAndUpdate(
            req.params.id,
            {
              role: req.body.role,
              college: req.body.college,
              batch: req.body.batch,
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
              logger.error('Failed to update userInfo');
              return res.status(httpStatus.NOT_FOUND).json({
                data: null,
                success: false,
                message: 'Failed to update userInfo',
              });
            }
          });
      } else {
        logger.error('Invalid batchId');
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
        logger.error('Failed to modify userInfo');
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

const getUsersByBatch = async (req, res) => {
  try {
    userModel.find({ batch: req.params.batchId }).then((users) => {
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

module.exports = {
  getUsers,
  getUser,
  updateUser,
  changeUserStatus,
  getUsersByBatch,
};
