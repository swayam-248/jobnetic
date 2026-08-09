import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default api

// Profile API calls
export const uploadResume = (file) => {
  const formData = new FormData()
  formData.append('resume', file)
  return api.post('/profile/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const savePreferences = (preferences) =>
  api.post('/profile/preferences', preferences)

export const completeOnboarding = () =>
  api.patch('/profile/complete')

export const getProfile = () =>
  api.get('/profile/me')

// Fetch jobs from backend
export const fetchJobs = (params = {}) =>
  api.get('/jobs', { params })

// Trigger job fetch from JSearch for current user
export const triggerJobFetch = () =>
  api.post('/jobs/fetch')

export const getJobById = (id) =>
  api.get(`/jobs/${id}`)

export const getMatchScoresBulk = (jobIds) =>
  api.post('/match/bulk', { jobIds })

export const getMatchScore = (jobId) =>
  api.get(`/match/job/${jobId}`)




