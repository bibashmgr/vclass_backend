// models
const subjectModel = require('../models/subject.model.js');

// utils
const logger = require('../utils/logger.js');

const createSubject = async (req, res) => {
  try {
    new subjectModel({
      name: req.body.name,
      codeName: req.body.codeName,
    })
      .save()
      .then((subject) => {
        logger.info('Create Subject');
        return res.status(201).json({
          data: subject,
          success: true,
          message: 'Create Subject',
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

const getSubjects = async (req, res) => {
  try {
    subjectModel.find().then((subjects) => {
      logger.info('Fetch subjects');
      return res.status(200).json({
        data: subjects,
        success: true,
        message: 'Fetch subjects',
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

const getSubject = async (req, res) => {
  try {
    subjectModel.findById(req.params.id).then((subject) => {
      if (subject) {
        logger.info('Fetch subjectInfo');
        return res.status(200).json({
          data: subject,
          success: true,
          message: 'Fetch subjectInfo',
        });
      } else {
        logger.warn('Failed to fetch subjectInfo');
        return res.status(404).json({
          data: null,
          success: false,
          message: 'Failed to fetch subjectInfo',
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

const updateSubject = async (req, res) => {
  try {
    subjectModel
      .findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          codeName: req.body.codeName,
        },
        { new: true }
      )
      .then((subject) => {
        if (subject) {
          logger.info('Update subjectInfo');
          return res.status(200).json({
            data: subject,
            success: true,
            message: 'Update subjectInfo',
          });
        } else {
          logger.warn('Failed to update subjectInfo');
          return res.status(404).json({
            data: null,
            success: false,
            message: 'Failed to update subjectInfo',
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

const deleteSubject = async (req, res) => {
  try {
    subjectModel.findByIdAndDelete(req.params.id).then((subject) => {
      if (subject) {
        logger.info('Delete subject');
        return res.status(200).json({
          data: null,
          success: true,
          message: 'Delete subject',
        });
      } else {
        logger.warn('Failed to delete subject');
        return res.status(404).json({
          data: null,
          success: false,
          message: 'Failed to delete subject',
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
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
};
