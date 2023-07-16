const httpStatus = require('http-status');

// utils
const logger = require('../utils/logger.js');

// models
const userModel = require('../models/user.model.js');
const attendanceModel = require('../models/attendance.model.js');
const portalModel = require('../models/portal.model.js');

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

const markAllPresent = async (req, res) => {
  try {
    const students = await userModel.find({ batch: req.params.batchId });
    if (req.portal.activeDates.length === 0) {
      let attendanceSchemas = [];
      for (let i = 0; i < students.length; i++) {
        attendanceSchemas.push({
          portal: req.portal._id,
          user: students[i]._id,
          activeDates: [req.body.date],
        });
      }

      await attendanceModel.create(attendanceSchemas);
      await portalModel.findByIdAndUpdate(req.portal._id, {
        $push: {
          activeDates: req.body.date,
        },
      });

      logger.info('Mark All Present');
      return res.status(httpStatus.OK).json({
        data: null,
        success: true,
        message: 'Mark All Present',
      });
    } else {
      let dateY = new Date(req.body.date).getTime();
      let isTaken = req.portal.activeDates.find((activeDate) => {
        let dateX = new Date(activeDate).getTime();

        if (dateX === dateY) {
          return activeDate;
        }
      });

      if (isTaken) {
        logger.info('Attendance already taken');
        return res.status(httpStatus.OK).json({
          data: null,
          success: true,
          message: 'Attendance already taken',
        });
      } else {
        await attendanceModel.updateMany(
          { portal: req.portal._id },
          {
            $push: {
              activeDates: req.body.date,
            },
          }
        );
        await portalModel.findByIdAndUpdate(req.portal._id, {
          $push: {
            activeDates: req.body.date,
          },
        });

        logger.info('Mark All Present');
        return res.status(httpStatus.OK).json({
          data: null,
          success: true,
          message: 'Mark All Present',
        });
      }
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

const markAllAbsent = async (req, res) => {
  try {
    let dateY = new Date(req.body.date).getTime();
    let isTaken = req.portal.activeDates.find((activeDate) => {
      let dateX = new Date(activeDate).getTime();

      if (dateX === dateY) {
        return activeDate;
      }
    });

    if (isTaken) {
      logger.info('Attendance already taken');
      return res.status(httpStatus.OK).json({
        data: null,
        success: true,
        message: 'Attendance already taken',
      });
    } else {
      await portalModel.findByIdAndUpdate(req.portal._id, {
        $push: {
          activeDates: req.body.date,
        },
      });

      logger.info('Mark All Absent');
      return res.status(httpStatus.OK).json({
        data: null,
        success: true,
        message: 'Mark All Absent',
      });
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
