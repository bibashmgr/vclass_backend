const express = require('express');

// controllers
const {
  createFaculty,
  getFaculties,
  getFaculty,
  updateFaculty,
  deleteFaculty,
} = require('../controllers/faculty.controller.js');

const router = express.Router();

router.post('/create', createFaculty);
router.get('/', getFaculties);
router.get('/:id', getFaculty);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);

module.exports = router;
