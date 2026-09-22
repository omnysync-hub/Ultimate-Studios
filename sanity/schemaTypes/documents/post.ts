import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().min(5).max(120)
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(80).max(180)
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "Ultimate Cineverse Team"
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" }
    }),
    defineField({
      name: "mainImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (Rule) => Rule.required()
        })
      ]
    }),
    defineField({
      name: "datePublished",
      title: "Published date",
      type: "date",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "dateModified",
      title: "Modified date",
      type: "date"
    }),
    defineField({
      name: "content",
      title: "Body",
      description: "Use blank lines between paragraphs (matches the Next.js blog renderer).",
      type: "text",
      rows: 20,
      validation: (Rule) => Rule.required().min(300)
    }),
    defineField({
      name: "draft",
      title: "Draft",
      type: "boolean",
      description: "Hidden from the public blog and sitemap when enabled.",
      initialValue: false
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
