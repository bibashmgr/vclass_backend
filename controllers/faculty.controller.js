const httpStatus = require('http-status');

// models
const facultyModel = require('../models/faculty.model.js');

// utils
const logger = require('../utils/logger.js');

const createFaculty = async (req, res) => {
  try {
    facultyModel.exists({ name: req.body.name }).then((existingFaculty) => {
      if (existingFaculty) {
        logger.error('Name already exists');
        return res.status(httpStatus.BAD_REQUEST).json({
          data: null,
          success: false,
          message: 'Name already exists',
        });
      } else {
        new facultyModel({
          name: req.body.name,
          semesters: req.body.semesters,
        })
          .save()
          .then((faculty) => {
            logger.info('Create Faculty');
            return res.status(httpStatus.CREATED).json({
              data: faculty,
              success: true,
              message: 'Create Faculty',
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

const getFaculties = async (req, res) => {
  try {
    facultyModel
      .find()
      .populate({
        path: 'semesters',
        model: 'subjects',
      })
      .then((faculties) => {
        logger.info('Fetch faculties');
        return res.status(httpStatus.OK).json({
          data: faculties,
          success: true,
          message: 'Fetch faculties',
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

const getFaculty = async (req, res) => {
  try {
    facultyModel
      .findById(req.params.id)
      .populate({
        path: 'semesters',
        model: 'subjects',
      })
      .then((faculty) => {
        if (faculty) {
          logger.info('Fetch facultyInfo');
          return res.status(httpStatus.OK).json({
            data: faculty,
            success: true,
            message: 'Fetch facultyInfo',
          });
        } else {
          logger.warn('Failed to fetch facultyInfo');
          return res.status(httpStatus.NOT_FOUND).json({
            data: null,
            success: false,
            message: 'Failed to fetch facultyInfo',
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
          return res.status(httpStatus.OK).json({
            data: faculty,
            success: true,
            message: 'Update facultyInfo',
          });
        } else {
          logger.warn('Failed to update facultyInfo');
          return res.status(httpStatus.NOT_FOUND).json({
            data: null,
            success: false,
            message: 'Failed to update facultyInfo',
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

const changeFacultyStatus = async (req, res) => {
  try {
    facultyModel.findById(req.params.id).then((faculty) => {
      if (faculty) {
        facultyModel
          .findByIdAndUpdate(
            req.params.id,
            { isHidden: !faculty.isHidden },
            { new: true }
          )
          .then((updatedFaculty) => {
            logger.info("Change faculty's status");
            return res.status(httpStatus.OK).json({
              data: updatedFaculty,
              success: true,
              message: "Change faculty's status",
            });
          });
      } else {
        logger.warn('Failed to modify facultyInfo');
        return res.status(httpStatus.NOT_FOUND).json({
          data: null,
          success: false,
          message: 'Failed to modify facultyInfo',
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
  createFaculty,
  getFaculties,
  getFaculty,
  updateFaculty,
  changeFacultyStatus,
};
