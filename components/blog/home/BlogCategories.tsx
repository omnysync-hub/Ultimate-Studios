import Link from "next/link";

const CATEGORIES = [
  {
    name: "Movies",
    slug: "movies",
    color: "#3B9BF5",
    glow: "rgba(59, 155, 245, 0.55)",
    description: "Deep analyses of cinematic masterpieces, directing techniques, and feature film lore.",
    icon: (
      /* Camera Reel Icon */
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 0 0 20" />
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M4.93 4.93l2.83 2.83" />
        <path d="M16.24 16.24l2.83 2.83" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
      </svg>
    )
  },
  {
    name: "Anime",
    slug: "anime",
    color: "#E23FE0",
    glow: "rgba(226, 63, 224, 0.55)",
    description: "Visual aesthetics, sakuga animation breakdowns, cyberpunk worlds, and narrative arcs.",
    icon: (
      /* Fan & Katana Blade Icon */
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        <path d="M18 15l4-4-4-4" />
      </svg>
    )
  },
  {
    name: "Series",
    slug: "series",
    color: "#F5A623",
    glow: "rgba(245, 166, 35, 0.55)",
    description: "Episodic storytelling, worldbuilding scale, soundstage builds, and serialized cinematography.",
    icon: (
      /* TV Screen / Display Icon */
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
        <polyline points="17 2 12 7 7 2" />
      </svg>
    )
  },
  {
    name: "Cinematography",
    slug: "cinematography",
    color: "#2BD9C4",
    glow: "rgba(43, 217, 196, 0.55)",
    description: "Lighting design, anamorphic optics, color science, and camera movement craft.",
    icon: (
      /* Aperture Icon */
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
        <line x1="9.69" y1="8" x2="21.17" y2="8" />
        <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
        <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
        <line x1="14.31" y1="16" x2="2.83" y2="16" />
        <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
      </svg>
    )
  }
];

export function BlogCategories() {
  return (
    <section id="categories" className="mt-16 w-full" aria-label="Blog Categories">
      <h2 className="font-display text-[28px] font-extrabold uppercase tracking-[0.5px] text-text-primary">
        CATEGORIES
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/blog#${cat.slug}`}
            className="group flex flex-col xl:flex-row items-stretch gap-4 rounded-card border border-border-subtle bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:border-border-subtle/40"
          >
            {/* Book Spine Icon Tile (120x160px) */}
            <div
              style={{
                borderColor: cat.color,
                boxShadow: `0 0 16px ${cat.glow}`
              }}
              className="relative flex h-[160px] w-full xl:w-[120px] flex-shrink-0 flex-col items-center justify-between rounded-sm border-2 bg-surface-2 p-4 transition-all duration-300 group-hover:scale-[1.02]"
            >
              <div
                style={{ color: cat.color }}
                className="mt-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              >
                {cat.icon}
              </div>

              {/* Spine Label at bottom edge */}
              <span
                style={{ color: cat.color }}
                className="font-display text-xs font-bold uppercase tracking-widest text-center"
              >
                {cat.name}
              </span>
            </div>

            {/* Category Text Card */}
            <div className="flex flex-1 flex-col justify-center py-2">
              <h3 className="font-display text-lg font-bold text-text-primary group-hover:text-white transition-colors">
                {cat.name}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary line-clamp-3">
                {cat.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
