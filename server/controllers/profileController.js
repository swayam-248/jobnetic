const supabase = require('../config/supabase.js');
const pdfParse = require('pdf-parse')
/**
 * @desc    Upload resume, parse PDF text, and upsert profile in Supabase
 * @route   POST /api/profile/resume
 * @access  Private
 */
exports.uploadResume = async (req, res) => {
  try {
    // 1. Verify file presence
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user._id.toString();
    const filePath = `${userId}/resume.pdf`;

    // 2. Upload file buffer to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, req.file.buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      return res.status(500).json({ message: uploadError.message });
    }

    // 3. Get public URL of the uploaded resume
    const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    // 4. Parse PDF content to text using pdf-parse
    const pdfData = await pdfParse(req.file.buffer);
    const parsedText = pdfData.text;

    // 5. Upsert profile information to Supabase
    const { error: dbError } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: userId,
          resume_url: publicUrl,
          parsed_resume_text: parsedText,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (dbError) {
      return res.status(500).json({ message: dbError.message });
    }

    // 6. Return response
    return res.status(200).json({
      message: 'Resume uploaded successfully',
      resume_url: publicUrl,
      parsed_text_length: parsedText.length,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Save job preferences
 * @route   POST /api/profile/preferences
 * @access  Private
 */
exports.savePreferences = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const { targetRole, location, jobType, minSalary } = req.body

    // Validate required fields
    if (!targetRole || !location || !jobType) {
      return res.status(400).json({ 
        message: 'Target role, location and job type are required' 
      })
    }

    // Upsert to preferences table
    const { data, error } = await supabase
      .from('preferences')
      .upsert({
        user_id: userId,
        target_role: targetRole,
        locations: [location],
        job_type: jobType,
        min_salary: minSalary ? parseInt(minSalary) : 0,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) {
      return res.status(500).json({ message: error.message })
    }

    res.json({ message: 'Preferences saved successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/**
 * @desc    Complete onboarding flow
 * @route   PATCH /api/profile/complete
 * @access  Private
 */
exports.completeOnboarding = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const userName = req.user.name 


    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        full_name: userName,
        onboarding_complete: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) {
      return res.status(500).json({ message: error.message })
    }

    res.json({ message: 'Onboarding complete' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/**
 * @desc    Get user profile from Supabase
 * @route   GET /api/profile/me
 * @access  Private
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const userEmail = req.user.email

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ message: error.message });
    }

    res.json({ profile: data || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
