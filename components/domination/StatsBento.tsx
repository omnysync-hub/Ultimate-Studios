import { dominationStats } from "@/lib/domination";
import { StatCard } from "./StatCard";
import styles from "./DominationSection.module.css";

const [followers, subscribers, videos, views] = dominationStats;

const platforms = ["YT", "IG", "TT", "X", "FB", "SC"];

export function StatsBento() {
  return (
    <div className={styles.bento} data-bento>
      <StatCard metric={followers} className={styles.cardFollowers}>
        <div className={styles.decorLayer}>
          <svg className={styles.svgNetwork} viewBox="0 0 280 180" aria-hidden="true">
            <g stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.35">
              <path d="M40 40 L90 70 L140 45 L190 85 L240 50" />
              <path d="M50 120 L100 95 L150 130 L200 100 L250 140" />
              <path d="M90 70 L100 95 M140 45 L150 130 M190 85 L200 100" />
            </g>
            {[
              [40, 40],
              [90, 70],
              [140, 45],
              [190, 85],
              [240, 50],
              [50, 120],
              [100, 95],
              [150, 130],
              [200, 100],
              [250, 140],
              [70, 155],
              [220, 160]
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={i % 3 === 0 ? 4.5 : 2.8}
                fill="currentColor"
                opacity={0.25 + (i % 4) * 0.1}
              />
            ))}
          </svg>
          <ul className={styles.platformRow} aria-hidden="true">
            {platforms.map((p) => (
              <li key={p} className={styles.platformChip}>
                {p}
              </li>
            ))}
          </ul>
          <div className={styles.orbitRing} aria-hidden="true" />
        </div>
      </StatCard>

      <StatCard metric={subscribers} className={styles.cardSubs}>
        <div className={styles.decorLayer}>
          <svg className={styles.svgPlayStack} viewBox="0 0 140 110" aria-hidden="true">
            <rect x="18" y="28" width="90" height="58" rx="6" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
            <rect x="28" y="18" width="90" height="58" rx="6" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
            <rect x="38" y="8" width="90" height="58" rx="6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.4" />
            <path d="M72 26 L96 37 L72 48 Z" fill="currentColor" opacity="0.55" />
          </svg>
          <svg className={styles.svgBell} viewBox="0 0 40 44" aria-hidden="true">
            <path
              d="M20 4 C14 4 10 9 10 15 V22 L6 30 H34 L30 22 V15 C30 9 26 4 20 4 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path d="M16 34 C17.5 37 22.5 37 24 34" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="20" cy="4" r="2" fill="currentColor" opacity="0.7" />
          </svg>
          <div className={styles.subBars} aria-hidden="true">
            {[0.35, 0.55, 0.42, 0.78, 0.6, 0.9, 0.7].map((h, i) => (
              <span key={i} style={{ height: `${h * 100}%` }} />
            ))}
          </div>
        </div>
      </StatCard>

      <StatCard metric={videos} className={styles.cardVideos}>
        <div className={styles.decorLayer}>
          <svg className={styles.svgFilm} viewBox="0 0 220 90" aria-hidden="true">
            <rect x="4" y="10" width="212" height="70" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <g key={i}>
                <rect x={12 + i * 30} y="18" width="22" height="54" fill="currentColor" opacity={0.06 + i * 0.02} stroke="currentColor" strokeWidth="0.8" />
                <rect x={16 + i * 30} y="4" width="6" height="6" rx="1" fill="currentColor" opacity="0.35" />
                <rect x={16 + i * 30} y="80" width="6" height="6" rx="1" fill="currentColor" opacity="0.35" />
              </g>
            ))}
          </svg>
          <div className={styles.timeline} aria-hidden="true">
            <span className={styles.timelineTrack} />
            {[12, 28, 44, 61, 78, 92].map((left, i) => (
              <span key={i} className={styles.timelineMark} style={{ left: `${left}%` }} />
            ))}
            <span className={styles.timelinePlay} />
          </div>
          <p className={styles.metaChip} aria-hidden="true">
            UPLOADS · EDITS · CUTS
          </p>
        </div>
      </StatCard>

      <StatCard metric={views} className={styles.cardViews} variant="hero">
        <div className={styles.decorLayer}>
          <svg className={styles.svgSignal} viewBox="0 0 420 140" aria-hidden="true">
            <path
              data-views-path
              d="M0 98 C 40 98, 50 50, 90 50 S 140 118, 180 86 S 240 28, 280 58 S 340 110, 380 66 S 410 38, 420 38"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M0 98 C 40 98, 50 50, 90 50 S 140 118, 180 86 S 240 28, 280 58 S 340 110, 380 66 S 410 38, 420 38 L420 140 L0 140 Z"
              fill="currentColor"
              opacity="0.06"
            />
          </svg>
          <div className={styles.viewBars} aria-hidden="true">
            {[0.3, 0.45, 0.38, 0.62, 0.55, 0.8, 0.7, 0.92, 0.75, 1].map((h, i) => (
              <span key={i} style={{ height: `${h * 100}%` }} />
            ))}
          </div>
          <div className={styles.pulseDots} aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} />
            ))}
          </div>
          <p className={styles.metaChip} aria-hidden="true">
            REACH · WATCH TIME · MOMENTUM
          </p>
        </div>
      </StatCard>
    </div>
  );
}
