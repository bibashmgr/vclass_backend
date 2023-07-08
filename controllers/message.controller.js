const httpStatus = require('http-status');

// utils
const logger = require('../utils/logger.js');

// models
const messageModel = require('../models/message.model.js');

const createMessage = async (req, res) => {
  try {
    new messageModel({
      desc: req.body.desc,
      portal: req.portalId,
      user: req.user._id,
    })
      .save()
      .then(async (message) => {
        const populatedMessage = await message.populate('user');

        logger.info('Create Message');
        return res.status(httpStatus.CREATED).json({
          data: populatedMessage,
          success: true,
          message: 'Create Message',
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

const getMessages = async (req, res) => {
  try {
    messageModel
      .find({
        portal: req.portalId,
      })
      .populate('user')
      .then((messages) => {
        logger.info('Fetch messages');
        return res.status(httpStatus.OK).json({
          data: messages,
          success: true,
          message: 'Fetch messages',
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

module.exports = { createMessage, getMessages };
