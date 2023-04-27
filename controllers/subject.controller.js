const httpStatus = require('http-status');

// models
const subjectModel = require('../models/subject.model.js');

// utils
const logger = require('../utils/logger.js');

const createSubject = async (req, res) => {
  try {
    new subjectModel({
      name: req.body.name,
      codeName: req.body.codeName,
      desc: req.body.desc,
    })
      .save()
      .then((subject) => {
        logger.info('Create Subject');
        return res.status(httpStatus.CREATED).json({
          data: subject,
          success: true,
          message: 'Create Subject',
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

const getSubjects = async (req, res) => {
  try {
    subjectModel.find().then((subjects) => {
      logger.info('Fetch subjects');
      return res.status(httpStatus.OK).json({
        data: subjects,
        success: true,
        message: 'Fetch subjects',
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

const getSubject = async (req, res) => {
  try {
    subjectModel.findById(req.params.id).then((subject) => {
      if (subject) {
        logger.info('Fetch subjectInfo');
        return res.status(httpStatus.OK).json({
          data: subject,
          success: true,
          message: 'Fetch subjectInfo',
        });
      } else {
        logger.warn('Failed to fetch subjectInfo');
        return res.status(httpStatus.NOT_FOUND).json({
          data: null,
          success: false,
          message: 'Failed to fetch subjectInfo',
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

const updateSubject = async (req, res) => {
  try {
    subjectModel
      .findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          codeName: req.body.codeName,
          desc: req.body.desc,
        },
        { new: true }
      )
      .then((subject) => {
        if (subject) {
          logger.info('Update subjectInfo');
          return res.status(httpStatus.OK).json({
            data: subject,
            success: true,
            message: 'Update subjectInfo',
          });
        } else {
          logger.warn('Failed to update subjectInfo');
          return res.status(httpStatus.NOT_FOUND).json({
            data: null,
            success: false,
            message: 'Failed to update subjectInfo',
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

const changeSubjectStatus = async (req, res) => {
  try {
    subjectModel.findById(req.params.id).then((subject) => {
      if (subject) {
        subjectModel
          .findByIdAndUpdate(
            req.params.id,
            { isHidden: !subject.isHidden },
            { new: true }
          )
          .then((updatedSubject) => {
            logger.info("Change subject's status");
            return res.status(httpStatus.OK).json({
              data: updatedSubject,
              success: true,
              message: "Change subject's status",
            });
          });
      } else {
        logger.warn('Failed to modify subjectInfo');
        return res.status(httpStatus.NOT_FOUND).json({
          data: null,
          success: false,
          message: 'Failed to modify subjectInfo',
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
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  changeSubjectStatus,
};
