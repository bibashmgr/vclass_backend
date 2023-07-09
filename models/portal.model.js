const mongoose = require('mongoose');

const portalSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subjects',
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'batches',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('portals', portalSchema);
