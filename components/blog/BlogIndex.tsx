"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AdUnit } from "@/components/ads/AdUnit";
import { getReadingMinutes, type BlogPost } from "@/lib/blog";
import styles from "./blog.module.css";

const FILTER_ALL = "All";

function yearOf(iso: string) {
  const y = new Date(iso).getFullYear();
  return Number.isNaN(y) ? "" : String(y);
}

function posterTone(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h + slug.charCodeAt(i) * (i + 1)) % 360;
  const hue = [8, 18, 28, 195, 205, 215, 0][h % 7];
  return `linear-gradient(145deg, hsl(${hue} 42% 22%) 0%, hsl(${hue} 28% 8%) 55%, #050505 100%)`;
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
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`${styles.featureCard} ${accent ? styles.featureCardAlt : ""}`}
    >
      <div className={styles.featureMedia} aria-hidden="true">
        {post.ogImage ? (
          <Image
            src={post.ogImage}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.featureImg}
            priority
          />
        ) : (
          <div className={styles.featureFallback} style={{ background: posterTone(post.slug) }} />
        )}
        <div className={styles.featureScrim} />
      </div>
      <div className={styles.featureCopy}>
        <p className={styles.featureEyebrow}>
          {post.tags[0] || "Blogs"} · {minutes} min
        </p>
        <h2 className={styles.featureTitle}>{post.title}</h2>
        <p className={styles.featureDesc}>{post.description}</p>
        <span className={styles.playBtn}>
          <span className={styles.playIcon} aria-hidden="true">
            ▶
          </span>
          Read article
        </span>
      </div>
    </Link>
  );
}

function PosterCard({ post }: { post: BlogPost }) {
  const minutes = getReadingMinutes(post.content);
  const year = yearOf(post.datePublished);

  return (
    <Link href={`/blog/${post.slug}`} className={styles.poster}>
      <div className={styles.posterArt} aria-hidden="true">
        {post.ogImage ? (
          <Image
            src={post.ogImage}
            alt=""
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1100px) 30vw, 220px"
            className={styles.posterImg}
          />
        ) : (
          <div className={styles.posterFallback} style={{ background: posterTone(post.slug) }}>
            <Image
              src="/logo.png"
              alt=""
              width={48}
              height={48}
              className={styles.posterLogo}
            />
          </div>
        )}
      </div>
      <h3 className={styles.posterTitle}>{post.title}</h3>
      <p className={styles.posterMeta}>
        <span className={styles.posterStat} aria-label={`${minutes} minute read`}>
          ★ {minutes} min
        </span>
        {year ? <span className={styles.posterYear}>{year}</span> : null}
      </p>
    </Link>
  );
}

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const tags = useMemo(() => uniqueTags(posts), [posts]);
  const [filter, setFilter] = useState(FILTER_ALL);

  const filtered = useMemo(() => {
    if (filter === FILTER_ALL) return posts;
    const needle = filter.toLowerCase();
    return posts.filter((p) => p.tags.some((t) => t.toLowerCase() === needle));
  }, [posts, filter]);

  const featured = filtered.slice(0, 2);
  const gridPosts = filtered.length > 2 ? filtered.slice(2) : filtered;
  const blogLabel = posts.length === 1 ? "total blog" : "total blogs";

  return (
    <div className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <main className={styles.shell}>
        <header className={styles.topBar}>
          <div className={styles.brandBlock}>
            <div className={styles.brandRow}>
              <Image
                src="/logo.png"
                alt=""
                width={36}
                height={36}
                className={styles.brandLogo}
                priority
              />
              <div>
                <p className={styles.brandKicker}>Ultimate Cineverse</p>
                <h1 className={styles.pageTitle}>Blogs</h1>
              </div>
            </div>
          </div>

          <nav className={styles.capsuleNav} aria-label="Blog sections">
            <a href="#featured" className={styles.capsuleLink}>
              <span className={styles.capsuleIcon} aria-hidden="true">
                ★
              </span>
              Featured
            </a>
            <a href="#topics" className={styles.capsuleLink}>
              <span className={styles.capsuleIcon} aria-hidden="true">
                ◆
              </span>
              Topics
            </a>
            <a href="#library" className={styles.capsuleLink}>
              <span className={styles.capsuleIcon} aria-hidden="true">
                ▦
              </span>
              Library
            </a>
            <Link href="/about" className={styles.capsuleLink}>
              About
            </Link>
            <Link href="/contact" className={`${styles.capsuleLink} ${styles.capsuleLinkAccent}`}>
              Contact
            </Link>
          </nav>

          <p className={styles.topMeta}>
            <strong>{posts.length}</strong> {blogLabel}
          </p>
        </header>

        {posts.length === 0 ? (
          <div className={styles.empty}>
            <h2>No blogs yet</h2>
            <p>Publish a Blog Post in Sanity Studio (Draft off) to fill this section.</p>
          </div>
        ) : (
          <>
            <section id="featured" className={styles.featured} aria-label="Featured blogs">
              {featured.map((post, i) => (
                <FeaturedCard key={post.slug} post={post} accent={i === 1} />
              ))}
            </section>

            <div id="topics" className={styles.filterRow} role="tablist" aria-label="Topics">
              <button
                type="button"
                role="tab"
                aria-selected={filter === FILTER_ALL}
                className={`${styles.filterPill} ${filter === FILTER_ALL ? styles.filterPillActive : ""}`}
                onClick={() => setFilter(FILTER_ALL)}
              >
                <span aria-hidden="true">✦</span> All blogs
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  role="tab"
                  aria-selected={filter === tag}
                  className={`${styles.filterPill} ${filter === tag ? styles.filterPillActive : ""}`}
                  onClick={() => setFilter(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            <section id="library" className={styles.library} aria-labelledby="library-heading">
              <div className={styles.libraryHead}>
                <h2 id="library-heading" className={styles.libraryTitle}>
                  {filter === FILTER_ALL ? "Latest blogs" : `Blogs in ${filter}`}
                </h2>
                <p className={styles.libraryCount}>
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
      </main>
    </div>
  );
}
