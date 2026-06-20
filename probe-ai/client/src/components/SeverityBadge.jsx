export default function SeverityBadge({ severity }) {
  const styles = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    suggestion: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  const labels = {
    critical: 'CRITICAL',
    warning: 'WARNING',
    suggestion: 'SUGGESTION',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border ${
        styles[severity] || styles.suggestion
      }`}
    >
      {labels[severity] || severity}
    </span>
  );
}
