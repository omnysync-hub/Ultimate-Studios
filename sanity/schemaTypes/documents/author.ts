import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "role",
      title: "Role",
      description: "e.g. Studio producer, Editor",
      type: "string"
    }),
    defineField({
      name: "bio",
      title: "Short bio",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true }
    })
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" }
  }
});
