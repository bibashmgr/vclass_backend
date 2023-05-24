const facultyModel = require('../models/faculty.model.js');
const batchModel = require('../models/batch.model.js');

const destructureEmail = (email) => {
  let emailArray = email.split('@');

  return {
    college: emailArray[1].split('.')[0],
    batch: +emailArray[0].slice(2, 6),
    faculty: emailArray[0].slice(0, 2) + emailArray[0].slice(6, 8),
    role: '',
  };
};

const getBatchId = async (facultyName, batchYear) => {
  const faculty = await facultyModel.findOne({ name: facultyName });

  if (!faculty) {
    logger.error('Failed to get Fetch');
    return '';
  }

  const batch = await batchModel.findOne({
    faculty: faculty._id,
    year: batchYear,
  });

  if (!batch) {
    logger.error('Failed to get Batch');
    return '';
  }

  return batch._id.toString();
};

const getEmailInfo = async (email) => {
  let emailInfo = destructureEmail(email);

  let validCollegeName = ['gces'];

  if (!validCollegeName.includes(emailInfo.college)) {
    emailInfo.college = '';
    emailInfo.batch = '';
    emailInfo.role = 'user';
  } else if (!emailInfo.batch) {
    emailInfo.batch = '';
    emailInfo.role = 'user';
  } else {
    const batchId = await getBatchId(emailInfo.faculty, emailInfo.batch);

    if (batchId) {
      emailInfo.batch = batchId;
      emailInfo.role = 'student';
    } else {
      emailInfo.batch = '';
      emailInfo.role = 'user';
    }
  }

  let { faculty, ...others } = emailInfo;

  return others;
};

module.exports = { getEmailInfo };
