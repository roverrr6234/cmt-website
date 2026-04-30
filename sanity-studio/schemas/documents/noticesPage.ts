import { defineType, defineField } from "sanity";

/**
 * 알림마당 페이지 (싱글톤)
 *
 * /notices 페이지 상단 Hero / 카테고리 라벨 / 빈 상태 텍스트.
 * 실제 공지사항 항목은 별도의 notice 도큐먼트들에서 관리한다.
 */
export const noticesPage = defineType({
  name: "noticesPage",
  title: "알림마당 페이지",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "labels", title: "카테고리 / 빈 상태" },
  ],
  fields: [
    /* ── Hero ── */
    defineField({ name: "heroTitle", title: "Hero 제목", type: "string", group: "hero" }),
    defineField({
      name: "heroDescription",
      title: "Hero 설명",
      type: "text",
      rows: 3,
      group: "hero",
    }),

    /* ── 카테고리 / 빈 상태 ── */
    defineField({
      name: "categoryAllLabel",
      title: '"전체" 카테고리 라벨',
      type: "string",
      group: "labels",
    }),
    defineField({
      name: "emptyStateText",
      title: "공지사항이 없을 때 표시 텍스트",
      type: "string",
      group: "labels",
    }),
  ],
  preview: {
    prepare: () => ({ title: "📢 알림마당 페이지" }),
  },
});
