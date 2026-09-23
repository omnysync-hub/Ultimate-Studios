import { defineArrayMember, defineField, defineType } from "sanity";
import { BodyWithWordImport } from "@/sanity/components/BodyWithWordImport";

const bodyBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "Heading 2", value: "h2" },
    { title: "Heading 3", value: "h3" },
    { title: "Quote", value: "blockquote" }
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" }
  ],
  marks: {
    decorators: [
      { title: "Bold", value: "strong" },
      { title: "Italic", value: "em" }
    ],
    annotations: [
      {
        name: "link",
        type: "object",
        title: "Link",
        fields: [
          defineField({
            name: "href",
            type: "url",
            title: "URL",
            validation: (Rule) =>
              Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] })
          })
        ]
      }
    ]
  }
});

const bodyImage = defineArrayMember({
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      type: "string",
      title: "Alt text",
      description: "Describe the image for accessibility and SEO.",
      validation: (Rule) => Rule.required()
    })
  ]
});

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  groups: [
    { name: "write", title: "Write", default: true },
    { name: "seo", title: "Google & sharing" },
    { name: "aeo", title: "Answers" },
    { name: "geo", title: "Trust & place" },
    { name: "publish", title: "Publish" }
  ],
  fields: [
    defineField({
      name: "title",
      title: "Headline",
      description: "Aim for about 50–70 characters.",
      type: "string",
      group: "write",
      validation: (Rule) => Rule.required().min(5).max(120)
    }),
    defineField({
      name: "slug",
      title: "URL name",
      description: "Auto-fills from the headline. Keep it short and readable.",
      type: "slug",
      group: "write",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "excerpt",
      title: "Card hook",
      description: "Optional 1–2 sentences for blog cards. Falls back to Google summary.",
      type: "text",
      rows: 2,
      group: "write"
    }),
    defineField({
      name: "mainImage",
      title: "Cover photo",
      type: "image",
      group: "write",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (Rule) => Rule.required()
        })
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const draft = context.document?.draft;
          if (draft === false && !value) {
            return "Add a cover photo before publishing";
          }
          return true;
        })
    }),
    defineField({
      name: "body",
      title: "Article body",
      description:
        "Write here, or use Import from Word below. Paste from Word keeps headings/bold/lists; for images, prefer Import .docx. First paragraph should answer the main question.",
      type: "array",
      group: "write",
      of: [bodyBlock, bodyImage],
      components: {
        input: BodyWithWordImport
      },
      validation: (Rule) =>
        Rule.custom((blocks, context) => {
          const draft = context.document?.draft;
          const legacy = context.document?.content;
          if (draft === false && !(blocks && Array.isArray(blocks) && blocks.length) && !legacy) {
            return "Add article body (or import from Word) before publishing";
          }
          return true;
        })
    }),
    defineField({
      name: "content",
      title: "Legacy plain text (read-only)",
      description: "Old posts only — prefer Article body above.",
      type: "text",
      rows: 6,
      group: "write",
      hidden: ({ document }) => Boolean(document?.body && Array.isArray(document.body) && document.body.length > 0),
      readOnly: true
    }),
    defineField({
      name: "tags",
      title: "Topics",
      type: "array",
      group: "write",
      of: [{ type: "string" }],
      options: { layout: "tags" }
    }),

    defineField({
      name: "seoTitle",
      title: "Google title",
      description: "Optional. Leave blank to use the headline. Max ~60 characters.",
      type: "string",
      group: "seo",
      validation: (Rule) => Rule.max(70)
    }),
    defineField({
      name: "description",
      title: "Short summary for Google",
      description: "140–160 characters. Shows in search results and social shares.",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (Rule) => Rule.required().min(80).max(180)
    }),
    defineField({
      name: "focusKeyword",
      title: "Main phrase this post is about",
      type: "string",
      group: "seo"
    }),
    defineField({
      name: "ogImage",
      title: "Custom share image",
      description: "Optional. Otherwise the cover photo is used.",
      type: "image",
      group: "seo",
      options: { hotspot: true }
    }),
    defineField({
      name: "noIndex",
      title: "Hide from Google",
      type: "boolean",
      group: "seo",
      initialValue: false
    }),

    defineField({
      name: "keyTakeaway",
      title: "One-sentence answer",
      description: "The direct answer readers (and AI) should take away. Shown under the headline.",
      type: "text",
      rows: 2,
      group: "aeo",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const draft = context.document?.draft;
          if (draft === false && !value) {
            return "Add a one-sentence answer before publishing";
          }
          return true;
        })
    }),
    defineField({
      name: "keyPoints",
      title: "What you’ll learn",
      description: "3–5 short bullets.",
      type: "array",
      group: "aeo",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(6)
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      description: "Aim for 3–5. Creates an FAQ block and rich results.",
      type: "array",
      group: "aeo",
      of: [{ type: "faqItem" }]
    }),
    defineField({
      name: "howToSteps",
      title: "How-to steps",
      description: "Only if this post is a step-by-step guide.",
      type: "array",
      group: "aeo",
      of: [{ type: "howToStep" }]
    }),

    defineField({
      name: "authorRef",
      title: "Author",
      type: "reference",
      group: "geo",
      to: [{ type: "author" }]
    }),
    defineField({
      name: "author",
      title: "Author name (fallback)",
      description: "Used if no Author is linked. Default is fine for most posts.",
      type: "string",
      group: "geo",
      initialValue: "Ultimate Cineverse Team"
    }),
    defineField({
      name: "authorRole",
      title: "Author role",
      type: "string",
      group: "geo"
    }),
    defineField({
      name: "primaryEntity",
      title: "What this is about",
      description: "e.g. film lighting, studio facility, production workflow",
      type: "string",
      group: "geo"
    }),
    defineField({
      name: "geoFocus",
      title: "City or region",
      description: "Only if the post is place-specific. Leave blank otherwise.",
      type: "string",
      group: "geo"
    }),
    defineField({
      name: "sources",
      title: "Sources",
      type: "array",
      group: "geo",
      of: [{ type: "sourceItem" }]
    }),
    defineField({
      name: "updatedNote",
      title: "What changed in this update",
      type: "text",
      rows: 2,
      group: "geo"
    }),
    defineField({
      name: "experienceNote",
      title: "First-hand note",
      description: "e.g. Based on shoots on our stages…",
      type: "text",
      rows: 2,
      group: "geo"
    }),

    defineField({
      name: "draft",
      title: "Draft (hidden from site)",
      type: "boolean",
      group: "publish",
      description: "Turn off when ready to go live.",
      initialValue: true
    }),
    defineField({
      name: "datePublished",
      title: "Published date",
      type: "date",
      group: "publish",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "dateModified",
      title: "Modified date",
      type: "date",
      group: "publish"
    }),
    defineField({
      name: "relatedPosts",
      title: "Related posts",
      description: "Pick 2–4 related stories for internal links.",
      type: "array",
      group: "publish",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      validation: (Rule) => Rule.max(4)
    }),
    defineField({
      name: "reactionUseful",
      title: "Useful reactions",
      type: "number",
      group: "publish",
      readOnly: true,
      initialValue: 0
    }),
    defineField({
      name: "reactionLove",
      title: "Love reactions",
      type: "number",
      group: "publish",
      readOnly: true,
      initialValue: 0
    }),
    defineField({
      name: "reactionFire",
      title: "Fire reactions",
      type: "number",
      group: "publish",
      readOnly: true,
      initialValue: 0
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
      media: "mainImage",
      draft: "draft"
    },
    prepare({ title, subtitle, media, draft }) {
      return {
        title: draft ? `[Draft] ${title}` : title,
        subtitle,
        media
      };
    }
  },
  orderings: [
    {
      title: "Published date, newest",
      name: "datePublishedDesc",
      by: [{ field: "datePublished", direction: "desc" }]
    }
  ]
});
