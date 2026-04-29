import { defineType, defineField } from "sanity";

/**
 * 푸터 바로가기 링크 (siteFooter.quickLinks)
 */
export const quickLink = defineType({
  name: "quickLink",
  title: "바로가기 링크",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "표시 텍스트",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "링크 (URL 또는 내부 경로)",
      type: "string",
      description: "예: /contact, https://example.com",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isExternal",
      title: "외부 링크 (새 탭에서 열기)",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "link" },
  },
});
