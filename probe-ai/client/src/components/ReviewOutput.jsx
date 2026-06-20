import SeverityBadge from './SeverityBadge';
import IssueCard from './IssueCard';

const severityOrder = { critical: 0, warning: 1, suggestion: 2 };

export default function ReviewOutput({ review, prMeta }) {
  const issues = (review.issues || []).sort(
    (a, b) => (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99),
  );

  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const suggestionCount = issues.filter((i) => i.severity === 'suggestion').length;

  const scoreColor =
    review.overallScore > 7
      ? 'text-emerald-400'
      : review.overallScore >= 4
        ? 'text-amber-400'
        : 'text-red-400';

  return (
    <div className="space-y-5">
      {/* PR Metadata Bar */}
      {prMeta && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-1">{prMeta.prTitle}</h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
            <span>{prMeta.repoName}</span>
            <span>PR #{prMeta.prNumber}</span>
            <span>by {prMeta.authorLogin}</span>
            <span className="text-gray-600">·</span>
            <span>{prMeta.filesChanged} files</span>
            <span className="text-emerald-400">+{prMeta.additions}</span>
            <span className="text-red-400">-{prMeta.deletions}</span>
          </div>
        </div>
      )}

      {/* Overall Score */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
        <div className="flex items-center gap-4 mb-3">
          <div className={`text-5xl font-bold ${scoreColor}`}>{review.overallScore}</div>
          <div>
            <p className="text-sm font-medium text-gray-300">Overall Score</p>
            <p className="text-xs text-gray-500">/ 10</p>
          </div>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{review.summary}</p>
      </div>

      {/* Issue Counts Row */}
      {(criticalCount > 0 || warningCount > 0 || suggestionCount > 0) && (
        <div className="flex flex-wrap gap-3">
          {criticalCount > 0 && (
            <span className="text-sm text-red-400">🔴 {criticalCount} Critical</span>
          )}
          {warningCount > 0 && (
            <span className="text-sm text-amber-400">🟡 {warningCount} Warnings</span>
          )}
          {suggestionCount > 0 && (
            <span className="text-sm text-emerald-400">🟢 {suggestionCount} Suggestions</span>
          )}
        </div>
      )}

      {/* No Issues Found */}
      {issues.length === 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
          <p className="text-lg text-emerald-400">🎉 No issues found. This code looks clean!</p>
        </div>
      )}

      {/* Issues List */}
      {issues.length > 0 && (
        <div className="space-y-2">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}

      {/* Positives */}
      {review.positives && review.positives.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">
            Positives
          </h3>
          <ul className="space-y-2">
            {review.positives.map((p, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
