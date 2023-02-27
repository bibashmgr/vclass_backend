// models
const batchModel = require('../models/batch.model.js');
const facultyModel = require('../models/faculty.model.js');

// utils
const logger = require('../utils/logger.js');

const createBatch = async (req, res) => {
  try {
    facultyModel.findById(req.body.facultyId).then((facultyInfo) => {
      if (facultyInfo) {
        new batchModel({
          year: req.body.year,
          facultyId: req.body.facultyId,
          semester: req.body.semester,
        })
          .save()
          .then((batch) => {
            logger.info('Create Batch');
            return res.status(201).json({
              data: batch,
              success: true,
              message: 'Create Batch',
            });
          });
      } else {
        logger.error('Invalid FacultyId');
        return res.status(400).json({
          data: null,
          success: false,
          message: 'Invalid FacultyId',
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

const getBatches = async (req, res) => {
  try {
    batchModel.find().then((batches) => {
      logger.info('Fetch batches');
      return res.status(200).json({
        data: batches,
        success: true,
        message: 'Fetch batches',
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

const getBatch = async (req, res) => {
  try {
    batchModel.findById(req.params.id).then((batch) => {
      if (batch) {
        logger.info('Fetch batchInfo');
        return res.status(200).json({
          data: batch,
          success: true,
          message: 'Fetch batchInfo',
        });
      } else {
        logger.warn('Failed to fetch batchInfo');
        return res.status(404).json({
          data: null,
          success: false,
          message: 'Failed to fetch batchInfo',
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

const updateBatch = async (req, res) => {
  try {
    facultyModel.findById(req.body.facultyId).then((facultyInfo) => {
      if (facultyInfo) {
        batchModel
          .findByIdAndUpdate(
            req.params.id,
            {
              year: req.body.year,
              facultyId: req.body.facultyId,
              semester: req.body.semester,
            },
            { new: true }
          )
          .then((batch) => {
            if (batch) {
              logger.info('Update batchInfo');
              return res.status(200).json({
                data: batch,
                success: true,
                message: 'Update batchInfo',
              });
            } else {
              logger.warn('Failed to update batchInfo');
              return res.status(404).json({
                data: null,
                success: false,
                message: 'Failed to update batchInfo',
              });
            }
          });
      } else {
        logger.error('Invalid FacultyId');
        return res.status(400).json({
          data: null,
          success: false,
          message: 'Invalid FacultyId',
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

const deleteBatch = async (req, res) => {
  try {
    batchModel.findByIdAndDelete(req.params.id).then((batch) => {
      if (batch) {
        logger.info('Delete batch');
        return res.status(200).json({
          data: null,
          success: true,
          message: 'Delete batch',
        });
      } else {
        logger.warn('Failed to delete batch');
        return res.status(404).json({
          data: null,
          success: false,
          message: 'Failed to delete batch',
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
  createBatch,
  getBatches,
  getBatch,
  updateBatch,
  deleteBatch,
};
