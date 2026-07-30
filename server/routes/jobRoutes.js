const express = require('express')
const { fetchAndStoreJobs, getStoredJobs } = require('../controllers/jobController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/fetch', protect, fetchAndStoreJobs)

router.get('/', protect, getStoredJobs)

module.exports = router
