import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [preferences, setPreferences] = useState({
    targetRole: "",
    location: "",
    jobType: "any",
    minSalary: "",
  });

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    setResumeFile(file);
  };

  const getJobTypeLabel = (value) => {
    switch (value) {
      case "any":
        return "Any";
      case "internship":
        return "Internship";
      case "fulltime":
        return "Full-time";
      case "remote":
        return "Remote";
      default:
        return value;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="card max-w-lg w-full mx-auto p-8 bg-white">
        {/* Header */}
        <div className="flex flex-col items-center border-b border-gray-100 pb-6">
          <Link to="/" className="text-xl font-medium text-gray-900">
            jobnetic<span className="text-brand-500">.</span>
          </Link>
          <span className="text-sm text-gray-400 mt-2">Step {step} of 3</span>

          {/* Progress bar */}
          <div className="flex items-center justify-between w-full max-w-[180px] mt-4">
            <div
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                step >= 1 ? "bg-brand-500" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-0.5 flex-1 transition-colors duration-300 ${
                step >= 2 ? "bg-brand-500" : "bg-gray-200"
              }`}
            />
            <div
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                step >= 2 ? "bg-brand-500" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-0.5 flex-1 transition-colors duration-300 ${
                step >= 3 ? "bg-brand-500" : "bg-gray-200"
              }`}
            />
            <div
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                step >= 3 ? "bg-brand-500" : "bg-gray-200"
              }`}
            />
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="flex flex-col animate-fadeIn">
            <h2 className="text-xl font-medium text-gray-900 mt-8">
              Upload your resume
            </h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              We'll extract your skills and experience automatically.
            </p>

            {/* Upload Area */}
            <div
              onClick={handleUploadClick}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-colors duration-150"
            >
              <div className="text-3xl mb-3">📄</div>
              <p className="text-sm font-medium text-gray-700">
                Click to upload your resume
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF files only · Max 5MB</p>
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Selected File Indicator */}
            {resumeFile && (
              <p className="text-sm text-brand-600 font-medium mt-3 flex items-center gap-1.5 justify-center">
                <span>✓</span> {resumeFile.name}
              </p>
            )}

            {/* Next Button */}
            <button
              onClick={() => {
                if (resumeFile) {
                  setStep(2);
                } else {
                  alert("Please upload your resume first");
                }
              }}
              className="btn-primary w-full mt-6"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col animate-fadeIn">
            <h2 className="text-xl font-medium text-gray-900 mt-8">
              Set your preferences
            </h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Tell us what you're looking for.
            </p>

            {/* Form Fields Container */}
            <div className="space-y-4">
              {/* Target Role */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Target role
                </label>
                <input
                  type="text"
                  name="targetRole"
                  value={preferences.targetRole}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer, Data Analyst"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>

              {/* Preferred Location */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Preferred location
                </label>
                <input
                  type="text"
                  name="location"
                  value={preferences.location}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore, Remote, Mumbai"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>

              {/* Job Type */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Job type
                </label>
                <select
                  name="jobType"
                  value={preferences.jobType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="any">Any</option>
                  <option value="internship">Internship</option>
                  <option value="fulltime">Full-time</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              {/* Minimum Salary */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Minimum salary (₹/month)
                </label>
                <input
                  type="number"
                  name="minSalary"
                  value={preferences.minSalary}
                  onChange={handleChange}
                  placeholder="e.g. 20000"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Step 2 Buttons */}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="btn-ghost flex-1">
                Back
              </button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col animate-fadeIn">
            <h2 className="text-xl font-medium text-gray-900 mt-8">
              You're all set!
            </h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Here's a summary of your profile.
            </p>

            {/* Summary Card */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Resume</span>
                <span className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
                  {resumeFile?.name || "Not uploaded"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Target role</span>
                <span className="text-sm font-medium text-gray-900">
                  {preferences.targetRole || "Not set"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Location</span>
                <span className="text-sm font-medium text-gray-900">
                  {preferences.location || "Not set"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Job type</span>
                <span className="text-sm font-medium text-gray-900">
                  {getJobTypeLabel(preferences.jobType)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Min salary</span>
                <span className="text-sm font-medium text-gray-900">
                  {preferences.minSalary
                    ? "₹" + preferences.minSalary + "/month"
                    : "Not set"}
                </span>
              </div>
            </div>

            {/* Step 3 Buttons */}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} className="btn-ghost flex-1">
                Back
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-primary flex-1"
              >
                Complete setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
