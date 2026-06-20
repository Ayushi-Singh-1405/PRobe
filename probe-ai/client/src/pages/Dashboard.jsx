import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { reviewAPI, userAPI } from '../services/api';
import { Trash2, LogOut, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import ReviewOutput from '../components/ReviewOutput';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [prUrl, setPrUrl] = useState(location.state?.prUrl || '');
  const [githubToken, setGithubToken] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [currentReview, setCurrentReview] = useState(null);
  const [currentReviewId, setCurrentReviewId] = useState(null);
  const [currentPrMeta, setCurrentPrMeta] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalReviews: 0, totalIssues: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const [h, s] = await Promise.all([reviewAPI.getHistory(), userAPI.getStats()]);
      setHistory(h);
      setStats(s);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!prUrl.trim()) return;

    setError('');
    setCurrentReview(null);
    setCurrentReviewId(null);
    setCurrentPrMeta(null);
    setLoading(true);
    setLoadingStep(0);

    const stepTimer = setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, 2));
    }, 2000);

    try {
      const result = await reviewAPI.analyze(prUrl.trim(), githubToken || undefined);
      setCurrentReview(result);
      setCurrentReviewId(result.id);
      setCurrentPrMeta(result.prMeta);
      setLoadingStep(3);
      showToast('Review saved!', 'success');

      const newHistoryItem = {
        id: result.id,
        prUrl: prUrl.trim(),
        prTitle: result.prMeta.prTitle,
        repoName: result.prMeta.repoName,
        prNumber: result.prMeta.prNumber,
        issueCount: (result.issues || []).length,
        criticalCount: (result.issues || []).filter((i) => i.severity === 'critical').length,
        warningCount: (result.issues || []).filter((i) => i.severity === 'warning').length,
        suggestionCount: (result.issues || []).filter((i) => i.severity === 'suggestion').length,
        createdAt: new Date().toISOString(),
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
      setStats((prev) => ({
        totalReviews: prev.totalReviews + 1,
        totalIssues: prev.totalIssues + newHistoryItem.issueCount,
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Analysis failed');
      showToast(err.response?.data?.message || 'Analysis failed', 'error');
    } finally {
      clearInterval(stepTimer);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await reviewAPI.deleteReview(id);
      if (currentReviewId === id) {
        setCurrentReview(null);
        setCurrentReviewId(null);
        setCurrentPrMeta(null);
      }
      fetchHistory();
      showToast('Review deleted', 'success');
    } catch {
      showToast('Failed to delete review', 'error');
    }
  };

  const loadReview = async (id) => {
    try {
      const review = await reviewAPI.getById(id);
      setCurrentReview(review.reviewData);
      setCurrentReviewId(review.id);
      setCurrentPrMeta({
        prTitle: review.prTitle,
        repoName: review.repoName,
        prNumber: review.prNumber,
        authorLogin: review.authorLogin,
        filesChanged: review.filesChanged,
        additions: review.additions,
        deletions: review.deletions,
      });
      setSidebarOpen(false);
    } catch {
      // silently fail
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const steps = [
    '🔍 Fetching PR data...',
    '🤖 Running AI analysis...',
    '✅ Review complete!',
  ];

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-1">
          <span className="text-lg font-bold">PRobe</span>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white transition p-1 min-w-[32px]">
            <LogOut size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-400">Hello, {user?.username}</p>
      </div>

      <div className="flex gap-3 p-4 border-b border-gray-800">
        <div className="flex-1 bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-indigo-400">{stats.totalReviews}</p>
          <p className="text-xs text-gray-400">Reviews</p>
        </div>
        <div className="flex-1 bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-indigo-400">{stats.totalIssues}</p>
          <p className="text-xs text-gray-400">Issues</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 pt-4 pb-2">
          Review History
        </h3>
        {history.length === 0 && (
          <p className="text-sm text-gray-500 px-4">
            No reviews yet. Paste a PR URL above to get started! 🚀
          </p>
        )}
        <div className="space-y-1 px-2 pb-4">
          {history.map((item) => (
            <div
              key={item.id}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer text-sm transition min-h-[44px] ${
                currentReviewId === item.id
                  ? 'bg-indigo-600/20 text-indigo-300'
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
              onClick={() => loadReview(item.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{item.repoName}</p>
                <p className="text-xs text-gray-500">
                  PR #{item.prNumber} · {formatDate(item.createdAt)}
                </p>
              </div>
              <span className="shrink-0 text-xs bg-gray-800 rounded-full px-2 py-0.5 text-gray-400">
                {item.issueCount}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="shrink-0 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1 min-w-[28px]"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col md:flex-row">
      {/* Mobile hamburger */}
      <div className="md:hidden flex items-center gap-3 p-3 border-b border-gray-800 bg-gray-900/50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-400 hover:text-white transition p-1 min-w-[36px]"
        >
          <Menu size={22} />
        </button>
        <span className="text-lg font-bold">PRobe</span>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-[#0D1117] border-r border-gray-800 transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end p-3">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white transition p-1 min-w-[36px]"
          >
            <X size={22} />
          </button>
        </div>
        <div className="flex flex-col h-[calc(100%-56px)] overflow-hidden">
          {sidebarContent}
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-72 shrink-0 border-r border-gray-800 bg-gray-900/50 flex-col">
        {sidebarContent}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-4xl">
        {/* PR Input */}
        <form onSubmit={handleAnalyze} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Paste a GitHub PR URL..."
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-base"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg font-medium transition whitespace-nowrap text-base min-w-[100px]"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition py-1"
          >
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Advanced
          </button>
          {showAdvanced && (
            <div className="mt-2">
              <label className="block text-xs text-gray-500 mb-1">
                GitHub Token (for private repos)
              </label>
              <input
                type="password"
                placeholder="ghp_..."
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          )}
        </form>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mb-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      loadingStep > i
                        ? 'bg-emerald-500 text-white'
                        : loadingStep === i
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-gray-700 text-gray-500'
                    }`}
                  >
                    {loadingStep > i ? '✓' : i + 1}
                  </div>
                  <span
                    className={`text-sm transition ${
                      loadingStep >= i ? 'text-gray-200' : 'text-gray-600'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Output */}
        {currentReview && !loading && (
          <ReviewOutput review={currentReview} prMeta={currentPrMeta} />
        )}
      </main>
    </div>
  );
}
