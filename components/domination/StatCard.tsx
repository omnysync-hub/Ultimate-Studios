import type { StatMetric } from "@/lib/domination";
import styles from "./DominationSection.module.css";

type Props = {
  metric: StatMetric;
  className?: string;
  variant?: "default" | "hero";
  children?: React.ReactNode;
};

export function StatCard({ metric, className = "", variant = "default", children }: Props) {
  return (
    <article
      className={`${styles.card} ${variant === "hero" ? styles.cardHero : ""} ${className}`}
      data-stat-card
      data-stat={metric.id}
    >
      <div className={styles.cardDecor} aria-hidden="true">
        {children}
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardValue}>
          <span
            data-stat-value
            data-target={metric.target}
            data-suffix={metric.suffix}
            data-decimals={metric.decimals ?? 0}
            data-format={metric.format ?? "compact"}
          >
            0{metric.suffix}
          </span>
        </p>
        <h3 className={styles.cardLabel}>{metric.label}</h3>
        <p className={styles.cardDesc}>{metric.description}</p>
      </div>
    </article>
  );
}
