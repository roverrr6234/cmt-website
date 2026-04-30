import { defineType, defineField } from "sanity";

/**
 * 사이트 헤더 (싱글톤)
 *
 * 상단 바의 텍스트/링크/메뉴 라벨을 비기술자가 모두 편집할 수 있도록 구성.
 * 기존 logoTextEng 필드는 호환성을 위해 보존.
 */
export const siteHeader = defineType({
  name: "siteHeader",
  title: "사이트 헤더",
  type: "document",
  groups: [
    { name: "logo", title: "로고/상단 바", default: true },
    { name: "menu", title: "메뉴 라벨" },
    { name: "external", title: "외부 링크" },
  ],
  fields: [
    /* ── 로고 / 상단 바 ── */
    defineField({
      name: "logoTextEng",
      title: "로고 영문 텍스트",
      type: "string",
      description: "예: Chemicals Management Technology",
      group: "logo",
    }),
    defineField({
      name: "logoAlt",
      title: "로고 이미지 대체 텍스트(alt)",
      type: "string",
      description: "스크린리더 / SEO 용. 예: 화학물질관리기술 로고",
      group: "logo",
    }),
    defineField({
      name: "topBarPhonePrefix",
      title: "상단 바 전화번호 앞 라벨",
      type: "string",
      description: "예: 상담 문의 (전화번호 자체는 회사정보에서 자동으로 가져옵니다)",
      group: "logo",
    }),

    /* ── 메뉴 라벨 ── */
    defineField({
      name: "homeMenuLabel",
      title: "'홈' 메뉴 라벨",
      type: "string",
      group: "menu",
    }),
    defineField({
      name: "servicesMenuLabel",
      title: "'주요 업무' 메뉴 라벨",
      type: "string",
      group: "menu",
    }),
    defineField({
      name: "noticesMenuLabel",
      title: "'알림마당' 메뉴 라벨",
      type: "string",
      group: "menu",
    }),
    defineField({
      name: "blogMenuLabel",
      title: "'블로그' 메뉴 라벨",
      type: "string",
      group: "menu",
    }),
    defineField({
      name: "contactMenuLabel",
      title: "'상담 신청' 메뉴 라벨",
      type: "string",
      group: "menu",
    }),
    defineField({
      name: "consultButtonLabel",
      title: "상단 바 '무료 상담 신청' 버튼 라벨",
      type: "string",
      group: "menu",
    }),

    /* ── 외부 링크 ── */
    defineField({
      name: "blogUrl",
      title: "블로그 URL",
      type: "url",
      description: "헤더의 '블로그' 메뉴가 가리킬 외부 링크. 예: https://blog.naver.com/ckt9054",
      group: "external",
    }),
  ],
  preview: {
    prepare: () => ({ title: "🔝 사이트 헤더" }),
  },
});
