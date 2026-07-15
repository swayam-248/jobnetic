import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
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

      {/* SECTION 1 — STATS ROW */}
      <section className="border-t border-b border-gray-100 py-10 px-6 max-w-3xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          {/* Stat 1 */}
          <div className="text-center bg-gray-50 rounded-xl p-6">
            <span className="text-2xl font-medium text-brand-500 block">10k+</span>
            <span className="text-sm text-gray-400 mt-1 block">Jobs fetched daily</span>
          </div>
          {/* Stat 2 */}
          <div className="text-center bg-gray-50 rounded-xl p-6">
            <span className="text-2xl font-medium text-brand-500 block">AI</span>
            <span className="text-sm text-gray-400 mt-1 block">Match score per role</span>
          </div>
          {/* Stat 3 */}
          <div className="text-center bg-gray-50 rounded-xl p-6">
            <span className="text-2xl font-medium text-brand-500 block">1-click</span>
            <span className="text-sm text-gray-400 mt-1 block">Cover letter gen</span>
          </div>
        </div>
      </section>

      {/* SECTION 2 — JOB CARD PREVIEW */}
      <section className="border-b border-gray-100 py-12 px-6 max-w-3xl mx-auto">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-6 block">
          WHAT A MATCHED JOB LOOKS LIKE
        </span>

        {/* Job Card */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm border-l-4 border-l-brand-500 rounded-l-none">
          {/* Top Row */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-base font-medium text-gray-900">Frontend Developer Intern</h3>
              <p className="text-sm text-gray-500 mt-1">Razorpay · Bangalore · ₹25k/month</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-2xl font-medium text-brand-500 block leading-none">82%</span>
              <span className="text-xs text-gray-400 block mt-1">match</span>
            </div>
          </div>

          {/* Skill tags row */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-brand-100 text-brand-800">
              ✓ React
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-brand-100 text-brand-800">
              ✓ Node.js
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-brand-100 text-brand-800">
              ✓ REST APIs
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700">
              ⚠ Docker
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-brand-50 text-brand-700">
              Internship
            </span>
          </div>

          {/* Jobnetic insight box */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4 border-l-2 border-brand-400">
            <h4 className="text-xs font-medium text-brand-700 mb-1">Jobnetic insight</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              You match 3 of 4 core requirements. Your full-stack project experience directly covers what they need. Missing Docker — a basic containerization side project would close the gap.
            </p>
          </div>

          {/* Three buttons row */}
          <div className="flex gap-2 mt-5 flex-wrap">
            <button className="btn-primary text-sm py-2 px-4">
              Generate cover letter ↗
            </button>
            <button className="btn-ghost text-sm py-2 px-4">
              Tailor resume
            </button>
            <button className="btn-ghost text-sm py-2 px-4 ml-auto">
              Save
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3 — HOW IT WORKS */}
      <section id="how-it-works" className="border-b border-gray-100 py-12 px-6 max-w-3xl mx-auto">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-6 block">
          HOW IT WORKS
        </span>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="card">
            <span className="text-2xl mb-3 block" role="img" aria-label="document">📄</span>
            <h3 className="text-sm font-medium text-gray-900 mt-2">Upload your resume</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Skills and experience pulled out automatically
            </p>
          </div>

          {/* Card 2 */}
          <div className="card">
            <span className="text-2xl mb-3 block" role="img" aria-label="gear">⚙️</span>
            <h3 className="text-sm font-medium text-gray-900 mt-2">Set your preferences</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Role, city, salary range, internship or full-time
            </p>
          </div>

          {/* Card 3 */}
          <div className="card">
            <span className="text-2xl mb-3 block" role="img" aria-label="target">🎯</span>
            <h3 className="text-sm font-medium text-gray-900 mt-2">Get matched daily</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Jobs ranked by fit score, not just keywords
            </p>
          </div>

          {/* Card 4 */}
          <div className="card">
            <span className="text-2xl mb-3 block" role="img" aria-label="clipboard">📋</span>
            <h3 className="text-sm font-medium text-gray-900 mt-2">Track applications</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Kanban board across every stage of the process
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
