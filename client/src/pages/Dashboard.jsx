import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchJobs, triggerJobFetch } from '../services/api'
import JobCard from '../components/JobCard'

/**
 * Dashboard Component
 * Displays matched jobs, header stats, refresh trigger, loading skeletons, error, and empty states.
 */
export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')
  const [totalJobs, setTotalJobs] = useState(0)
  const { user } = useAuth()

  // On mount: load stored jobs from MongoDB
  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await fetchJobs()
      setJobs(data.jobs || [])
      setTotalJobs(data.total || 0)
    } catch (err) {
      setError('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  // Handle refresh: trigger JSearch fetch backend API then reload stored jobs
  const handleRefresh = async () => {
    try {
      setFetching(true)
      setError('')
      await triggerJobFetch()
      await loadJobs()
    } catch (err) {
      setError('Failed to fetch new jobs')
    } finally {
      setFetching(false)
    }
  }

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
              {totalJobs} jobs matched for you
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
            <button onClick={loadJobs} className="btn-ghost mt-4">
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
              <JobCard key={job.job_id || job._id} job={job} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
