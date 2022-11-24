const express = require('express');
const { getNotes, createNote, getNoteById, updateNotes, deleteNote } = require('../controllers/noteController');
const protect = require('../middleware/authMiddleware');

const router = express.Router()

router.get('/', protect, getNotes);
router.post('/create', protect, createNote);
router.get('/:id', protect, getNoteById)
router.put('/:id', protect, updateNotes)
router.delete('/:id', protect, deleteNote);



module.exports = router