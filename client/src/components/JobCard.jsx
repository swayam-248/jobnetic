import React from 'react'

/**
 * JobCard Component
 * Displays job details including title, company, location, salary, skills, posted date, and apply link.
 */
export default function JobCard({ job }) {
  if (!job) return null

  // Format location
  const locationText = [job.job_city, job.job_country].filter(Boolean).join(', ')

  // Format salary range
  const formatSalary = () => {
    if (job.job_min_salary && job.job_max_salary) {
      return `₹${job.job_min_salary.toLocaleString()} - ₹${job.job_max_salary.toLocaleString()}`
    } else if (job.job_min_salary) {
      return `₹${job.job_min_salary.toLocaleString()}`
    } else if (job.job_max_salary) {
      return `₹${job.job_max_salary.toLocaleString()}`
    }
    return null
  }

  const salaryText = formatSalary()

  // Format posted date
  const postedDateText = job.job_posted_at
    ? `Posted ${new Date(job.job_posted_at).toLocaleDateString()}`
    : 'Recently posted'

  // Display top 5 skills
  const skillsToDisplay = Array.isArray(job.job_required_skills)
    ? job.job_required_skills.slice(0, 5)
    : []

  return (
    <div className="card hover:shadow-md transition-shadow border-l-4 border-brand-500 rounded-l-none">
      {/* Top Row */}
      <div className="flex justify-between items-start">
        {/* Left Column: Title, Company/Location, Badge */}
        <div>
          <h3 className="text-base font-medium text-gray-900">
            {job.job_title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {job.employer_name && (
              <span className="text-sm text-gray-500">
                {job.employer_name}
              </span>
            )}
            {job.employer_name && locationText && (
              <span className="text-gray-300">·</span>
            )}
            {locationText && (
              <span className="text-sm text-gray-500">{locationText}</span>
            )}
          </div>
          {job.job_employment_type && (
            <div className="mt-2">
              <span className="bg-brand-50 text-brand-700 text-xs px-2.5 py-1 rounded-full font-medium inline-block">
                {job.job_employment_type}
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Salary */}
        <div className="flex-shrink-0 ml-4 text-right">
          {salaryText ? (
            <span className="text-sm font-medium text-gray-900">
              {salaryText}
            </span>
          ) : (
            <span className="text-sm text-gray-400">Salary not listed</span>
          )}
        </div>
      </div>

      {/* Skills Row */}
      {skillsToDisplay.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {skillsToDisplay.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Row */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">{postedDateText}</span>
        <div className="flex items-center gap-2">
          <button className="btn-ghost text-sm py-1.5 px-3">
            View details
          </button>
          {job.job_apply_link && (
            <button
              onClick={() => window.open(job.job_apply_link, '_blank')}
              className="btn-primary text-sm py-1.5 px-3"
            >
              Apply ↗
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
