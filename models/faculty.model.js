const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    semesters: {
      type: [
        {
          type: [
            {
              type: String,
            },
          ],
        },
      ],
      default: [],
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

module.exports = mongoose.model('faculties', facultySchema);
