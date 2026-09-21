import Image from "next/image";
import Link from "next/link";
import { AdUnit } from "@/components/ads/AdUnit";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  formatPostDate,
  getReadingMinutes,
  splitPostParagraphs,
  type BlogPost
} from "@/lib/blog";
import styles from "./blog.module.css";

type Props = {
  post: BlogPost;
  related: BlogPost[];
  siteUrl: string;
  brandName: string;
};

export function BlogPostView({ post, related, siteUrl, brandName }: Props) {
  const paragraphs = splitPostParagraphs(post.content);
  const minutes = getReadingMinutes(post.content);
  const inlineAdAfter = Math.min(2, Math.max(0, paragraphs.length - 1));
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl }
    ]
  };

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      "@type": "Organization",
      name: post.author
    },
    publisher: {
      "@type": "Organization",
      name: brandName,
      url: siteUrl
    },
    mainEntityOfPage: postUrl,
    url: postUrl,
    wordCount: post.content.trim().split(/\s+/).filter(Boolean).length,
    ...(post.ogImage ? { image: [post.ogImage] } : {})
  };

  return (
    <div className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <JsonLd data={breadcrumb} />
      <JsonLd data={blogPosting} />

      <div className={styles.shell}>
        <Link href="/blog" className={styles.backLink}>
          <span className={styles.backArrow} aria-hidden="true">
            ←
          </span>
          Back to Blogs
        </Link>

        {post.ogImage ? (
          <div className={styles.coverHero}>
            <Image
              src={post.ogImage}
              alt=""
              fill
              priority
              sizes="(max-width: 1240px) 100vw, 1240px"
              className={styles.coverHeroImg}
            />
          </div>
        ) : null}

        <div className={styles.articleLayout}>
          <article>
            <nav aria-label="Breadcrumb">
              <ol className={styles.breadcrumb}>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li className={styles.crumbSep} aria-hidden="true">
                  /
                </li>
                <li>
                  <Link href="/blog">Blogs</Link>
                </li>
                <li className={styles.crumbSep} aria-hidden="true">
                  /
                </li>
                <li aria-current="page">Article</li>
              </ol>
            </nav>

            <header className={styles.articleHeader}>
              <div className={styles.eyebrowRow}>
                <span className={styles.redTick} aria-hidden="true" />
                <p className={styles.eyebrow}>Blog</p>
              </div>
              <ul className={styles.entryTags} aria-label="Topics">
                {post.tags.map((tag) => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
              <h1 className={styles.articleTitle}>{post.title}</h1>
              <p className={styles.articleLede}>{post.description}</p>
              <ul className={styles.metaStrip}>
                <li>
                  <strong>{formatPostDate(post.datePublished)}</strong>
                </li>
                <li>{minutes} min read</li>
                <li>{post.author}</li>
              </ul>
            </header>

            <div className={styles.prose}>
              {paragraphs.map((paragraph, idx) => {
                const shouldInsertInlineAd = idx === inlineAdAfter;
                return (
                  <div key={idx}>
                    <p>{paragraph}</p>
                    {shouldInsertInlineAd ? (
                      <div className={styles.inlineAd}>
                        <p className={styles.adLabel}>Sponsor</p>
                        <AdUnit slot="1234567890" minHeight={300} />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <section className={styles.related} aria-labelledby="related-heading">
              <h2 id="related-heading" className={styles.relatedTitle}>
                More stories
              </h2>
              <ul className={styles.relatedList}>
                {related.map((item, i) => (
                  <li key={item.slug}>
                    <Link href={`/blog/${item.slug}`} className={styles.relatedLink}>
                      <span className={styles.relatedIndex}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.relatedName}>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </article>

          <aside className={styles.sidebar} aria-label="Sponsored">
            <div className={styles.sponsorPanel}>
              <p className={styles.sponsorEyebrow}>Sponsor</p>
              <AdUnit slot="1234567890" minHeight={250} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
