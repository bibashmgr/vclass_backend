// models
const facultyModel = require('../models/faculty.model.js');

// utils
const logger = require('../utils/logger.js');

const createFaculty = async (req, res) => {
  try {
    new facultyModel({
      name: req.body.name,
      semesters: req.body.semesters,
    })
      .save()
      .then((faculty) => {
        res.status(201).json({
          data: faculty,
          success: true,
          message: 'Create Faculty',
        });
        logger.info('Create Faculty');
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

const getFaculties = async (req, res) => {
  try {
    facultyModel.find().then((faculties) => {
      res.status(200).json({
        data: faculties,
        success: true,
        message: 'Fetch faculties',
      });
      logger.info('Fetch faculties');
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

const getFaculty = async (req, res) => {
  try {
    facultyModel.findById(req.params.id).then((faculty) => {
      if (faculty) {
        res.status(200).json({
          data: faculty,
          success: true,
          message: 'Fetch facultyInfo',
        });
        logger.info('Fetch facultyInfo');
      } else {
        res.status(404).json({
          data: null,
          success: false,
          message: 'Failed to fetch facultyInfo',
        });
        logger.warn('Failed to fetch facultyInfo');
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

const updateFaculty = async (req, res) => {
  try {
    facultyModel
      .findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          semesters: req.body.semesters,
        },
        { new: true }
      )
      .then((faculty) => {
        if (faculty) {
          res.status(200).json({
            data: faculty,
            success: true,
            message: 'Update facultyInfo',
          });
          logger.info('Update facultyInfo');
        } else {
          res.status(404).json({
            data: null,
            success: false,
            message: 'Failed to update facultyInfo',
          });
          logger.warn('Failed to update facultyInfo');
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

const deleteFaculty = async (req, res) => {
  try {
    facultyModel.findByIdAndDelete(req.params.id).then((faculty) => {
      if (faculty) {
        res.status(200).json({
          data: null,
          success: true,
          message: 'Delete faculty',
        });
        logger.info('Delete faculty');
      } else {
        res.status(404).json({
          data: null,
          success: false,
          message: 'Failed to delete faculty',
        });
        logger.warn('Failed to delete faculty');
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
  createFaculty,
  getFaculties,
  getFaculty,
  updateFaculty,
  deleteFaculty,
};
