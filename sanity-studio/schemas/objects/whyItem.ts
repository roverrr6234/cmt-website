import { defineType, defineField } from "sanity";

/**
 * Why Choose 항목 (homePage.whyChooseItems)
 *
 * 기존 데이터셋의 _type: "whyItem" 과 정확히 일치해야 한다.
 */
export const whyItem = defineType({
  name: "whyItem",
  title: "선택 이유 항목",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "제목",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "설명",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
