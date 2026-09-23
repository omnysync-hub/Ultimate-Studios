import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required()
    })
  ],
  preview: {
    select: { title: "question" }
  }
});

export const sourceItem = defineType({
  name: "sourceItem",
  title: "Source",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] })
    })
  ],
  preview: {
    select: { title: "title", subtitle: "url" }
  }
});

export const howToStep = defineType({
  name: "howToStep",
  title: "How-to step",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Step title",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "text",
      title: "Details",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required()
    })
  ],
  preview: {
    select: { title: "title" }
  }
});
