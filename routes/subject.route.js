const express = require('express');

// controllers
const {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subject.controller.js');

const router = express.Router();

router.post('/create', createSubject);
router.get('/', getSubjects);
router.get('/:id', getSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

module.exports = router;
