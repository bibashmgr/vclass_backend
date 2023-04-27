// models
const facultyModel = require('../models/faculty.model');
const batchModel = require('../models/batch.model');

const emailInfoExtractor = (email) => {
  let emailArray = email.split('@');

  return {
    college: emailArray[1].split('.')[0],
    batch: +emailArray[0].slice(2, 6),
    faculty: emailArray[0].slice(0, 2) + emailArray[0].slice(6, 8),
    role: 'student',
  };
};

const getEmailInfo = (email) => {
  let emailInfo = emailInfoExtractor(email);
  let validCollegeName = ['gces'];

  if (!validCollegeName.includes(emailInfo.college)) {
    emailInfo.college = '';
    emailInfo.batch = NaN;
    emailInfo.faculty = '';
    emailInfo.role = 'user';
  } else {
    if (!emailInfo.batch) {
      emailInfo.batch = NaN;
      emailInfo.faculty = '';
      emailInfo.role = 'user';
    }
  }

  // if (emailInfo.role === 'student') {
  //   facultyModel.findOne({ name: emailInfo.faculty }).then((faculty) => {
  //     if (faculty) {
  //       batchModel
  //         .findOne({ year: emailInfo.batch, faculty: faculty._id })
  //         .then((batch) => {
  //           if (batch) {
  //             emailInfo.batch = batch._id;
  //             emailInfo.batch = batch.faculty;
  //           } else {
  //             emailInfo.role = 'user';
  //           }
  //         });
  //     } else {
  //       emailInfo.role = 'user';
  //     }
  //   });
  // }

  return emailInfo;
};

module.exports = { getEmailInfo };
