import { defineType, defineField } from "sanity";

/**
 * 알림마당 페이지 라벨 (싱글톤)
 *
 * /notices 페이지의 제목/카테고리 'all' 라벨/로딩·에러 메시지/페이지네이션 버튼 등
 * UI 라벨만 모은 도큐먼트. 실제 공지글은 별도 'notice' 도큐먼트에서 관리.
 */
export const noticesPage = defineType({
  name: "noticesPage",
  title: "알림마당 페이지(라벨)",
  type: "document",
  groups: [
    { name: "hero", title: "상단 배너", default: true },
    { name: "filters", title: "카테고리/필터" },
    { name: "messages", title: "로딩/에러 메시지" },
    { name: "items", title: "공지글 표시" },
    { name: "pagination", title: "페이지네이션" },
  ],
  fields: [
    defineField({
      name: "pageTitle",
      title: "페이지 제목",
      type: "string",
      group: "hero",
      description: "예: 알림마당",
    }),
    defineField({
      name: "pageDescription",
      title: "페이지 부제",
      type: "text",
      rows: 2,
      group: "hero",
    }),

    defineField({
      name: "categoryAllLabel",
      title: "'전체' 카테고리 버튼 라벨",
      type: "string",
      group: "filters",
      description: "기본값: 전체",
    }),

    defineField({
      name: "loadingText",
      title: "로딩 중 텍스트",
      type: "string",
      group: "messages",
    }),
    defineField({
      name: "errorText",
      title: "오류 발생 텍스트",
      type: "string",
      group: "messages",
    }),
    defineField({
      name: "cachedDataNote",
      title: "캐시 데이터 사용 안내",
      type: "string",
      group: "messages",
      description: "Sanity 호출 실패 시 fallback 데이터를 보여줄 때의 안내 문구.",
    }),
    defineField({
      name: "retryButtonText",
      title: "다시 시도 버튼 텍스트",
      type: "string",
      group: "messages",
    }),

    defineField({
      name: "pinnedBadgeText",
      title: "상단 고정 뱃지 텍스트",
      type: "string",
      group: "items",
      description: "예: 상단 고정",
    }),
    defineField({
      name: "attachmentsLabel",
      title: "첨부파일 섹션 라벨",
      type: "string",
      group: "items",
      description: "예: 첨부파일",
    }),
    defineField({
      name: "fileDownloadDefaultText",
      title: "파일 다운로드 기본 텍스트",
      type: "string",
      group: "items",
      description: "첨부파일 설명이 없을 때 기본 노출 텍스트. 예: 첨부파일 다운로드",
    }),

    defineField({
      name: "paginationPrev",
      title: "이전 페이지 버튼 텍스트",
      type: "string",
      group: "pagination",
    }),
    defineField({
      name: "paginationNext",
      title: "다음 페이지 버튼 텍스트",
      type: "string",
      group: "pagination",
    }),
  ],
  preview: {
    prepare: () => ({ title: "📢 알림마당 페이지(라벨)" }),
  },
});
