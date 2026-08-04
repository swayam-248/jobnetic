const jsearchClient = require('../config/jsearch.js')
const Job = require('../models/Job.js')
const supabase = require('../config/supabase.js')

/**
 * @desc    Fetch jobs from JSearch API based on user preferences in Supabase and store/upsert in MongoDB
 * @route   POST /api/jobs/fetch
 * @access  Private
 */
exports.fetchAndStoreJobs = async (req, res) => {
  try {
    const userId = req.user._id.toString()

    // 1. Get user preferences from Supabase
    const { data: prefs, error: prefsError } = await supabase
      .from('preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (prefsError || !prefs) {
      return res.status(404).json({
        message: 'Preferences not found. Complete onboarding first.',
      })
    }

    // 2. Build search query from preferences
    const query = prefs.target_role || 'Software Developer'
    const location = prefs.locations?.[0] || 'India'
    const searchQuery = `${query} in ${location}`

    // 3. Fetch from JSearch API
    const response = await jsearchClient.get('/search-v2', {
      params: {
        query: searchQuery,
        page: '1',
        num_pages: '1',
        date_posted: 'all',
        country: 'in',
        language: 'en',
        remote_jobs_only: prefs.job_type === 'remote' ? 'true' : 'false',
      },
    })

    const responseData = response.data?.data
    const jobs = Array.isArray(responseData)
      ? responseData
      : responseData?.jobs || []

    if (jobs.length === 0) {
      return res.json({ message: 'No jobs found', count: 0, jobs: [] })
    }

    // 4. Store jobs in MongoDB (upsert to avoid duplicates)
    const upsertOps = jobs.map((job) => ({
      updateOne: {
        filter: { job_id: job.job_id },
        update: {
          $set: {
            job_id: job.job_id,
            job_title: job.job_title,
            employer_name: job.employer_name,
            employer_logo: job.employer_logo,
            job_city: job.job_city,
            job_country: job.job_country,
            job_employment_type: job.job_employment_type,
            job_description: job.job_description,
            job_min_salary: job.job_min_salary,
            job_max_salary: job.job_max_salary,
            job_salary_currency: job.job_salary_currency,
            job_posted_at: job.job_posted_at_datetime_utc,
            job_apply_link: job.job_apply_link,
            job_required_skills: job.job_required_skills || [],
            job_highlights: job.job_highlights || {},
            fetched_at: new Date(),
          },
        },
        upsert: true,
      },
    }))

    await Job.bulkWrite(upsertOps)

    // 5. Return jobs
    res.json({
      message: 'Jobs fetched and stored successfully',
      count: jobs.length,
      jobs: jobs.map((job) => ({
        job_id: job.job_id,
        job_title: job.job_title,
        employer_name: job.employer_name,
        employer_logo: job.employer_logo,
        job_city: job.job_city,
        job_country: job.job_country,
        job_employment_type: job.job_employment_type,
        job_min_salary: job.job_min_salary,
        job_max_salary: job.job_max_salary,
        job_posted_at: job.job_posted_at_datetime_utc,
        job_apply_link: job.job_apply_link,
        job_required_skills: job.job_required_skills || [],
      })),
    })
  } catch (err) {
    console.error('Job fetch error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

/**
 * @desc    Get stored jobs from MongoDB with search, filter, and pagination
 * @route   GET /api/jobs
 * @access  Private
 */
exports.getStoredJobs = async (req, res) => {
  try {
    const { role, location, type, page = 1, limit = 10 } = req.query

    // Build filter
    const filter = {}
    // Search across title, employer name, description, and required skills
    if (role) {
      filter.$or = [
        { job_title: { $regex: role, $options: 'i' } },
        { employer_name: { $regex: role, $options: 'i' } },
        { job_description: { $regex: role, $options: 'i' } },
        { job_required_skills: { $regex: role, $options: 'i' } },
      ]
    }
    if (location) filter.job_city = { $regex: location, $options: 'i' }
    if (type) filter.job_employment_type = { $regex: type, $options: 'i' }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const jobs = await Job.find(filter)
      .sort({ fetched_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()

    const total = await Job.countDocuments(filter)

    res.json({
      jobs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/**
 * @desc    Get single job by ID
 * @route   GET /api/jobs/:id
 * @access  Private
 */
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean()
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    res.json({ job })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

