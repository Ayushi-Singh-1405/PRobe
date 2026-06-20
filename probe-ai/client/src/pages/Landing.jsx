import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code, Shield, Clock } from 'lucide-react';

export default function Landing() {
  const [prUrl, setPrUrl] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/dashboard', { state: { prUrl } });
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <span className="text-xl font-bold tracking-tight">PRobe</span>
        <div className="space-x-4">
          {user ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-300 hover:text-white transition"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center px-4 pt-24 pb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          PRobe
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10">
          Probe every line. Ship with confidence.
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-xl flex gap-3">
          <input
            type="text"
            placeholder="Paste a GitHub PR URL..."
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition whitespace-nowrap"
          >
            Try it free
          </button>
        </form>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <Code className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Instant AI Review</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get a thorough code review powered by Claude AI in seconds. Paste a
              PR URL and receive detailed feedback.
            </p>
          </div>
          <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <Shield className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Security Scanner</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Automatically identify security vulnerabilities, bugs, and
              performance issues before they ship.
            </p>
          </div>
          <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <Clock className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Review History</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              All your past reviews are saved. Track improvements, revisit
              feedback, and monitor your code quality over time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
