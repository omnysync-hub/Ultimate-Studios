import styles from "./DominationSection.module.css";

export function DominationIntro() {
  return (
    <header className={styles.intro} data-dom-intro>
      <h2 className={styles.headline} id="dominating-heading">
        {/* Red row ← from right, then DOMINATING (cream on red) */}
        <span className={`${styles.titleRow} ${styles.titleRowRed}`} data-title-row="red">
          <span className={styles.rowFill} data-row-fill="red" aria-hidden="true" />
          <span className={`${styles.rowText} ${styles.rowTextOnRed}`} data-row-text="red">
            DOMINATING
          </span>
        </span>

        {/* White row → from left, then SINCE 2020 (ink on white) */}
        <span className={`${styles.titleRow} ${styles.titleRowWhite}`} data-title-row="white">
          <span className={styles.rowFill} data-row-fill="white" aria-hidden="true" />
          <span className={`${styles.rowText} ${styles.rowTextOnWhite}`} data-row-text="white">
            SINCE 2020.
          </span>
        </span>
      </h2>
    </header>
  );
}
