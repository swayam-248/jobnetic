import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApplications, updateApplication, deleteApplication } from '../services/api'

// Kanban Columns Configuration
const COLUMNS = [
  { 
    id: 'saved', 
    label: 'Saved', 
    color: 'bg-gray-100 text-gray-600',
    dot: 'bg-gray-400'
  },
  { 
    id: 'applied', 
    label: 'Applied', 
    color: 'bg-blue-50 text-blue-600',
    dot: 'bg-blue-400'
  },
  { 
    id: 'interview', 
    label: 'Interview', 
    color: 'bg-amber-50 text-amber-600',
    dot: 'bg-amber-400'
  },
  { 
    id: 'offer', 
    label: 'Offer', 
    color: 'bg-green-50 text-green-600',
    dot: 'bg-green-400'
  },
  { 
    id: 'rejected', 
    label: 'Rejected', 
    color: 'bg-red-50 text-red-600',
    dot: 'bg-red-400'
  }
]

export default function Tracker() {
  // State variables
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const navigate = useNavigate()

  // Load applications on component mount
  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const { data } = await getApplications()
      setApplications(data.applications || [])
    } catch (err) {
      setError('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  // Handle application status change
  const handleStatusChange = async (appId, newStatus) => {
    try {
      setUpdatingId(appId)
      await updateApplication(appId, { status: newStatus })
      setApplications(prev =>
        prev.map(app =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      )
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  // Handle application deletion
  const handleDelete = async (appId) => {
    if (!window.confirm('Remove this application from tracker?')) 
      return
    try {
      setDeletingId(appId)
      await deleteApplication(appId)
      setApplications(prev => prev.filter(app => app.id !== appId))
    } catch (err) {
      console.error('Failed to delete:', err)
    } finally {
      setDeletingId(null)
    }
  }

  // Get applications for a specific column
  const getColumnApps = (columnId) =>
    applications.filter(app => app.status === columnId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Application Tracker</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {applications.length} applications tracked
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-ghost text-sm"
          >
            ← Back to jobs
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {loading ? (
        /* Loading State */
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        /* Error State */
        <div className="text-center py-24">
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      ) : applications.length === 0 ? (
        /* Empty State */
        <div className="text-center py-24 max-w-sm mx-auto">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-lg font-medium text-gray-900 mt-4">
            No applications yet
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Save jobs from the dashboard to track your progress
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary mt-6"
          >
            Browse jobs
          </button>
        </div>
      ) : (
        /* Kanban Board */
        <div className="px-6 py-6 overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {COLUMNS.map(column => {
              const columnApps = getColumnApps(column.id)
              return (
                <div key={column.id} className="w-72 flex-shrink-0">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${column.dot}`} />
                      <span className="text-sm font-medium text-gray-700">
                        {column.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${column.color} font-medium`}>
                        {columnApps.length}
                      </span>
                    </div>
                  </div>

                  {/* Column Body */}
                  <div className="space-y-3">
                    {columnApps.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                        <p className="text-xs text-gray-400">No applications</p>
                      </div>
                    ) : (
                      columnApps.map(app => (
                        <div
                          key={app.id}
                          className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {/* Job title + delete button */}
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-gray-900 leading-snug flex-1">
                              {app.job_title}
                            </p>
                            <button
                              onClick={() => handleDelete(app.id)}
                              disabled={deletingId === app.id}
                              className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 text-lg leading-none disabled:opacity-50"
                            >
                              ×
                            </button>
                          </div>

                          {/* Company */}
                          <p className="text-xs text-gray-500 mt-1">
                            {app.company}
                          </p>

                          {/* Location if exists */}
                          {app.location && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              📍 {app.location}
                            </p>
                          )}

                          {/* Date saved */}
                          <p className="text-xs text-gray-300 mt-2">
                            Saved {new Date(app.created_at).toLocaleDateString()}
                          </p>

                          {/* Status selector */}
                          <div className="mt-3">
                            <select
                              value={app.status}
                              onChange={(e) =>
                                handleStatusChange(app.id, e.target.value)
                              }
                              disabled={updatingId === app.id}
                              className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {COLUMNS.map(col => (
                                <option key={col.id} value={col.id}>
                                  {col.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Apply link if exists */}
                          {app.job_url && (
                            <a
                              href={app.job_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 text-xs text-brand-500 hover:underline block"
                            >
                              View job posting ↗
                            </a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
