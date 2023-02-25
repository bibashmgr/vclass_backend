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
        logger.info('Create Faculty');
        return res.status(201).json({
          data: faculty,
          success: true,
          message: 'Create Faculty',
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

const getFaculties = async (req, res) => {
  try {
    facultyModel.find().then((faculties) => {
      logger.info('Fetch faculties');
      return res.status(200).json({
        data: faculties,
        success: true,
        message: 'Fetch faculties',
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

const getFaculty = async (req, res) => {
  try {
    facultyModel.findById(req.params.id).then((faculty) => {
      if (faculty) {
        logger.info('Fetch facultyInfo');
        return res.status(200).json({
          data: faculty,
          success: true,
          message: 'Fetch facultyInfo',
        });
      } else {
        logger.warn('Failed to fetch facultyInfo');
        return res.status(404).json({
          data: null,
          success: false,
          message: 'Failed to fetch facultyInfo',
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
          logger.info('Update facultyInfo');
          return res.status(200).json({
            data: faculty,
            success: true,
            message: 'Update facultyInfo',
          });
        } else {
          logger.warn('Failed to update facultyInfo');
          return res.status(404).json({
            data: null,
            success: false,
            message: 'Failed to update facultyInfo',
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

const deleteFaculty = async (req, res) => {
  try {
    facultyModel.findByIdAndDelete(req.params.id).then((faculty) => {
      if (faculty) {
        logger.info('Delete faculty');
        return res.status(200).json({
          data: null,
          success: true,
          message: 'Delete faculty',
        });
      } else {
        logger.warn('Failed to delete faculty');
        return res.status(404).json({
          data: null,
          success: false,
          message: 'Failed to delete faculty',
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
  createFaculty,
  getFaculties,
  getFaculty,
  updateFaculty,
  deleteFaculty,
};
