const httpStatus = require('http-status');

// utils
const logger = require('../utils/logger.js');

// models
const messageModel = require('../models/message.model.js');
const userModel = require('../models/user.model.js');
const portalModel = require('../models/portal.model.js');

const createMessage = async (req, res) => {
  try {
    portalModel
      .findOne({
        subject: req.body.subject,
        batch: req.user.batch,
      })
      .then((portal) => {
        if (portal) {
          new messageModel({
            desc: req.body.desc,
            subject: req.body.subject,
            portal: portal._id,
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
        } else {
          new portalModel({
            subject: req.body.subject,
            batch: user.batch,
          })
            .save()
            .then((newPortal) => {
              new messageModel({
                desc: req.body.desc,
                subject: req.body.subject,
                portal: newPortal._id,
                user: req.user._id,
              })
                .save()
                .populate('user')
                .then((message) => {
                  logger.info('Create Message');
                  return res.status(httpStatus.CREATED).json({
                    data: message,
                    success: true,
                    message: 'Create Message',
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

const getMessages = async (req, res) => {
  try {
    portalModel
      .findOne({
        subject: req.params.subjectId,
        batch: req.user.batch,
      })
      .then((portal) => {
        if (portal) {
          messageModel
            .find({
              subject: req.params.subjectId,
              portal: portal._id,
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
        } else {
          new portalModel({
            subject: req.params.subjectId,
            batch: user.batch,
          })
            .save()
            .then((newPortal) => {
              messageModel
                .find({
                  subject: req.params.subjectId,
                  portal: newPortal._id,
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

module.exports = { createMessage, getMessages };
