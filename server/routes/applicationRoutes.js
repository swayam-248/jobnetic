const express = require('express')
const {
  saveApplication,
  getApplications,
  updateApplication,
  deleteApplication,
  checkSaved
} = require('../controllers/applicationController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// GET /api/applications/check - Check if job is saved (Must be defined before /:id)
router.get('/check', protect, checkSaved)

// POST /api/applications - Save a job to tracker
router.post('/', protect, saveApplication)

// GET /api/applications - Get user's applications
router.get('/', protect, getApplications)

// PATCH /api/applications/:id - Update an application status/notes
router.patch('/:id', protect, updateApplication)

// DELETE /api/applications/:id - Remove an application
router.delete('/:id', protect, deleteApplication)

module.exports = router
