const httpStatus = require('http-status');

// models
const batchModel = require('../models/batch.model.js');
const facultyModel = require('../models/faculty.model.js');

// utils
const logger = require('../utils/logger.js');

const createBatch = async (req, res) => {
  try {
    facultyModel.findById(req.body.faculty).then((facultyInfo) => {
      if (facultyInfo) {
        new batchModel({
          year: req.body.year,
          faculty: req.body.faculty,
          currentSemester: req.body.currentSemester,
        })
          .save()
          .then((batch) => {
            logger.info('Create Batch');
            return res.status(httpStatus.CREATED).json({
              data: batch,
              success: true,
              message: 'Create Batch',
            });
          });
      } else {
        logger.error('Invalid FacultyId');
        return res.status(httpStatus.BAD_REQUEST).json({
          data: null,
          success: false,
          message: 'Invalid FacultyId',
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

const getBatches = async (req, res) => {
  try {
    batchModel
      .find()
      .populate('faculty')
      .then((batches) => {
        logger.info('Fetch batches');
        return res.status(httpStatus.OK).json({
          data: batches,
          success: true,
          message: 'Fetch batches',
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

const getBatch = async (req, res) => {
  try {
    batchModel.findById(req.params.id).then((batch) => {
      if (batch) {
        logger.info('Fetch batchInfo');
        return res.status(httpStatus.OK).json({
          data: batch,
          success: true,
          message: 'Fetch batchInfo',
        });
      } else {
        logger.warn('Failed to fetch batchInfo');
        return res.status(httpStatus.NOT_FOUND).json({
          data: null,
          success: false,
          message: 'Failed to fetch batchInfo',
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

const updateBatch = async (req, res) => {
  try {
    facultyModel.findById(req.body.faculty).then((facultyInfo) => {
      if (facultyInfo) {
        batchModel
          .findByIdAndUpdate(
            req.params.id,
            {
              year: req.body.year,
              faculty: req.body.faculty,
              currentSemester: req.body.currentSemester,
            },
            { new: true }
          )
          .then((batch) => {
            if (batch) {
              logger.info('Update batchInfo');
              return res.status(httpStatus.OK).json({
                data: batch,
                success: true,
                message: 'Update batchInfo',
              });
            } else {
              logger.warn('Failed to update batchInfo');
              return res.status(httpStatus.NOT_FOUND).json({
                data: null,
                success: false,
                message: 'Failed to update batchInfo',
              });
            }
          });
      } else {
        logger.error('Invalid FacultyId');
        return res.status(httpStatus.BAD_REQUEST).json({
          data: null,
          success: false,
          message: 'Invalid FacultyId',
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

const changeBatchStatus = async (req, res) => {
  try {
    batchModel.findById(req.params.id).then((batch) => {
      if (batch) {
        batchModel
          .findByIdAndUpdate(
            req.params.id,
            { isHidden: !batch.isHidden },
            { new: true }
          )
          .then((updatedBatch) => {
            logger.info("Change batch's status");
            return res.status(httpStatus.OK).json({
              data: updatedBatch,
              success: true,
              message: "Change batch's status",
            });
          });
      } else {
        logger.warn('Failed to modify batchInfo');
        return res.status(httpStatus.NOT_FOUND).json({
          data: null,
          success: false,
          message: 'Failed to modify batchInfo',
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
  createBatch,
  getBatches,
  getBatch,
  updateBatch,
  changeBatchStatus,
};
