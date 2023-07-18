const httpStatus = require('http-status');

// utils
const logger = require('../utils/logger.js');

// models
const userModel = require('../models/user.model.js');
const portalModel = require('../models/portal.model.js');
const attendanceModel = require('../models/attendance.model.js');

const markStudents = async (req, res) => {
  try {
    if (req.portal.activeDates.length === 0) {
      let attendanceSchemas = [];
      for (let i = 0; i < req.body.students.length; i++) {
        attendanceSchemas.push({
          portal: req.portal._id,
          user: req.body.students[i],
          activeDates: [req.body.date],
        });
      }

      await attendanceModel.create(attendanceSchemas);
      await portalModel.findByIdAndUpdate(req.portal._id, {
        $push: {
          activeDates: req.body.date,
        },
      });

      logger.info('Attendance Done');
      return res.status(httpStatus.OK).json({
        data: null,
        success: true,
        message: 'Attendance Done',
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
          success: false,
          message: 'Attendance already taken',
        });
      } else {
        await attendanceModel.updateMany(
          { portal: req.portal._id, user: { $in: req.body.students } },
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

        logger.info('Attendance Done');
        return res.status(httpStatus.OK).json({
          data: null,
          success: true,
          message: 'Attendance Done',
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

const getAttendanceByDate = async (req, res) => {
  try {
    const students = await userModel.find({ batch: req.params.batchId });
    let results = {
      totalPresents: 0,
      totalAbsents: 0,
      students: [],
    };

    let dateY = new Date(req.query.date).getTime();
    let isTaken = req.portal.activeDates.find((activeDate) => {
      let dateX = new Date(activeDate).getTime();

      if (dateX === dateY) {
        return activeDate;
      }
    });

    if (isTaken) {
      const attendances = await attendanceModel.find({
        portal: req.portal._id,
        activeDates: { $in: [new Date(req.query.date)] },
      });

      students.map((student) => {
        let isPresent = attendances.find(
          (attendance) => attendance.user.toString() === student._id.toString()
        );
        if (isPresent) {
          results.totalPresents += 1;
        } else {
          results.totalAbsents += 1;
        }
        results.students.push({
          _id: student._id,
          name: student.name,
          email: student.email,
          status: isPresent ? 'present' : 'absent',
        });
      });

      logger.info('Fetch attendances');
      return res.status(httpStatus.OK).json({
        data: results,
        success: true,
        message: 'Fetch attendances',
      });
    } else {
      logger.info('Attendance not taken');
      return res.status(httpStatus.OK).json({
        data: null,
        success: false,
        message: 'Attendance not taken',
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

const getAttendanceByUser = async (req, res) => {
  try {
    const attendances = await attendanceModel
      .findOne({
        portal: req.portal._id,
        user: req.params.userId,
      })
      .populate(['portal', 'user']);
    logger.info('Fetch attendances');
    return res.status(httpStatus.OK).json({
      data: attendances,
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
  markStudents,
  getAttendanceByDate,
  getAttendanceByUser,
};
