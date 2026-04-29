import { defineType, defineField } from "sanity";

/**
 * 통계 항목 (homePage.stats)
 *
 * 기존 데이터셋의 _type: "statItem" 과 정확히 일치해야 한다.
 */
export const statItem = defineType({
  name: "statItem",
  title: "통계 항목",
  type: "object",
  fields: [
    defineField({
      name: "number",
      title: "숫자",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "suffix",
      title: "접미사",
      type: "string",
      description: "예: + 또는 %",
    }),
    defineField({
      name: "label",
      title: "라벨",
      type: "string",
      description: "예: 년 전문 경력",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { number: "number", suffix: "suffix", label: "label" },
    prepare: ({ number, suffix, label }) => ({
      title: `${number ?? "?"}${suffix || ""} ${label || ""}`,
    }),
  },
});
