const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'student', 'teacher', 'admin'],
      default: 'user',
    },
    college: {
      type: String,
      default: '',
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'batches',
      default: null,
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

module.exports = mongoose.model('users', userSchema);
