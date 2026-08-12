const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Protected Profile routes
router.get('/debug', protect, async (req, res) => {
  const supabase = require('../config/supabase.js')
  const userId = req.user._id.toString()
  
  console.log('Debug - userId being queried:', userId)
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  res.json({
    mongoUserId: userId,
    supabaseProfile: data,
    supabaseError: error,
    onboarding_complete: data?.onboarding_complete
  })
})

router.post('/resume', protect, upload.single('resume'), profileController.uploadResume);
router.post('/preferences', protect, profileController.savePreferences);
router.patch('/complete', protect, profileController.completeOnboarding);
router.get('/me', protect, profileController.getProfile);

module.exports = router;
