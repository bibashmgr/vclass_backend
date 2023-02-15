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
        res.status(201).json({
          data: subject,
          success: true,
          message: 'Create Subject',
        });
        logger.info('Create Subject');
      });
  } catch (error) {
    res.status(500).json({
      data: null,
      success: false,
      message: error.message,
    });
    logger.error(error.message);
  }
};

const getSubjects = async (req, res) => {
  try {
    subjectModel.find().then((subjects) => {
      res.status(200).json({
        data: subjects,
        success: true,
        message: 'Fetch subjects',
      });
      logger.info('Fetch subjects');
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      success: false,
      message: error.message,
    });
    logger.error(error.message);
  }
};

const getSubject = async (req, res) => {
  try {
    subjectModel.findById(req.params.id).then((subject) => {
      if (subject) {
        res.status(200).json({
          data: subject,
          success: true,
          message: 'Fetch subjectInfo',
        });
        logger.info('Fetch subjectInfo');
      } else {
        res.status(404).json({
          data: null,
          success: false,
          message: 'Failed to fetch subjectInfo',
        });
        logger.warn('Failed to fetch subjectInfo');
      }
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      success: false,
      message: error.message,
    });
    logger.error(error.message);
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
          res.status(200).json({
            data: subject,
            success: true,
            message: 'Update subjectInfo',
          });
          logger.info('Update subjectInfo');
        } else {
          res.status(404).json({
            data: null,
            success: false,
            message: 'Failed to update subjectInfo',
          });
          logger.warn('Failed to update subjectInfo');
        }
      });
  } catch (error) {
    res.status(500).json({
      data: null,
      success: false,
      message: error.message,
    });
    logger.error(error.message);
  }
};

const deleteSubject = async (req, res) => {
  try {
    subjectModel.findByIdAndDelete(req.params.id).then((subject) => {
      if (subject) {
        res.status(200).json({
          data: null,
          success: true,
          message: 'Delete subject',
        });
        logger.info('Delete subject');
      } else {
        res.status(404).json({
          data: null,
          success: false,
          message: 'Failed to delete subject',
        });
        logger.warn('Failed to delete subject');
      }
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      success: false,
      message: error.message,
    });
    logger.error(error.message);
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
};
