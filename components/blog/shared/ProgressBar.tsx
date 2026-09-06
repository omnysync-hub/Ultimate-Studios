type Props = {
  current: number;
  total: number;
  className?: string;
};

export function ProgressBar({ current, total, className = "" }: Props) {
  const percentage = Math.min(100, Math.max(0, total > 0 ? (current / total) * 100 : 0));

  return (
    <div
      className={`w-full h-2 rounded-pill bg-surface-2 overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <div
        className="h-full rounded-pill transition-all duration-300 bg-[var(--accent)]"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
