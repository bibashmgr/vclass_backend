const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    facultyId: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('batches', batchSchema);
