const express = require('express')
const router = express.Router()

const {startSession, submitSession} = require('../controllers/sessionController')

router.post("/start", startSession);
router.post('/submit', submitSession)

module.exports = router