const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  length: {
    type: Number,
  },
  chunkSize: {
    type: Number,
  },
  uploadDate: {
    type: Date,
  },
  filename: {
    type: String,
  },
  contentType: {
    type: String,
  },
});

module.exports = mongoose.model('uploads.files', fileSchema);
