const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Protected Profile routes
router.post('/resume', protect, upload.single('resume'), profileController.uploadResume);
router.post('/preferences', protect, profileController.savePreferences);
router.patch('/complete', protect, profileController.completeOnboarding);
router.get('/me', protect, profileController.getProfile);

module.exports = router;
