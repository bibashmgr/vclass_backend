const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

// utils
const config = require('../config/config.js');

const storage = new GridFsStorage({
  url: config.mongodbUrl,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        const filename = buf.toString('hex') + '_' + file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

const fileFilter = (req, file, cb) => {
  const acceptableExtensions = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'application/pdf',
  ];
  const maxFileSize = 16 * 1024 * 1024;

  if (req.body.desc === '') {
    return cb(new Error('Desc is empty'));
  }

  if (!acceptableExtensions.includes(file.mimetype)) {
    return cb(new Error('Invalid Format!'));
  }

  const fileSize = parseInt(req.headers['content-length']);
  if (fileSize > maxFileSize) {
    return cb(new Error('File size is large!'));
  }

  return cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = { upload };
