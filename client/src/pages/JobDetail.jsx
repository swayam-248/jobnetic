import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getJobById } from '../services/api'

export default function JobDetail() {
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true)
        const { data } = await getJobById(id)
        setJob(data.job)
      } catch (err) {
        setError('Job not found')
      } finally {
        setLoading(false)
      }
    }
    loadJob()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card text-center p-12 max-w-md w-full mx-4">
          <div className="text-3xl mb-3">⚠️</div>
          <p className="text-sm text-gray-500 mt-2">{error || 'Job not found'}</p>
          <button onClick={() => navigate(-1)} className="btn-ghost mt-4">
            Go back
          </button>
        </div>
      </div>
    )
  }

  // Helper variables for formatting
  const locationText = [job.job_city, job.job_country].filter(Boolean).join(', ')
  const salaryText = job.job_min_salary && job.job_max_salary
    ? `💰 ₹${job.job_min_salary.toLocaleString()} - ₹${job.job_max_salary.toLocaleString()}`
    : job.job_min_salary
    ? `💰 ₹${job.job_min_salary.toLocaleString()}`
    : job.job_max_salary
    ? `💰 ₹${job.job_max_salary.toLocaleString()}`
    : null

  const postedDateText = job.job_posted_at
    ? `Posted ${new Date(job.job_posted_at).toLocaleDateString()}`
    : 'Recently posted'

  const hasHighlights = job.job_highlights && Object.keys(job.job_highlights).length > 0

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="btn-ghost text-sm">
            ← Back to jobs
          </button>
          <div className="flex items-center text-sm truncate">
            <span className="text-gray-400">Jobs</span>
            <span className="text-gray-300 mx-1.5">/</span>
            <span className="text-gray-600 truncate">{job.job_title}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 w-full flex-1">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1 — Job Header */}
          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-medium text-gray-900">{job.job_title}</h1>
                <p className="text-base text-gray-600 mt-1">{job.employer_name}</p>
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  {locationText && (
                    <span className="text-sm text-gray-500">📍 {locationText}</span>
                  )}
                  {job.job_employment_type && (
                    <span className="text-sm text-gray-500">💼 {job.job_employment_type}</span>
                  )}
                  {salaryText ? (
                    <span className="text-sm text-gray-500">{salaryText}</span>
                  ) : (
                    <span className="text-sm text-gray-400">💰 Salary not disclosed</span>
                  )}
                </div>
              </div>
              {job.employer_logo && (
                <img
                  src={job.employer_logo}
                  alt={job.employer_name || 'Employer logo'}
                  className="w-14 h-14 rounded-lg object-contain border border-gray-100 p-1"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
            </div>
            <div className="text-xs text-gray-400 mt-4">
              {postedDateText}
            </div>
          </div>

          {/* Card 2 — Required Skills */}
          {Array.isArray(job.job_required_skills) && job.job_required_skills.length > 0 && (
            <div className="card">
              <h2 className="text-sm font-medium text-gray-900 mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.job_required_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Card 3 — Job Description */}
          {job.job_description && (
            <div className="card">
              <h2 className="text-sm font-medium text-gray-900 mb-4">About this role</h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto pr-2">
                {job.job_description}
              </div>
            </div>
          )}

          {/* Card 4 — Job Highlights */}
          {hasHighlights && (
            <div className="card">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Job Highlights</h2>
              <div className="space-y-4">
                {Object.entries(job.job_highlights).map(([key, items]) => (
                  <div key={key}>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      {key}
                    </h3>
                    {Array.isArray(items) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {items.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600 leading-relaxed">{items}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="sticky top-6 space-y-4">
            {/* Card 1 — AI Actions (coming soon) */}
            <div className="card">
              <h2 className="text-sm font-medium text-gray-900 mb-3">AI Actions</h2>
              <p className="text-xs text-brand-600 mb-4">✨ Powered by Gemini Flash</p>
              <div className="space-y-2 w-full">
                <button
                  onClick={() => alert('Coming soon — AI pipeline in Day 20')}
                  className="btn-primary w-full text-sm py-2.5"
                >
                  📝 Generate cover letter
                </button>
                <button
                  onClick={() => alert('Coming soon — AI pipeline in Day 21')}
                  className="btn-ghost w-full text-sm py-2.5"
                >
                  🔄 Tailor my resume
                </button>
                <button
                  onClick={() => alert('Coming soon — AI pipeline in Day 21')}
                  className="btn-ghost w-full text-sm py-2.5"
                >
                  🎯 Analyze skill gaps
                </button>
              </div>
            </div>

            {/* Card 2 — Apply */}
            <div className="card">
              <h2 className="text-sm font-medium text-gray-900 mb-1">Ready to apply?</h2>
              <p className="text-xs text-gray-400 mb-4">
                Make sure your resume is tailored before applying.
              </p>
              <a
                href={job.job_apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-sm py-3 text-center block"
              >
                Apply now ↗
              </a>
              <p className="text-xs text-gray-400 text-center mt-2">
                Opens on the company's website
              </p>
            </div>

            {/* Card 3 — Save job (placeholder) */}
            <div className="card">
              <h2 className="text-sm font-medium text-gray-900 mb-1">Save this job</h2>
              <p className="text-xs text-gray-400 mb-4">Track your application progress</p>
              <button
                onClick={() => alert('Coming soon — tracker in Day 17')}
                className="btn-ghost w-full text-sm py-2.5"
              >
                🔖 Save to tracker
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
