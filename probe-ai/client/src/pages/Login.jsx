import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white text-center mb-8">PRobe</h1>
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Log in</h2>
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition"
          >
            Log in
          </button>
          <p className="text-sm text-gray-400 text-center">
            No account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
