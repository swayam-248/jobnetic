const express = require('express')
const { fetchAndStoreJobs, getStoredJobs } = require('../controllers/jobController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// POST /api/jobs/fetch - Fetch jobs from JSearch and store in MongoDB
router.post('/fetch', protect, fetchAndStoreJobs)

// GET /api/jobs - Get stored jobs with filters and pagination
router.get('/', protect, getStoredJobs)

module.exports = router
