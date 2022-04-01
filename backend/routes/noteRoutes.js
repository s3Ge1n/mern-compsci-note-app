const express = require('express')
const router = express.Router()
const { 
    getNotes, 
    setNote, 
    updateNote, 
    deleteNote,
} = require('../controllers/noteController')

router.route('/').get(getNotes).post(setNote)
router.route('/:id').put(updateNote).delete(deleteNote)

module.exports = router