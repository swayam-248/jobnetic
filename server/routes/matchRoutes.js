const express = require('express')
const { getMatchScore, getMatchScoresBulk } = require('../controllers/matchController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// GET /api/match/job/:jobId - Get score for a single job
router.get('/job/:jobId', protect, getMatchScore)

// POST /api/match/bulk - Get score for multiple jobs in bulk
router.post('/bulk', protect, getMatchScoresBulk)

module.exports = router
