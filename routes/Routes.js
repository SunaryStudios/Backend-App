const express = require('express')
const userController = require('../controllers/userControllers')
const noteController = require('../controllers/noteControllers')
const calendarController = require('../controllers/calendarControllers')

const router = express.Router();

router.get('/users', userController.createUser)
router.get('/getNotes', noteController.noteRequest)
router.get('/getProblems', calendarController.dayRequest)

router.post('/getUser', userController.getUser)
router.post('/createNote', noteController.createNote)
router.post('/problemDay', calendarController.dayProblemCreate)

module.exports = router;