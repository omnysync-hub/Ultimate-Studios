import { dominationClosers } from "@/lib/domination";
import styles from "./DominationSection.module.css";

export function ClosingStatements() {
  return (
    <div className={styles.closers} data-closers>
      {dominationClosers.map((line) => (
        <p key={line} className={styles.closer} data-closer>
          <span>{line}</span>
        </p>
      ))}
    </div>
  );
}
