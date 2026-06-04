import { defineType, defineField } from "sanity";

/**
 * 알림마당 / 공지사항
 *
 * 기존 production 데이터셋의 notice 도큐먼트 필드를 그대로 반영.
 */
export const notice = defineType({
  name: "notice",
  title: "알림마당",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "제목",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "category",
      title: "카테고리",
      type: "string",
      options: {
        list: [
          { title: "공지사항", value: "공지사항" },
          { title: "법규 안내", value: "법규 안내" },
          { title: "업무 안내", value: "업무 안내" },
          { title: "기타", value: "기타" },
        ],
      },
      initialValue: "공지사항",
    }),
    defineField({
      name: "excerpt",
      title: "요약 (목록에 노출)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "content",
      title: "본문 (서식 + 이미지 삽입 가능)",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "이미지 대체 텍스트",
              type: "string",
              description: "스크린리더 / SEO 용. 이미지 설명을 짧게 적어주세요.",
            }),
            defineField({
              name: "caption",
              title: "이미지 캡션 (선택)",
              type: "string",
              description: "이미지 아래 노출되는 짧은 설명.",
            }),
          ],
        },
      ],
      description:
        "텍스트는 서식(굵게/기울임/링크)을 적용할 수 있고, [+] 버튼으로 이미지를 본문 사이에 삽입할 수도 있습니다.",
    }),
    defineField({
      name: "publishedAt",
      title: "게시일시",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isPinned",
      title: "상단 고정",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "attachments",
      title: "첨부 파일",
      type: "array",
      of: [
        {
          type: "file",
          options: {
            accept: ".pdf,.doc,.docx,.xls,.xlsx,.hwp,.hwpx,.zip",
          },
          fields: [
            defineField({
              name: "description",
              title: "파일 설명",
              type: "string",
              description: "파일 옆에 표시되는 설명 텍스트 (예: 개정안 전문.pdf)",
            }),
          ],
        },
      ],
      description: "허용 형식: PDF, Word, Excel, 한글(HWP), ZIP",
    }),
  ],
  orderings: [
    {
      title: "고정 + 최신순",
      name: "pinnedThenRecent",
      by: [
        { field: "isPinned", direction: "desc" },
        { field: "publishedAt", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      isPinned: "isPinned",
      publishedAt: "publishedAt",
    },
    prepare: ({ title, category, isPinned, publishedAt }) => ({
      title: `${isPinned ? "📌 " : ""}${title}`,
      subtitle: [category, publishedAt ? new Date(publishedAt).toLocaleDateString("ko-KR") : null]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
