const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
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
    category: {
      type: String,
      enum: ['material', 'assignment', 'submission'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      default: '',
    },
    files: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'uploads.files',
        },
      ],
      default: [],
    },
    submittedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
      ],
      default: [],
    },
    assignmentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('posts', postSchema);
