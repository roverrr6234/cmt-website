import { defineType, defineField } from "sanity";

/**
 * 사이트 헤더 (싱글톤)
 *
 * Header.tsx 가 fetch 해서 사용한다. 비어있으면 코드 fallback 사용.
 */
export const siteHeader = defineType({
  name: "siteHeader",
  title: "사이트 헤더",
  type: "document",
  groups: [
    { name: "logo", title: "로고", default: true },
    { name: "nav", title: "메뉴 라벨" },
    { name: "links", title: "외부 링크" },
  ],
  fields: [
    /* ── 로고 ── */
    defineField({
      name: "logoTextEng",
      title: "로고 영문 텍스트",
      type: "string",
      description: '예: "Chemicals Management Technology" — 로고 옆 표시용',
      group: "logo",
    }),
    defineField({
      name: "logoAlt",
      title: "로고 이미지 대체 텍스트(alt)",
      type: "string",
      description: '스크린리더/이미지 미로드 시 표시. 예: "화학물질관리기술 로고"',
      group: "logo",
    }),

    /* ── 메뉴 라벨 ── */
    defineField({
      name: "homeLabel",
      title: '메뉴: "홈" 라벨',
      type: "string",
      group: "nav",
    }),
    defineField({
      name: "servicesMenuLabel",
      title: '메뉴: "주요 업무" 라벨',
      type: "string",
      group: "nav",
    }),
    defineField({
      name: "noticesLabel",
      title: '메뉴: "알림마당" 라벨',
      type: "string",
      group: "nav",
    }),
    defineField({
      name: "blogLabel",
      title: '메뉴: "블로그" 라벨',
      type: "string",
      group: "nav",
    }),
    defineField({
      name: "contactLabel",
      title: '메뉴: "상담 신청" 라벨',
      type: "string",
      group: "nav",
    }),
    defineField({
      name: "ctaButtonShort",
      title: "햄버거 메뉴 하단 CTA 버튼 텍스트",
      type: "string",
      description: '예: "무료 상담 신청"',
      group: "nav",
    }),

    /* ── 외부 링크 ── */
    defineField({
      name: "blogUrl",
      title: "블로그 URL",
      type: "string",
      description: "예: https://blog.naver.com/ckt9054",
      group: "links",
    }),
  ],
  preview: {
    prepare: () => ({ title: "🔝 사이트 헤더" }),
  },
});
