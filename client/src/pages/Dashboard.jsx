import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchJobs, triggerJobFetch, getMatchScoresBulk } from '../services/api'
import JobCard from '../components/JobCard'

/**
 * Dashboard Component
 * Displays matched jobs, filter bar, pagination, header stats, loading skeletons, error, and empty states.
 */
export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')
  const [totalJobs, setTotalJobs] = useState(0)
  
  // Filter and pagination state
  const [filters, setFilters] = useState({
    role: '',
    location: '',
    type: ''
  })

  // FIX 1: Store active filters separately from input filters so page changes and submissions maintain correct state
  const [activeFilters, setActiveFilters] = useState({})

  // FIX 2: Add submitting state to prevent double submit and loading flicker
  const [submitting, setSubmitting] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const JOBS_PER_PAGE = 10

  // Match score state
  const [matchScores, setMatchScores] = useState({})
  const [scoresLoading, setScoresLoading] = useState(false)

  const { user } = useAuth()

  // On mount: load stored jobs from MongoDB with default parameters
  useEffect(() => {
    loadJobs()
  }, [])

  // Fetch match scores for the loaded list of jobs
  const loadMatchScores = async (jobsList) => {
    if (!jobsList || jobsList.length === 0) return
    try {
      setScoresLoading(true)
      const jobIds = jobsList.map(job => job._id)
      const { data } = await getMatchScoresBulk(jobIds)
      setMatchScores(data.scores || {})
    } catch (err) {
      console.error('Match scores failed:', err.message)
    } finally {
      setScoresLoading(false)
    }
  }

  // FIX 2: Load jobs returns promise so caller can chain .finally() for submitting state
  const loadJobs = async (filterParams = {}, page = 1) => {
    try {
      setLoading(true)
      setError('')
      const { data } = await fetchJobs({
         ...filterParams,
         page,
         limit: JOBS_PER_PAGE
      })
      const jobsList = data.jobs || []
      setJobs(jobsList)
      setTotalJobs(data.total || 0)
      setTotalPages(data.totalPages || 1)
      setCurrentPage(page)
      // Fetch match scores for loaded jobs
      await loadMatchScores(jobsList)
      return data
    } catch (err) {
      setError('Failed to load jobs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle refresh: trigger JSearch fetch backend API then reload stored jobs with active filters
  const handleRefresh = async () => {
    try {
      setFetching(true)
      setError('')
      await triggerJobFetch()
      await loadJobs(activeFilters, currentPage)
    } catch (err) {
      setError('Failed to fetch new jobs')
    } finally {
      setFetching(false)
    }
  }

  // Handle input changes for search inputs and select
  const handleFilterChange = (e) => {
    const newFilters = { 
      ...filters, 
      [e.target.name]: e.target.value 
    }
    setFilters(newFilters)
  }

  // FIX 1 & 2: Submit filters, set activeFilters, and manage submitting flag to prevent double clicks
  const handleFilterSubmit = () => {
    if (submitting) return
    setSubmitting(true)
    const newActiveFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    )
    setActiveFilters(newActiveFilters)
    loadJobs(newActiveFilters, 1).finally(() => {
      setSubmitting(false)
    })
  }

  // FIX 1: Reset both input filters and activeFilters, then reload all jobs starting from page 1
  const handleClearFilters = () => {
    setFilters({ role: '', location: '', type: '' })
    setActiveFilters({})
    loadJobs({}, 1)
  }

  // FIX 1: Handle pagination page change using activeFilters
  const handlePageChange = (newPage) => {
    loadJobs(activeFilters, newPage)
  }

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== '')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-900">
              Good morning, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {hasActiveFilters 
                ? `Showing ${jobs.length} of ${totalJobs} results`
                : `${totalJobs} jobs matched for you`
              }
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={fetching}
            className="btn-ghost text-sm gap-2 flex items-center disabled:opacity-50"
          >
            {fetching ? 'Fetching...' : '🔄 Refresh jobs'}
          </button>
        </div>
      </header>

      {/* Filter Bar UI */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="flex items-center gap-3 flex-wrap max-w-4xl mx-auto">
          {/* Input 1 - Role (FIX 4: Enter key support added) */}
          <input
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
            placeholder="Search role..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent w-48"
          />

          {/* Input 2 - Location (FIX 4: Enter key support added) */}
          <input
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit()}
            placeholder="Location..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent w-40"
          />

          {/* Input 3 - Job Type */}
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent w-40 bg-white"
          >
            <option value="">All types</option>
            <option value="FULLTIME">Full-time</option>
            <option value="PARTTIME">Part-time</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="CONTRACTOR">Contract</option>
          </select>

          {/* Action buttons (FIX 2: Disabled when submitting or loading) */}
          <button 
            onClick={handleFilterSubmit}
            disabled={submitting || loading}
            className="btn-primary text-sm py-2 px-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? 'Searching...' : 'Search'}
          </button>
          
          {(filters.role || filters.location || filters.type || hasActiveFilters) && (
            <button
              onClick={handleClearFilters}
              className="btn-ghost text-sm py-2 px-4"
            >
              Clear
            </button>
          )}

          {/* Active filter count badge */}
          {hasActiveFilters && (
            <span className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-1 rounded-full">
              Filters active
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 w-full flex-1">
        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card h-40 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-6" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="card text-center py-12">
            <div className="text-3xl mb-3">⚠️</div>
            <p className="text-sm text-gray-500">{error}</p>
            <button onClick={() => loadJobs(activeFilters, currentPage)} className="btn-ghost mt-4">
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="card text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-base font-medium text-gray-900 mt-3">
              No jobs found yet
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Click refresh to fetch jobs based on your preferences
            </p>
            <button onClick={handleRefresh} className="btn-primary mt-6">
              Fetch jobs now
            </button>
          </div>
        )}

        {/* Jobs List */}
        {!loading && !error && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard
                key={job.job_id || job._id}
                job={job}
                matchScore={matchScores[job._id]}
                scoresLoading={scoresLoading}
              />
            ))}
          </div>
        )}

        {/* Pagination UI */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-ghost text-sm py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPages || 
                  Math.abs(page - currentPage) <= 1
                )
                .map((page, index, arr) => (
                  <React.Fragment key={page}>
                    {index > 0 && arr[index - 1] !== page - 1 && (
                      <span key={`ellipsis-${page}`} className="text-gray-400 px-1">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-brand-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))
              }
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn-ghost text-sm py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}


