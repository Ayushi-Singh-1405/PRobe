import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reviewAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ReviewOutput from '../components/ReviewOutput';

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState(null);
  const [prMeta, setPrMeta] = useState(null);

  useEffect(() => {
    reviewAPI
      .getById(id)
      .then((data) => {
        setReview(data.reviewData);
        setPrMeta({
          prTitle: data.prTitle,
          repoName: data.repoName,
          prNumber: data.prNumber,
          authorLogin: data.authorLogin,
          filesChanged: data.filesChanged,
          additions: data.additions,
          deletions: data.deletions,
          createdAt: data.createdAt,
          prUrl: data.prUrl,
        });
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('Review not found');
        } else {
          setError(err.response?.data?.message || 'Failed to load review');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await reviewAPI.deleteReview(id);
      showToast('Review deleted', 'success');
      navigate('/dashboard', { replace: true });
    } catch {
      showToast('Failed to delete review', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <LoadingSpinner message="Loading review..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-400">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition p-1 min-w-[80px]"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition p-1 min-w-[80px] justify-end"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>

        {/* Date + PR URL */}
        {prMeta && (
          <div className="mb-6 text-sm text-gray-500 space-y-1">
            <p>{new Date(review.createdAt || Date.now()).toLocaleString()}</p>
            <p className="font-mono text-xs break-all">{prMeta.prUrl}</p>
          </div>
        )}

        {/* Review Output */}
        {review && <ReviewOutput review={review} prMeta={prMeta} />}
      </div>
    </div>
  );
}
