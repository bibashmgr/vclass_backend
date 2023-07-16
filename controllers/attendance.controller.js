const httpStatus = require('http-status');

// utils
const logger = require('../utils/logger.js');

// models
const attendanceModel = require('../models/attendance.model.js');

// @routes: /attendances/
// @method: post
// @body: [batchId, subjectId, date, students]
const markStudents = async (req, res) => {
  try {
  } catch (error) {
    logger.error(error.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

// @routes: /attendances/present
// @method: post
// @body: [batchId, subjectId, date]
const markAllPresent = async (req, res) => {
  try {
    if (req.portal.activeDates.length === 0) {
    } else {
    }
  } catch (error) {
    logger.error(error.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

// @routes: /attendances/absent
// @method: post
// @body: [batchId, subjectId, date]
const markAllAbsent = async (req, res) => {
  try {
  } catch (error) {
    logger.error(error.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

// @routes: /attendances/:batchId/:subjectId/?date=
// @method: get
const getAttendanceByDate = async (req, res) => {
  try {
    return res.status(httpStatus.OK).json({
      data: null,
      success: true,
      message: 'Fetch attendances',
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

// @routes: /attendances/:batchId/:subjectId/:userId
// @method: get
const getAttendanceByUser = async (req, res) => {
  try {
    return res.status(httpStatus.OK).json({
      data: null,
      success: true,
      message: 'Fetch attendances',
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
  markAllPresent,
  markAllAbsent,
  markStudents,
  getAttendanceByDate,
  getAttendanceByUser,
};
