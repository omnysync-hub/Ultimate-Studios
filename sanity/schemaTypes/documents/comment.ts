import { defineField, defineType } from "sanity";

export const comment = defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    defineField({
      name: "post",
      title: "Post",
      type: "reference",
      to: [{ type: "post" }],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "name",
      title: "Reader name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80)
    }),
    defineField({
      name: "email",
      title: "Email (private)",
      description: "Never shown on the site — for spam checks only.",
      type: "string"
    }),
    defineField({
      name: "body",
      title: "Comment",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(3).max(2000)
    }),
    defineField({
      name: "approved",
      title: "Approved (visible on site)",
      type: "boolean",
      initialValue: false
    }),
    defineField({
      name: "createdAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true
    })
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "body",
      approved: "approved"
    },
    prepare({ title, subtitle, approved }) {
      return {
        title: `${approved ? "✓" : "⏳"} ${title}`,
        subtitle: typeof subtitle === "string" ? subtitle.slice(0, 80) : ""
      };
    }
  },
  orderings: [
    {
      title: "Newest",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }]
    }
  ]
});
