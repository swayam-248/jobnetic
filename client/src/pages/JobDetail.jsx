import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  getJobById,
  getMatchScore,
  saveApplication,
  checkSaved,
  generateCoverLetter,
  tailorResume,
  analyzeGaps,
} from '../services/api'

export default function JobDetail() {
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  // Match score state
  const [matchScore, setMatchScore] = useState(null)
  const [scoreLoading, setScoreLoading] = useState(false)

  // Save to tracker state
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  // Cover letter state
  const [coverLetter, setCoverLetter] = useState('')
  const [coverLetterLoading, setCoverLetterLoading] = useState(false)
  const [coverLetterError, setCoverLetterError] = useState('')
  const [copied, setCopied] = useState(false)

  // Resume tailor state
  const [suggestions, setSuggestions] = useState('')
  const [tailorLoading, setTailorLoading] = useState(false)
  const [tailorError, setTailorError] = useState('')
  const [copiedSuggestions, setCopiedSuggestions] = useState(false)

  // Gap analysis state
  const [analysis, setAnalysis] = useState('')
  const [gapsLoading, setGapsLoading] = useState(false)
  const [gapsError, setGapsError] = useState('')
  const [copiedAnalysis, setCopiedAnalysis] = useState(false)

  const handleGenerateCoverLetter = async () => {
    try {
      setCoverLetterLoading(true)
      setCoverLetterError('')
      setCoverLetter('')
      const { data } = await generateCoverLetter(job._id)
      setCoverLetter(data.coverLetter)
    } catch (err) {
      setCoverLetterError(
        err.response?.data?.message || 'Failed to generate cover letter'
      )
    } finally {
      setCoverLetterLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle resume tailoring
  const handleTailorResume = async () => {
    try {
      setTailorLoading(true)
      setTailorError('')
      setSuggestions('')
      const { data } = await tailorResume(job._id)
      setSuggestions(data.suggestions)
    } catch (err) {
      setTailorError(
        err.response?.data?.message || 'Failed to generate suggestions'
      )
    } finally {
      setTailorLoading(false)
    }
  }

  // Handle skill gap analysis
  const handleAnalyzeGaps = async () => {
    try {
      setGapsLoading(true)
      setGapsError('')
      setAnalysis('')
      const { data } = await analyzeGaps(job._id)
      setAnalysis(data.analysis)
    } catch (err) {
      setGapsError(
        err.response?.data?.message || 'Failed to generate analysis'
      )
    } finally {
      setGapsLoading(false)
    }
  }

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

  useEffect(() => {
    if (job?._id) {
      loadMatchScore()
    }
  }, [job])

  useEffect(() => {
    if (job?.job_apply_link) {
      checkSaved(job.job_apply_link)
        .then(({ data }) => setSaved(data.saved))
        .catch(() => {})
    }
  }, [job])

  const loadMatchScore = async () => {
    try {
      setScoreLoading(true)
      const { data } = await getMatchScore(job._id)
      setMatchScore(data)
    } catch (err) {
      console.error('Match score failed:', err)
    } finally {
      setScoreLoading(false)
    }
  }

  const handleSave = async () => {
    if (saved || saving) return
    try {
      setSaving(true)
      await saveApplication({
        job_title: job.job_title,
        company: job.employer_name,
        location: `${job.job_city || ''}, ${job.job_country || ''}`,
        salary: job.job_min_salary 
          ? `₹${job.job_min_salary} - ₹${job.job_max_salary}` 
          : '',
        job_url: job.job_apply_link,
        job_id: job._id
      })
      setSaved(true)
    } catch (err) {
      if (err.response?.status === 409) {
        setSaved(true)
      }
    } finally {
      setSaving(false)
    }
  }

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
            {/* Match Score Card */}
            <div className="card">
              <p className="text-sm font-medium text-gray-900 mb-3">
                Your match
              </p>
              
              {scoreLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-8 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              ) : matchScore ? (
                <>
                  {/* Score circle */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`text-3xl font-medium ${
                      matchScore.score >= 70 ? 'text-green-600' :
                      matchScore.score >= 40 ? 'text-amber-500' :
                      'text-gray-400'
                    }`}>
                      {matchScore.score}%
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700">
                        {matchScore.score >= 70 ? 'Strong match' :
                         matchScore.score >= 40 ? 'Partial match' :
                         'Weak match'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {matchScore.matchedSkills?.length || 0} of{' '}
                        {matchScore.totalSkills} skills matched
                      </p>
                    </div>
                  </div>

                  {/* Matched skills */}
                  {matchScore.matchedSkills?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-500 
                        mb-1.5">You have</p>
                      <div className="flex flex-wrap gap-1">
                        {matchScore.matchedSkills.map(skill => (
                          <span key={skill} 
                            className="text-xs px-2 py-0.5 rounded-full 
                              bg-green-50 text-green-700 font-medium">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing skills */}
                  {matchScore.missingSkills?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 
                        mb-1.5">You're missing</p>
                      <div className="flex flex-wrap gap-1">
                        {matchScore.missingSkills.slice(0, 6).map(skill => (
                          <span key={skill}
                            className="text-xs px-2 py-0.5 rounded-full 
                              bg-amber-50 text-amber-700 font-medium">
                            ⚠ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-400">
                  Upload your resume to see your match score
                </p>
              )}
            </div>

            {/* Card 1 — AI Actions */}
            <div className="card">
              <h2 className="text-sm font-medium text-gray-900 mb-3">AI Actions</h2>
              <p className="text-xs text-brand-600 mb-4">✨ Powered by Gemini Flash</p>
              <div className="space-y-2 w-full">
                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={coverLetterLoading}
                  className="w-full btn-primary text-sm py-2.5 
                    disabled:opacity-70 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {coverLetterLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white 
                        border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    '📝 Generate cover letter'
                  )}
                </button>
                <button
                  onClick={handleTailorResume}
                  disabled={tailorLoading}
                  className="w-full btn-ghost text-sm py-2.5
                    disabled:opacity-70 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {tailorLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-gray-400
                        border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    '🔄 Tailor my resume'
                  )}
                </button>
                <button
                  onClick={handleAnalyzeGaps}
                  disabled={gapsLoading}
                  className="w-full btn-ghost text-sm py-2.5
                    disabled:opacity-70 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {gapsLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-gray-400
                        border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    '🎯 Analyze skill gaps'
                  )}
                </button>
              </div>
            </div>

            {coverLetter && (
              <div className="card border-l-4 border-brand-500 
                rounded-l-none">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Generated Cover Letter
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Tailored for this role using your resume
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className={`text-xs font-medium px-3 py-1.5 
                        rounded-lg transition-all ${
                        copied 
                          ? 'bg-brand-50 text-brand-600 border border-brand-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {copied ? '✓ Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => setCoverLetter('')}
                      className="text-gray-300 hover:text-gray-500 
                        text-lg leading-none transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Cover letter text */}
                <div className="bg-white border border-gray-100 
                  rounded-xl p-4 max-h-72 overflow-y-auto">
                  <p className="text-sm text-gray-700 leading-7 
                    whitespace-pre-line">
                    {coverLetter}
                  </p>
                </div>

                {/* Footer tip */}
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Review and personalize before sending
                </p>

              </div>
            )}

            {coverLetterError && (
              <p className="text-xs text-red-500 text-center mt-2">
                {coverLetterError}
              </p>
            )}

            {/* Resume Tailor Result */}
            {suggestions && (
              <div className="card border-l-4 border-blue-400 
                rounded-l-none">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Resume Suggestions
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Tailored improvements for this role
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(suggestions)
                        setCopiedSuggestions(true)
                        setTimeout(() => setCopiedSuggestions(false), 2000)
                      }}
                      className={`text-xs font-medium px-3 py-1.5 
                        rounded-lg transition-all ${
                        copiedSuggestions
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {copiedSuggestions ? '✓ Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => setSuggestions('')}
                      className="text-gray-300 hover:text-gray-500 
                        text-lg leading-none transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 
                  rounded-xl p-4 max-h-72 overflow-y-auto">
                  <p className="text-sm text-gray-700 leading-7 
                    whitespace-pre-line">
                    {suggestions}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Apply these changes to your resume before applying
                </p>
              </div>
            )}

            {tailorError && (
              <p className="text-xs text-red-500 text-center mt-2">
                {tailorError}
              </p>
            )}

            {/* Gap Analysis Result */}
            {analysis && (
              <div className="card border-l-4 border-amber-400 
                rounded-l-none">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Skill Gap Analysis
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      What you have vs what they need
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(analysis)
                        setCopiedAnalysis(true)
                        setTimeout(() => setCopiedAnalysis(false), 2000)
                      }}
                      className={`text-xs font-medium px-3 py-1.5 
                        rounded-lg transition-all ${
                        copiedAnalysis
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {copiedAnalysis ? '✓ Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => setAnalysis('')}
                      className="text-gray-300 hover:text-gray-500 
                        text-lg leading-none transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 
                  rounded-xl p-4 max-h-72 overflow-y-auto">
                  <p className="text-sm text-gray-700 leading-7 
                    whitespace-pre-line">
                    {analysis}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Focus on quick wins to improve your match score
                </p>
              </div>
            )}

            {gapsError && (
              <p className="text-xs text-red-500 text-center mt-2">
                {gapsError}
              </p>
            )}

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
                onClick={handleSave}
                disabled={saved || saving}
                className="btn-ghost w-full text-sm py-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 
                 saved ? '✓ Saved to tracker' : 
                 '🔖 Save to tracker'}
              </button>
              {saved && (
                <Link
                  to="/tracker"
                  className="text-xs text-brand-500 hover:underline block text-center mt-2"
                >
                  View in tracker →
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
