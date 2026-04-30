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
    { name: "messages", title: "메시지 / 첨부파일 라벨" },
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

    /* ── 메시지 / 첨부파일 라벨 (추가) ── */
    defineField({
      name: "loadingErrorText",
      title: "로딩 에러 메시지",
      type: "string",
      description: '예: "데이터를 불러오는 중 오류가 발생했습니다."',
      group: "messages",
    }),
    defineField({
      name: "cachedDataNote",
      title: "캐시 안내 문구 (에러 메시지 옆)",
      type: "string",
      description: '예: "(캐시된 데이터를 표시합니다)"',
      group: "messages",
    }),
    defineField({
      name: "retryButtonText",
      title: "재시도 버튼 텍스트",
      type: "string",
      description: '예: "재시도"',
      group: "messages",
    }),
    defineField({
      name: "attachmentsLabel",
      title: "첨부파일 섹션 제목",
      type: "string",
      description: '예: "첨부파일"',
      group: "messages",
    }),
    defineField({
      name: "fileDownloadDefaultText",
      title: "첨부파일 기본 표시명",
      type: "string",
      description: '파일에 설명이 없을 때 사용. 예: "파일 다운로드"',
      group: "messages",
    }),
  ],
  preview: {
    prepare: () => ({ title: "📢 알림마당 페이지" }),
  },
});
