import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * JobCard Component
 * Displays job details including title, company, location, salary, skills, posted date, and apply link.
 */
export default function JobCard({ job, matchScore, scoresLoading }) {
  const navigate = useNavigate()

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

  // Match score styles helpers
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-amber-500'
    return 'text-gray-400'
  }

  const getScoreBg = (score) => {
    if (score >= 70) return 'bg-green-50 border-green-100'
    if (score >= 40) return 'bg-amber-50 border-amber-100'
    return 'bg-gray-50 border-gray-100'
  }

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

        {/* Right Column: Score Badge & Salary */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
          {scoresLoading ? (
            // Loading skeleton for score
            <div className="w-14 h-10 bg-gray-100 rounded-lg animate-pulse flex-shrink-0" />
          ) : matchScore ? (
            <div className={`flex-shrink-0 text-right border rounded-lg px-3 py-1.5 ${getScoreBg(matchScore.score)}`}>
              <p className={`text-lg font-medium leading-none ${getScoreColor(matchScore.score)}`}>
                {matchScore.score}%
              </p>
              <p className="text-xs text-gray-400 mt-0.5">match</p>
            </div>
          ) : null}

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
      {matchScore && (matchScore.matchedSkills?.length > 0 || matchScore.missingSkills?.length > 0) && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {matchScore.matchedSkills?.slice(0, 4).map(skill => (
            <span key={skill} 
              className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
              ✓ {skill}
            </span>
          ))}
          {matchScore.missingSkills?.slice(0, 2).map(skill => (
            <span key={skill}
              className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
              ⚠ {skill}
            </span>
          ))}
        </div>
      )}

      {/* Fallback to required skills if no match score yet */}
      {!matchScore && job.job_required_skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.job_required_skills.slice(0, 5).map(skill => (
            <span key={skill}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Row */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">{postedDateText}</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/jobs/${job._id}`)} 
            className="btn-ghost text-sm py-1.5 px-3"
          >
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
