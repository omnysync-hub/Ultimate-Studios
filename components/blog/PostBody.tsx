"use client";

import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { urlForImage } from "@/lib/sanity/image";
import styles from "./blog.module.css";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className={styles.proseH2}>{children}</h2>,
    h3: ({ children }) => <h3 className={styles.proseH3}>{children}</h3>,
    blockquote: ({ children }) => <blockquote className={styles.proseQuote}>{children}</blockquote>,
    normal: ({ children }) => <p>{children}</p>
  },
  list: {
    bullet: ({ children }) => <ul className={styles.proseList}>{children}</ul>,
    number: ({ children }) => <ol className={styles.proseList}>{children}</ol>
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const external = href.startsWith("http");
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    }
  },
  types: {
    image: ({ value }) => {
      const alt = value?.alt || "";
      let src: string | undefined;
      try {
        src = urlForImage(value)?.width(1200).url();
      } catch {
        src = undefined;
      }
      if (!src) return null;
      return (
        <figure className={styles.proseFigure}>
          <div className={styles.proseFigureFrame}>
            <Image src={src} alt={alt} fill sizes="(max-width: 800px) 100vw, 720px" className={styles.proseFigureImg} />
          </div>
          {alt ? <figcaption className={styles.proseFigcaption}>{alt}</figcaption> : null}
        </figure>
      );
    }
  }
};

export function PostBody({
  body,
  fallbackParagraphs
}: {
  body?: PortableTextBlock[];
  fallbackParagraphs: string[];
}) {
  if (body?.length) {
    return (
      <div className={styles.prose}>
        <PortableText value={body} components={components} />
      </div>
    );
  }

  return (
    <div className={styles.prose}>
      {fallbackParagraphs.map((paragraph, idx) => (
        <p key={idx}>{paragraph}</p>
      ))}
    </div>
  );
}
