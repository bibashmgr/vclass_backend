const httpStatus = require('http-status');

// models
const batchModel = require('../models/batch.model.js');
const facultyModel = require('../models/faculty.model.js');
const portalModel = require('../models/portal.model.js');

// utils
const logger = require('../utils/logger.js');

const createBatch = async (req, res) => {
  try {
    batchModel
      .exists({ year: req.body.year, faculty: req.body.faculty })
      .then((existingBatch) => {
        if (existingBatch) {
          logger.error('Batch already exists');
          return res.status(httpStatus.BAD_REQUEST).json({
            data: null,
            success: false,
            message: 'Batch already exists',
          });
        } else {
          facultyModel.findById(req.body.faculty).then((faculty) => {
            if (faculty) {
              if (req.body.currentSemester > faculty.semesters.length) {
                logger.error('Invalid currentSemester');
                return res.status(httpStatus.BAD_REQUEST).json({
                  data: null,
                  success: false,
                  message: 'Invalid currentSemester',
                });
              } else {
                new batchModel({
                  year: req.body.year,
                  faculty: req.body.faculty,
                  currentSemester: req.body.currentSemester,
                  desc: req.body.desc,
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
              }
            } else {
              logger.error('Invalid FacultyId');
              return res.status(httpStatus.BAD_REQUEST).json({
                data: null,
                success: false,
                message: 'Invalid FacultyId',
              });
            }
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
    batchModel
      .findById(req.params.id)
      .populate('faculty')
      .then((batch) => {
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
    facultyModel.findById(req.body.faculty).then((faculty) => {
      if (faculty) {
        batchModel
          .findByIdAndUpdate(
            req.params.id,
            {
              year: req.body.year,
              faculty: req.body.faculty,
              currentSemester: req.body.currentSemester,
              desc: req.body.desc,
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

const getBatchByUserId = async (req, res) => {
  try {
    batchModel
      .findById(req.user.batch)
      .populate({
        path: 'faculty',
        populate: {
          path: 'semesters',
          model: 'subjects',
        },
      })
      .then(async (batch) => {
        if (batch) {
          let newBatch = batch;
          let newSemesters = [];

          await newBatch.faculty.semesters.map((semester, index) => {
            if (index + 1 <= batch.currentSemester) {
              newSemesters.push(semester);
            }
          });

          newBatch.faculty.semesters = newSemesters;

          logger.info('Fetch batchInfo');
          return res.status(httpStatus.OK).json({
            data: newBatch,
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

const getBatchesByPortal = async (req, res) => {
  try {
    let batches = [];

    portalModel
      .find({ teacher: req.user._id })
      .populate({
        path: 'batch',
        populate: { path: 'faculty' },
      })
      .then((portals) => {
        portals.map((portal) => {
          let isBatchExist = batches.find(
            (batch) => batch._id === portal.batch._id
          );

          if (!isBatchExist) {
            batches.push(portal.batch);
          }
        });

        return res.status(httpStatus.OK).json({
          data: batches,
          success: true,
          message: 'Fetch Batches',
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

module.exports = {
  createBatch,
  getBatches,
  getBatch,
  updateBatch,
  changeBatchStatus,
  getBatchByUserId,
  getBatchesByPortal,
};
