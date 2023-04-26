// models
const userModel = require('../models/user.model.js');

// utils
const logger = require('../utils/logger.js');

const getUsers = async (req, res) => {
  try {
    userModel.find().then((users) => {
      logger.info('Fetch users');
      return res.status(200).json({
        data: users,
        success: true,
        message: 'Fetch users',
      });
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
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
        return res.status(200).json({
          data: user,
          success: true,
          message: 'Fetch userInfo',
        });
      } else {
        logger.warn('Failed to fetch userInfo');
        return res.status(404).json({
          data: null,
          success: false,
          message: 'Failed to fetch userInfo',
        });
      }
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    userModel
      .findByIdAndUpdate(
        req.params.id,
        {
          role: req.body.role,
          college: req.body.college,
          batchId: req.body.batchId,
        },
        { new: true }
      )
      .then((user) => {
        if (user) {
          logger.info('Update userInfo');
          return res.status(200).json({
            data: user,
            success: true,
            message: 'Update userInfo',
          });
        } else {
          logger.warn('Failed to update userInfo');
          return res.status(404).json({
            data: null,
            success: false,
            message: 'Failed to update userInfo',
          });
        }
      });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
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
            return res.status(200).json({
              data: updatedUser,
              success: true,
              message: "Change user's status",
            });
          });
      } else {
        logger.warn('Failed to modify userInfo');
        return res.status(404).json({
          data: null,
          success: false,
          message: 'Failed to modify userInfo',
        });
      }
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
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
