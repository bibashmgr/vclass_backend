const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'faculties',
      required: true,
    },
    currentSemester: {
      type: Number,
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('batches', batchSchema);
