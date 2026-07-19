import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// Intercept and bypass the global 401 redirect interceptor when we are on the login page
if (api && api.interceptors && api.interceptors.response) {
  const handlers = api.interceptors.response.handlers;
  if (Array.isArray(handlers)) {
    handlers.forEach((handler) => {
      if (handler && typeof handler.rejected === "function") {
        const originalRejected = handler.rejected;
        handler.rejected = (error) => {
          if (error?.response?.status === 401 && window.location.pathname.startsWith("/login")) {
            return Promise.reject(error);
          }
          return originalRejected(error);
        };
      }
    });
  }
}

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await login({
        email: formData.email,
        password: formData.password,
      });
      console.log("Login success:", data);
      if (data?.user?.onboarding_complete === false) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log("Login error:", err);
      console.log("Error response:", err.response);
      setError(err.response?.data?.message || "Invalid email or password");
      console.log("Error set, should show now");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card max-w-md w-full mx-auto p-8">
        {/* Header */}
        <div className="flex flex-col items-center">
          <Link to="/" className="text-xl font-medium text-gray-900">
            jobnetic<span className="text-brand-500">.</span>
          </Link>
          <h1 className="text-2xl font-medium text-gray-900 mt-6">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Log in to continue your job search.
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 space-y-4">
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
              placeholder="Enter your password"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn-primary py-3 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-brand-500 hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
