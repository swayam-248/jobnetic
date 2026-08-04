const express = require('express')
const { fetchAndStoreJobs, getStoredJobs, getJobById } = require('../controllers/jobController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/:id', protect, getJobById)
router.post('/fetch', protect, fetchAndStoreJobs)
router.get('/', protect, getStoredJobs)

module.exports = router

