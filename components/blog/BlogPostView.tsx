import Image from "next/image";
import Link from "next/link";
import { AdUnit } from "@/components/ads/AdUnit";
import { JsonLd } from "@/components/seo/JsonLd";
import { PostBody } from "@/components/blog/PostBody";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ShareBar } from "@/components/blog/ShareBar";
import { ReactionBar } from "@/components/blog/ReactionBar";
import { CommentSection } from "@/components/blog/CommentSection";
import { ChapterComplete } from "@/components/blog/ChapterComplete";
import {
  formatPostDate,
  getPostPlainText,
  getReadingMinutes,
  splitPostParagraphs,
  type BlogComment,
  type BlogPost
} from "@/lib/blog";
import styles from "./blog.module.css";

type Props = {
  post: BlogPost;
  related: BlogPost[];
  comments: BlogComment[];
  siteUrl: string;
  brandName: string;
};

export function BlogPostView({ post, related, comments, siteUrl, brandName }: Props) {
  const plain = getPostPlainText(post);
  const paragraphs = splitPostParagraphs(post.content || plain);
  const minutes = getReadingMinutes(post);
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const wordCount = plain.trim().split(/\s+/).filter(Boolean).length;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl }
    ]
  };

  const blogPosting: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle || post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      "@type": post.authorRole ? "Person" : "Organization",
      name: post.author,
      ...(post.authorRole ? { jobTitle: post.authorRole } : {})
    },
    publisher: {
      "@type": "Organization",
      name: brandName,
      url: siteUrl
    },
    mainEntityOfPage: postUrl,
    url: postUrl,
    wordCount,
    ...(post.keyTakeaway ? { abstract: post.keyTakeaway } : {}),
    ...(post.primaryEntity ? { about: post.primaryEntity } : {}),
    ...(post.geoFocus
      ? { contentLocation: { "@type": "Place", name: post.geoFocus } }
      : {}),
    ...(post.ogImage ? { image: [post.ogImage] } : {})
  };

  const faqLd =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer }
          }))
        }
      : null;

  const howToLd =
    post.howToSteps && post.howToSteps.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: post.title,
          description: post.description,
          step: post.howToSteps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.text
          }))
        }
      : null;

  const midAdAfter = Math.min(2, Math.max(0, paragraphs.length - 1));

  return (
    <div className={styles.page}>
      <ReadingProgress />
      <ChapterComplete slug={post.slug} />
      <div className={styles.atmosphere} aria-hidden="true" />
      <JsonLd data={breadcrumb} />
      <JsonLd data={blogPosting} />
      {faqLd ? <JsonLd data={faqLd} /> : null}
      {howToLd ? <JsonLd data={howToLd} /> : null}

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
              alt={post.coverAlt || ""}
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
              {post.keyTakeaway ? <p className={styles.takeaway}>{post.keyTakeaway}</p> : null}
              <p className={styles.articleLede}>{post.description}</p>
              <ul className={styles.metaStrip}>
                <li>
                  <strong>{formatPostDate(post.datePublished)}</strong>
                </li>
                <li>{minutes} min read</li>
                <li>
                  {post.author}
                  {post.authorRole ? ` · ${post.authorRole}` : ""}
                </li>
                {post.geoFocus ? <li>{post.geoFocus}</li> : null}
              </ul>
              {post.updatedNote ? (
                <p className={styles.updatedNote}>Updated: {post.updatedNote}</p>
              ) : null}
              <ShareBar url={postUrl} title={post.title} />
            </header>

            {post.keyPoints && post.keyPoints.length > 0 ? (
              <section className={styles.keyPoints} aria-label="Key points">
                <h2 className={styles.keyPointsTitle}>What you’ll learn</h2>
                <ul>
                  {post.keyPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {post.body?.length ? (
              <>
                <PostBody body={post.body} fallbackParagraphs={[]} />
                <div className={styles.inlineAd}>
                  <p className={styles.adLabel}>Sponsor</p>
                  <AdUnit slot="1234567890" minHeight={300} />
                </div>
              </>
            ) : (
              <div className={styles.prose}>
                {paragraphs.map((paragraph, idx) => (
                  <div key={idx}>
                    <p>{paragraph}</p>
                    {idx === midAdAfter ? (
                      <div className={styles.inlineAd}>
                        <p className={styles.adLabel}>Sponsor</p>
                        <AdUnit slot="1234567890" minHeight={300} />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            {post.howToSteps && post.howToSteps.length > 0 ? (
              <section className={styles.howTo} aria-labelledby="howto-heading">
                <h2 id="howto-heading" className={styles.engageSectionTitle}>
                  Steps
                </h2>
                <ol className={styles.howToList}>
                  {post.howToSteps.map((step, i) => (
                    <li key={`${step.title}-${i}`}>
                      <strong>{step.title}</strong>
                      <p>{step.text}</p>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {post.faqs && post.faqs.length > 0 ? (
              <section className={styles.faq} aria-labelledby="faq-heading">
                <h2 id="faq-heading" className={styles.engageSectionTitle}>
                  FAQ
                </h2>
                <dl className={styles.faqList}>
                  {post.faqs.map((f) => (
                    <div key={f.question} className={styles.faqItem}>
                      <dt>{f.question}</dt>
                      <dd>{f.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {post.sources && post.sources.length > 0 ? (
              <section className={styles.sources} aria-labelledby="sources-heading">
                <h2 id="sources-heading" className={styles.engageSectionTitle}>
                  Sources
                </h2>
                <ul className={styles.sourcesList}>
                  {post.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {post.experienceNote ? (
              <p className={styles.experienceNote}>{post.experienceNote}</p>
            ) : null}

            <ReactionBar
              slug={post.slug}
              useful={post.reactionUseful || 0}
              love={post.reactionLove || 0}
              fire={post.reactionFire || 0}
            />

            <CommentSection slug={post.slug} initialComments={comments} />

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
