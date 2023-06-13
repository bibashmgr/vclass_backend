const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    desc: {
      type: String,
      required: true,
    },
    portal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'portals',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('messages', messageSchema);
