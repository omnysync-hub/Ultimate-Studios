type Props = { className?: string };

export function YouTubeFeedSkeleton({ className = "" }: Props) {
  return (
    <section
      className={`animate-pulse ${className}`}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading YouTube uploads"
    >
      <div className="mb-6 h-8 w-48 rounded bg-zinc-800" />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50"
          >
            <div className="aspect-video bg-zinc-800" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-full rounded bg-zinc-800" />
              <div className="h-4 w-2/3 rounded bg-zinc-800" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
