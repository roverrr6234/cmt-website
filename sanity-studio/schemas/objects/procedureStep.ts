import { defineType, defineField } from "sanity";

export const procedureStep = defineType({
  name: "procedureStep",
  title: "절차 단계",
  type: "object",
  fields: [
    defineField({
      name: "step",
      title: "단계 제목",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "detail",
      title: "단계 설명",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "step", subtitle: "detail" },
  },
});
