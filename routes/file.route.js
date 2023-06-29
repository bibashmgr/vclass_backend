const express = require('express');

// controllers
const {
  createFile,
  downloadFile,
  deleteFile,
} = require('../controllers/file.controller.js');

// middlewares
const { userValidation } = require('../middlewares/validation.middleware.js');
const { upload } = require('../middlewares/upload.middleware.js');

const router = express.Router();

router.post('/create', userValidation, upload.array('files', 5), createFile);

router.get('/:fileName', userValidation, downloadFile);

router.delete('/:fileName/delete', userValidation, deleteFile);

module.exports = router;
