import styles from "./blog.module.css";

/** A single minimal autumn leaf (decorative). */
export function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M24 4C14 12 8 20 8 29a16 16 0 0 0 32 0C40 20 34 12 24 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M24 12v26M24 22l-7-5M24 22l7-5M24 30l-6-4M24 30l6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M24 38c0 3-1 5-3 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Slow, sparse falling leaves over the hero. Pure CSS animation,
 * pointer-events disabled, and fully off under prefers-reduced-motion
 * (see blog.module.css).
 */
export function FallingLeaves() {
  return (
    <div className={styles.leafField} aria-hidden="true">
      <Leaf className={`${styles.leaf} ${styles.leafOne}`} />
      <Leaf className={`${styles.leaf} ${styles.leafTwo}`} />
      <Leaf className={`${styles.leaf} ${styles.leafThree}`} />
      <Leaf className={`${styles.leaf} ${styles.leafFour}`} />
      <Leaf className={`${styles.leaf} ${styles.leafFive}`} />
    </div>
  );
}

/** Small leaf sprig used as a quiet card corner accent (replaces the cobweb). */
export function LeafSprig({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 94C30 62 58 34 94 8" />
        <path d="M28 66c-8 1-14-3-16-10 8-1 14 3 16 10ZM46 48c-8 1-14-3-16-10 8-1 14 3 16 10ZM64 31c-8 1-14-3-16-10 8-1 14 3 16 10ZM34 60c0-8 5-13 12-14 0 8-5 13-12 14ZM52 42c0-8 5-13 12-14 0 8-5 13-12 14ZM71 24c0-8 5-13 12-14 0 8-5 13-12 14Z" />
      </g>
    </svg>
  );
}

/** Wheat-sheaf line mark for the journal footer (replaces the pumpkin). */
export function WheatAccent() {
  return (
    <svg className={styles.wheatAccent} viewBox="0 0 72 72" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M36 66V30" />
        <path d="M36 30c-7 0-12-5-12-13 7 0 12 5 12 13ZM36 30c7 0 12-5 12-13-7 0-12 5-12 13ZM36 42c-7 0-12-5-12-13 7 0 12 5 12 13ZM36 42c7 0 12-5 12-13-7 0-12 5-12 13ZM36 18c-4-3-5-8-3-12 4 2 5 7 3 12ZM36 18c4-3 5-8 3-12-4 2-5 7-3 12Z" />
        <path d="M24 66c4-4 8-6 12-6s8 2 12 6" />
      </g>
    </svg>
  );
}
