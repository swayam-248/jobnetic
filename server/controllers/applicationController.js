const supabase = require('../config/supabase.js')

/**
 * @desc    Save a job to the tracker
 * @route   POST /api/applications
 * @access  Private
 */
exports.saveApplication = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const { 
      job_title, 
      company, 
      location, 
      salary,
      job_url,
      job_id,
      notes 
    } = req.body

    if (!job_title || !company) {
      return res.status(400).json({ 
        message: 'Job title and company are required' 
      })
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', userId)
      .eq('job_url', job_url)
      .single()

    if (existing) {
      return res.status(409).json({ 
        message: 'Job already saved to tracker' 
      })
    }

    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: userId,
        job_title,
        company,
        location: location || '',
        salary: salary || '',
        job_url: job_url || '',
        job_id: job_id || '',
        status: 'saved',
        notes: notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: error.message })
    }

    res.status(201).json({ 
      message: 'Job saved to tracker',
      application: data 
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/**
 * @desc    Get all applications for the user
 * @route   GET /api/applications
 * @access  Private
 */
exports.getApplications = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const { status } = req.query

    let query = supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      return res.status(500).json({ message: error.message })
    }

    res.json({ applications: data || [] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/**
 * @desc    Update application status, notes, or applied date
 * @route   PATCH /api/applications/:id
 * @access  Private
 */
exports.updateApplication = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const { id } = req.params
    const { status, notes, applied_at } = req.body

    const validStatuses = [
      'saved', 'applied', 'interview', 'offer', 'rejected'
    ]

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status' 
      })
    }

    const updateData = {
      updated_at: new Date().toISOString()
    }

    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (applied_at) updateData.applied_at = applied_at

    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: error.message })
    }

    if (!data) {
      return res.status(404).json({ 
        message: 'Application not found' 
      })
    }

    res.json({ 
      message: 'Application updated',
      application: data 
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/**
 * @desc    Remove an application from the tracker
 * @route   DELETE /api/applications/:id
 * @access  Private
 */
exports.deleteApplication = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const { id } = req.params

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      return res.status(500).json({ message: error.message })
    }

    res.json({ message: 'Application removed from tracker' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/**
 * @desc    Check if a specific job is already saved to tracker
 * @route   GET /api/applications/check
 * @access  Private
 */
exports.checkSaved = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const { jobUrl } = req.query

    if (!jobUrl) {
      return res.json({ saved: false })
    }

    const { data } = await supabase
      .from('applications')
      .select('id, status')
      .eq('user_id', userId)
      .eq('job_url', jobUrl)
      .single()

    res.json({ 
      saved: !!data,
      application: data || null
    })
  } catch (err) {
    res.json({ saved: false })
  }
}
