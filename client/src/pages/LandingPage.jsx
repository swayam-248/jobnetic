import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="bg-white">
      <main className="mx-auto max-w-2xl px-4 pt-20 pb-16 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full bg-brand-100 px-3.5 py-1.5 text-xs font-semibold text-brand-800 uppercase tracking-wider">
          ✦ AI-powered job matching for students
        </div>

        {/* Headline */}
        <h1 className="mt-8 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
          Find jobs that fit you.
          <span className="block mt-1 text-brand-500">Not just your keywords.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 max-w-lg text-base text-gray-500 leading-relaxed">
          Upload your resume, set your preferences, and get a real match score for every job — with AI-written cover letters and resume suggestions tailored to each role.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-row items-center justify-center gap-4">
          <Link to="/register" className="btn-primary text-sm flex items-center">
            Start for free <span className="ml-1">↗</span>
          </Link>
          <a href="#how-it-works" className="btn-ghost text-sm">
            See how it works
          </a>
        </div>

        {/* Footer text */}
        <p className="mt-6 text-xs text-gray-400">
          Free to use · No credit card · Built for placement season
        </p>
      </main>
    </div>
  )
}
