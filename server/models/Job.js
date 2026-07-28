const mongoose = require('mongoose')

/**
 * @desc Mongoose schema for storing job listings fetched from JSearch API
 */
const jobSchema = new mongoose.Schema(
  {
    job_id: { type: String, unique: true, required: true },
    job_title: { type: String, required: true },
    employer_name: { type: String },
    employer_logo: { type: String },
    job_city: { type: String },
    job_country: { type: String },
    job_employment_type: { type: String },
    job_description: { type: String },
    job_min_salary: { type: Number },
    job_max_salary: { type: Number },
    job_salary_currency: { type: String },
    job_posted_at: { type: Date },
    job_apply_link: { type: String },
    job_required_skills: [{ type: String }],
    job_highlights: { type: mongoose.Schema.Types.Mixed },
    fetched_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Job', jobSchema)
