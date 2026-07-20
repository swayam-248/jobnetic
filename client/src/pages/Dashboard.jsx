import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-start">
      <div className="max-w-2xl w-full mx-auto px-6 py-16">
        {/* Welcome Heading */}
        <h1 className="text-2xl font-medium text-gray-900">
          Welcome back, {user?.name || "User"}! 👋
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Your dashboard is being built. Check back soon.
        </p>

        {/* Divider */}
        <hr className="mt-8 border-t border-gray-100" />

        {/* Card */}
        <div className="card mt-8 text-center p-12 bg-white">
          <div className="text-4xl">🚧</div>
          <p className="text-sm text-gray-400 mt-3">
            Jobs dashboard coming in Week 3
          </p>
        </div>

        {/* Logout Button */}
        <div className="mt-6 flex justify-center">
          <button onClick={handleLogout} className="btn-ghost">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
