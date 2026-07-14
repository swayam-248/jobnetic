import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
              jobnetic<span className="text-brand-500">.</span>
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            <Link to="/login" className="btn-ghost text-sm text-center">
              Log in
            </Link>
            <Link to="/register" className="btn-primary text-sm text-center">
              Get started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white shadow-sm" id="mobile-menu">
          <div className="flex flex-col space-y-3 px-4 pt-2 pb-6">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="btn-ghost text-sm text-center block w-full"
            >
              Log in
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="btn-primary text-sm text-center block w-full"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
