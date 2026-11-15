"use client";

import { useEffect, useState } from "react";
import styles from "./blog.module.css";

const STORAGE_KEY = "uc-gratitude-note";
const MAX_LEN = 90;

const SEED_NOTES = [
  "Grateful for films that bring the whole table together.",
  "Thankful for one more story night with family.",
  "Grateful for the cook, the critic and the dishwasher."
];

/**
 * A small, warm interactive: visitors leave one line of thanks.
 * Their note is kept only in their own browser (localStorage) —
 * no account, no server, no tracking.
 */
export function GratitudeWall() {
  const [draft, setDraft] = useState("");
  const [mine, setMine] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      if (v) setMine(v);
    } catch {
      /* private mode — the wall still works for this visit */
    }
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const note = draft.trim().slice(0, MAX_LEN);
    if (!note) return;
    setMine(note);
    setDraft("");
    setSaved(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, note);
    } catch {
      /* ignore */
    }
  };

  const notes = mine ? [mine, ...SEED_NOTES] : SEED_NOTES;

  return (
    <section className={styles.gratitude} aria-labelledby="gratitude-heading">
      <div className={styles.gratitudeHead}>
        <p className={styles.brandKicker}>The gratitude wall</p>
        <h2 id="gratitude-heading" className={styles.gratitudeTitle}>One line of thanks, before the film starts.</h2>
        <p className={styles.gratitudeCopy}>
          Add yours — it stays on this device, pinned next to ours.
        </p>
      </div>

      <ul className={styles.gratitudeNotes}>
        {notes.map((note, i) => (
          <li key={`${note}-${i}`} className={`${styles.gratitudeNote} ${mine && i === 0 ? styles.gratitudeNoteMine : ""}`}>
            <span aria-hidden="true">✦</span> {note}
            {mine && i === 0 ? <em> — yours</em> : null}
          </li>
        ))}
      </ul>

      <form className={styles.gratitudeForm} onSubmit={submit}>
        <label className={styles.gratitudeLabel} htmlFor="gratitude-input">
          I am thankful for…
        </label>
        <div className={styles.gratitudeRow}>
          <input
            id="gratitude-input"
            type="text"
            value={draft}
            maxLength={MAX_LEN}
            onChange={(e) => {
              setDraft(e.target.value);
              setSaved(false);
            }}
            placeholder="a film, a person, a second helping…"
            autoComplete="off"
          />
          <button type="submit" className={styles.gratitudeBtn}>Pin it</button>
        </div>
        <p className={styles.gratitudeHint} role="status">
          {saved ? "Pinned. Happy Thanksgiving." : `${MAX_LEN - draft.length} characters left · saved only in your browser`}
        </p>
      </form>
    </section>
  );
}
