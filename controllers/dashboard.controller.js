const httpStatus = require('http-status');

// models
const subjectModel = require('../models/subject.model.js');
const batchModel = require('../models/batch.model.js');
const facultyModel = require('../models/faculty.model.js');
const userModel = require('../models/user.model.js');

// utils
const logger = require('../utils/logger.js');

const getDashboard = async (req, res) => {
  try {
    let subjects = await subjectModel.find();
    let batches = await batchModel.find();
    let faculties = await facultyModel.find();
    let users = await userModel.find();

    let toSendData = {
      subjects: subjects.length,
      batches: batches.length,
      faculties: faculties.length,
      users: users.length,
    };

    logger.info('Fetch DashboardInfo');
    return res.status(httpStatus.OK).json({
      data: toSendData,
      success: true,
      message: 'Fetch DashboardInfo',
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
  getDashboard,
};
