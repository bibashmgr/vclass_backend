const httpStatus = require('http-status');

// utils
const logger = require('../utils/logger.js');

// helpers
const GfsBucket = require('../helpers/gridfsManager.js');

const createFile = async (req, res) => {
  logger.info('File Uploaded Successfully');
  res.status(httpStatus.CREATED).json({
    data: req.files,
    success: true,
    message: 'File Uploaded Successfully',
  });
};

const downloadFile = async (req, res) => {
  let gfsBucket = new GfsBucket();

  await gfsBucket
    .find({ filename: req.params.fileName })
    .toArray()
    .then((files, error) => {
      if (error) {
        logger.error(error.message);
        return res.status(400).json({
          data: null,
          success: false,
          message: error.message,
        });
      }

      if ((!files, files.length === 0)) {
        logger.warn('Failed to fetch fileInfo');
        return res.status(404).json({
          data: null,
          success: false,
          message: 'Failed to fetch fileInfo',
        });
      }

      logger.info('Open Download Stream');
      const readStream = gfsBucket.openDownloadStream(files[0]._id);
      readStream.pipe(res);
    });
};

const deleteFile = async (req, res) => {
  let gfsBucket = new GfsBucket();

  await gfsBucket
    .find({ filename: req.params.fileName })
    .toArray()
    .then((files, error) => {
      if (error) {
        logger.error(error.message);
        return res.status(400).json({
          data: null,
          success: false,
          message: error.message,
        });
      }

      if (!files || files.length === 0) {
        logger.warn('Failed to delete file');
        return res.status(404).json({
          data: null,
          success: false,
          message: 'Failed to delete file',
        });
      }

      gfsBucket.delete(files[0]._id);
      logger.info('Delete file');
      return res.status(200).json({
        data: null,
        success: true,
        message: 'Delete file',
      });
    });
};

module.exports = { createFile, deleteFile, downloadFile };
