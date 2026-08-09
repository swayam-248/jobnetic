const supabase = require('../config/supabase.js')
const Job = require('../models/Job.js')
const { calculateMatchScore } = require('../utils/matchScore.js')

/**
 * @desc    Get match score for a single job
 * @route   GET /api/match/job/:jobId
 * @access  Private
 */
exports.getMatchScore = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const { jobId } = req.params

    // 1. Get user's parsed resume from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('parsed_resume_text')
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

    // 3. Calculate match score
    const result = calculateMatchScore(
      profile.parsed_resume_text, 
      job
    )

    res.json({
      jobId,
      ...result
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/**
 * @desc    Get match scores for multiple jobs at once (bulk)
 * @route   POST /api/match/bulk
 * @access  Private
 */
exports.getMatchScoresBulk = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const { jobIds } = req.body

    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({ 
        message: 'jobIds array is required' 
      })
    }

    // 1. Get user's parsed resume from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('parsed_resume_text')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile?.parsed_resume_text) {
      return res.status(200).json({ 
        scores: {},
        message: 'No resume found — upload resume to see match scores'
      })
    }

    // 2. Get all jobs from MongoDB
    const jobs = await Job.find({ 
      _id: { $in: jobIds } 
    }).lean()

    // 3. Calculate score for each job
    const scores = {}
    jobs.forEach(job => {
      const result = calculateMatchScore(
        profile.parsed_resume_text,
        job
      )
      scores[job._id.toString()] = result
    })

    res.json({ scores })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
