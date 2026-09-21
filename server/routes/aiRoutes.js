const express = require('express')
const {
  generateCoverLetter,
  tailorResume,
  analyzeGaps,
} = require('../controllers/aiController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// POST /api/ai/cover-letter - Generate cover letter using n8n AI workflow
router.post('/cover-letter', protect, generateCoverLetter)

// POST /api/ai/tailor - Tailor resume for job
router.post('/tailor', protect, tailorResume)

// POST /api/ai/gaps - Analyze skill gaps for job
router.post('/gaps', protect, analyzeGaps)

module.exports = router
