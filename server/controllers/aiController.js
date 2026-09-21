const axios = require('axios')
const supabase = require('../config/supabase')
const Job = require('../models/Job')

/**
 * @desc Generate cover letter using n8n AI webhook
 * @route POST /api/ai/cover-letter
 * @access Private
 */
exports.generateCoverLetter = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const { jobId } = req.body

    if (!jobId) {
      return res.status(400).json({ 
        message: 'jobId is required' 
      })
    }

    // 1. Get user resume from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('parsed_resume_text, full_name')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile?.parsed_resume_text) {
      return res.status(404).json({ 
        message: 'Resume not found. Please upload your resume first.' 
      })
    }

    // 2. Get job from MongoDB
    const job = await Job.findById(jobId).lean()
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // 3. Call n8n webhook
    const webhookUrl = process.env.N8N_COVER_LETTER_WEBHOOK
    const response = await axios.post(webhookUrl, {
      jobTitle: job.job_title,
      company: job.employer_name,
      jobDescription: job.job_description?.substring(0, 500),
      resumeText: profile.parsed_resume_text?.substring(0, 1000)
    }, {
      timeout: 30000 // 30 second timeout
    })

    const coverLetter = response.data?.coverLetter

    if (!coverLetter) {
      return res.status(500).json({ 
        message: 'Failed to generate cover letter' 
      })
    }

    res.json({ coverLetter })
  } catch (err) {
    console.error('Cover letter error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

/**
 * @desc Tailor resume for a job
 * @route POST /api/ai/tailor
 * @access Private
 */
exports.tailorResume = async (req, res) => {
  res.json({ message: 'Coming soon' })
}

/**
 * @desc Analyze skill gaps for a job
 * @route POST /api/ai/gaps
 * @access Private
 */
exports.analyzeGaps = async (req, res) => {
  res.json({ message: 'Coming soon' })
}
