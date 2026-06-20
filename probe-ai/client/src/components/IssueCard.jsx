import { useState } from 'react';
import SeverityBadge from './SeverityBadge';

const borderColors = {
  critical: 'border-l-red-500',
  warning: 'border-l-amber-500',
  suggestion: 'border-l-emerald-500',
};

export default function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-gray-800/50 border border-gray-700 border-l-4 rounded-lg overflow-hidden transition ${
        borderColors[issue.severity] || 'border-l-gray-500'
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-gray-800/80 transition"
      >
        <SeverityBadge severity={issue.severity} />
        <span className="text-xs font-mono text-gray-500 uppercase bg-gray-800 px-1.5 py-0.5 rounded">
          {issue.category}
        </span>
        <span className="flex-1 text-sm text-gray-200 truncate">{issue.title}</span>
        <span className="text-xs text-gray-500 shrink-0">
          {issue.file}{issue.line != null ? `:${issue.line}` : ''}
        </span>
        <span className="text-xs text-gray-500 shrink-0">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-700/50 space-y-3 text-sm">
          <p className="text-gray-300 leading-relaxed">{issue.description}</p>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Suggestion:</p>
            <pre className="bg-gray-900 text-gray-200 p-3 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono">
              {issue.suggestion}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
