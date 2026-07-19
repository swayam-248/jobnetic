import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Destructure register from useAuth, and wrap it to adapt the context's 
  // register(values) signature to the expected register(name, email, password) signature
  const { register: authRegister } = useAuth()
  const navigate = useNavigate()

  const register = async (name, email, password) => {
    return authRegister({ name, email, password })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      await register(formData.name, formData.email, formData.password)
      navigate('/onboarding')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card max-w-md w-full mx-auto p-8">
        {/* Header */}
        <div className="flex flex-col items-center">
          <Link to="/" className="text-xl font-medium text-gray-900">
            jobnetic<span className="text-brand-500">.</span>
          </Link>
          <h1 className="text-2xl font-medium text-gray-900 mt-6">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Start finding jobs that actually fit you.
          </p>
        </div>

        {/* Form Container (No <form> tag) */}
        <div className="mt-8 space-y-4">
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Error Display */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full py-3 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-500 hover:underline font-medium">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
