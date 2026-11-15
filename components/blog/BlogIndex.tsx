"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FallingLeaves, LeafSprig, WheatAccent } from "@/components/blog/ThanksgivingDetails";
import { ThanksgivingCountdown } from "@/components/blog/ThanksgivingCountdown";
import { GratitudeWall } from "@/components/blog/GratitudeWall";
import { AdUnit } from "@/components/ads/AdUnit";
import { BLOG_FAQS } from "@/lib/blog-faqs";
import { getReadingMinutes, type BlogPost } from "@/lib/blog";
import styles from "./blog.module.css";

const FILTER_ALL = "All";

/** Thanksgiving watch moods — each one runs a real search over the library. */
const MOODS = [
  { id: "family", label: "Whole family, one screen", query: "family", hint: "All-ages picks everyone can share" },
  { id: "classic", label: "Cozy & classic", query: "classic", hint: "Comfort films and beloved re-watches" },
  { id: "comedy", label: "Make us laugh", query: "comedy", hint: "Big laughs for after the feast" },
  { id: "food", label: "Food, glorious food", query: "food", hint: "Films to cook and feast along with" },
  { id: "drama", label: "A grateful heart", query: "drama", hint: "Warm, moving stories about family" },
  { id: "thanksgiving", label: "Set on Thanksgiving", query: "thanksgiving", hint: "Stories that unfold over the holiday" }
] as const;

type Mood = (typeof MOODS)[number];

function yearOf(iso: string) {
  const y = new Date(iso).getFullYear();
  return Number.isNaN(y) ? "" : String(y);
}

function posterTone(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h + slug.charCodeAt(i) * (i + 1)) % 360;
  // Harvest palette: pumpkin, cranberry, gold, sage, warm bark
  const hue = [26, 12, 38, 74, 18, 32, 8][h % 7];
  return `linear-gradient(145deg, hsl(${hue} 52% 30%) 0%, hsl(${hue} 42% 13%) 55%, #17100b 100%)`;
}

function uniqueTags(posts: BlogPost[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of posts) {
    for (const t of p.tags) {
      const key = t.trim();
      if (!key || seen.has(key.toLowerCase())) continue;
      seen.add(key.toLowerCase());
      out.push(key);
    }
  }
  return out.slice(0, 10);
}

function FeaturedCard({ post, accent }: { post: BlogPost; accent?: boolean }) {
  const minutes = getReadingMinutes(post.content);
  const imageSrc = post.coverImage || post.ogImage;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`${styles.featureCard} ${accent ? styles.featureCardAlt : ""}`}
      aria-label={`Read: ${post.title}`}
    >
      <div className={styles.featureMedia} aria-hidden="true">
        {imageSrc ? (
          <Image src={imageSrc} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.featureImg} />
        ) : (
          <div className={styles.featureFallback} style={{ background: posterTone(post.slug) }} />
        )}
        <div className={styles.featureScrim} />
        <LeafSprig className={styles.cardLeaf} />
      </div>
      <div className={styles.featureCopy}>
        <p className={styles.featureEyebrow}>
          {post.tags[0] || "Thanksgiving"} · {minutes} min read
        </p>
        <h3 className={styles.featureTitle}>{post.title}</h3>
        <p className={styles.featureDesc}>{post.description}</p>
        <span className={styles.playBtn}>
          <span className={styles.playIcon} aria-hidden="true">↗</span>
          Read story
        </span>
      </div>
    </Link>
  );
}

function PosterCard({ post }: { post: BlogPost }) {
  const minutes = getReadingMinutes(post.content);
  const year = yearOf(post.datePublished);
  const imageSrc = post.coverImage || post.ogImage;

  return (
    <Link href={`/blog/${post.slug}`} className={styles.poster} aria-label={`Read: ${post.title}`}>
      <div className={styles.posterArt} aria-hidden="true">
        {imageSrc ? (
          <>
            <Image src={imageSrc} alt="" fill aria-hidden="true" sizes="(max-width: 640px) 45vw, (max-width: 1100px) 30vw, 220px" className={styles.posterImgBackdrop} />
            <Image src={imageSrc} alt="" fill sizes="(max-width: 640px) 45vw, (max-width: 1100px) 30vw, 220px" className={styles.posterImg} />
          </>
        ) : (
          <div className={styles.posterFallback} style={{ background: posterTone(post.slug) }}>
            <Image src="/logo.png" alt="" width={48} height={48} className={styles.posterLogo} />
          </div>
        )}
      </div>
      <h3 className={styles.posterTitle}>{post.title}</h3>
      <p className={styles.posterMeta}>
        <span className={styles.posterStat} aria-label={`${minutes} minute read`}>★ {minutes} min</span>
        {year ? <span className={styles.posterYear}>{year}</span> : null}
      </p>
    </Link>
  );
}

export function BlogIndex({ posts, initialQuery = "" }: { posts: BlogPost[]; initialQuery?: string }) {
  const tags = useMemo(() => uniqueTags(posts).filter((tag) => tag.toLowerCase() !== FILTER_ALL.toLowerCase()), [posts]);
  const [filter, setFilter] = useState(FILTER_ALL);
  const [query, setQuery] = useState(initialQuery);
  const [mood, setMood] = useState<Mood | null>(null);

  const filtered = useMemo(() => {
    const tagNeedle = filter === FILTER_ALL ? "" : filter.toLowerCase();
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (tagNeedle && !p.tags.some((t) => t.toLowerCase() === tagNeedle)) return false;
      if (!q) return true;
      const hay = `${p.title} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [posts, filter, query]);

  const featured = filtered.length > 2 ? filtered.slice(0, 2) : [];
  const gridPosts = filtered.slice(featured.length);
  const blogLabel = posts.length === 1 ? "story to gather around" : "stories to gather around";

  const pickMood = (m: Mood) => {
    setMood(m);
    setFilter(FILTER_ALL);
    setQuery(m.query);
    document.getElementById("library")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <main className={styles.shell}>
        <header className={styles.seasonHero}>
          <div className={styles.seasonArtwork} aria-hidden="true" />
          <FallingLeaves />
          <div className={styles.seasonMasthead}>
            <p className={styles.brandKicker}>Ultimate Cineverse / The Thanksgiving edit</p>
            <span className={styles.seasonIssue}>Thu · Nov 26, 2026</span>
          </div>
          <div className={styles.seasonIntro}>
            <p className={styles.seasonOverline}><span aria-hidden="true">✦</span> For the films that bring us home</p>
            <h1 className={styles.seasonTitle}>Gather. Watch.<br /><span>Give thanks.</span></h1>
            <p className={styles.seasonDescription}>
              Thanksgiving movie guides, family film picks, and stories worth passing
              around the table — plus the reviews and streaming guides to plan your
              whole holiday weekend.
            </p>
            <div className={styles.heroActions}>
              <a href="#picker" className={styles.seasonCta}>
                Find tonight&rsquo;s film <span aria-hidden="true">↓</span>
              </a>
              <ThanksgivingCountdown />
            </div>
          </div>
          <div className={styles.seasonFoot}>
            <span>Family. Feasts. Films we return to.</span>
            <span>{posts.length} {blogLabel}</span>
          </div>
        </header>

        <section id="picker" className={styles.picker} aria-labelledby="picker-heading">
          <p className={styles.brandKicker}>The Thanksgiving watch picker</p>
          <h2 id="picker-heading" className={styles.pickerTitle}>Who&rsquo;s at your table tonight?</h2>
          <p className={styles.pickerCopy}>Pick a mood — we&rsquo;ll set the table with matching stories from the library.</p>
          <div className={styles.pickerGrid} role="group" aria-label="Choose a Thanksgiving watch mood">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`${styles.moodCard} ${mood?.id === m.id ? styles.moodCardActive : ""}`}
                aria-pressed={mood?.id === m.id}
                onClick={() => pickMood(m)}
              >
                <span className={styles.moodLabel}>{m.label}</span>
                <span className={styles.moodHint}>{m.hint}</span>
              </button>
            ))}
          </div>
          {mood ? (
            <p className={styles.pickerNote} role="status">
              Showing <strong>{mood.label.toLowerCase()}</strong> picks below —{" "}
              <button type="button" className={styles.clearSearch} onClick={() => { setMood(null); setQuery(""); }}>
                clear the picker
              </button>
            </p>
          ) : null}
        </section>

        <div className={styles.browseBar}>
          <div>
            <p className={styles.brandKicker}>The reading room</p>
            <h2 className={styles.browseTitle}>Stories to pass around.</h2>
          </div>
          <label className={styles.blogSearch}>
            <span>Search the stories</span>
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setMood(null); }}
              placeholder="A film, a mood, a story…"
              aria-controls="library"
            />
          </label>
        </div>

        <div id="topics" className={styles.filterRow} role="group" aria-label="Filter stories by topic">
          {[FILTER_ALL, ...tags].map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={filter === tag}
              aria-controls="library"
              className={`${styles.filterPill} ${filter === tag ? styles.filterPillActive : ""}`}
              onClick={() => setFilter(tag)}
            >
              {tag === FILTER_ALL ? "All stories" : tag}
            </button>
          ))}
        </div>

        {query ? (
          <p className={styles.searchNote} role="status">
            Showing results for <strong>&ldquo;{query}&rdquo;</strong>{" · "}
            <button type="button" className={styles.clearSearch} onClick={() => { setQuery(""); setMood(null); }}>
              Clear
            </button>
          </p>
        ) : null}

        <div id="library" className={styles.storyResults}>
          {posts.length === 0 ? (
            <div className={styles.empty} role="status">
              <h2>The next story is on its way home</h2>
              <p>Check back for new film stories and Thanksgiving reads.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty} role="status">
              <h2>No matches at this table</h2>
              <p>Try another search or clear the filter — there is always room for one more story.</p>
              <button
                type="button"
                className={styles.resetSearch}
                onClick={() => { setQuery(""); setFilter(FILTER_ALL); setMood(null); }}
              >
                Show all stories
              </button>
            </div>
          ) : (
            <>
              {featured.length > 0 ? (
                <section id="featured" className={styles.featured} aria-label="Featured Thanksgiving reads">
                  {featured.map((post, i) => (
                    <FeaturedCard key={post.slug} post={post} accent={i === 1} />
                  ))}
                </section>
              ) : null}

              <section className={styles.library} aria-labelledby="library-heading">
                <div className={styles.libraryHead}>
                  <h2 id="library-heading" className={styles.libraryTitle}>
                    {filter === FILTER_ALL ? "Latest stories" : `${filter} stories`}
                  </h2>
                  <p className={styles.libraryCount} role="status">
                    {filtered.length} {filtered.length === 1 ? "post" : "posts"}
                  </p>
                </div>

                <ul className={styles.posterGrid}>
                  {gridPosts.map((post, idx) => {
                    const shouldInsertAd = (idx + 1) % 6 === 0;
                    return (
                      <li key={post.slug} className={styles.posterCell}>
                        <PosterCard post={post} />
                        {shouldInsertAd ? (
                          <div className={styles.adSlot}>
                            <p className={styles.adLabel}>Sponsor</p>
                            <AdUnit slot="1234567890" minHeight={220} />
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </section>
            </>
          )}
        </div>

        <GratitudeWall />

        <section className={styles.faqSection} aria-labelledby="faq-heading">
          <p className={styles.brandKicker}>Thanksgiving watching, answered</p>
          <h2 id="faq-heading" className={styles.faqTitle}>Questions every table asks</h2>
          <div className={styles.faqGrid}>
            {BLOG_FAQS.map((faq) => (
              <details key={faq.question} className={styles.faqCard}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className={styles.faqMore}>
            Planning the whole weekend? Start with our{" "}
            <Link href="/blog?q=thanksgiving">Thanksgiving stories</Link>, browse{" "}
            <Link href="/blog#topics">all topics</Link>, or learn more{" "}
            <Link href="/about">about Ultimate Cineverse</Link>.
          </p>
        </section>

        <footer className={styles.journalFooter}>
          <WheatAccent />
          <p>Come hungry. <span>Leave grateful.</span></p>
          <Link href="/">Back to Ultimate Cineverse <span aria-hidden="true">↗</span></Link>
        </footer>
      </main>
    </div>
  );
}
