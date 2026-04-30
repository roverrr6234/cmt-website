import { defineType, defineField } from "sanity";

/**
 * 홈페이지 (싱글톤)
 *
 * 기존 production 데이터셋에 이미 존재하는 homePage 도큐먼트의 필드 모양을 그대로 재현한다.
 * 새 필드를 추가하지 않은 이유: 프론트엔드(client/src/pages/Home.tsx)는 아직
 * 이 데이터를 읽지 않으므로 추가해도 화면에 안 나타남. Phase B 와이어링과 함께
 * 새 필드를 점진적으로 추가하기로 한다.
 */
export const homePage = defineType({
  name: "homePage",
  title: "홈페이지",
  type: "document",
  groups: [
    { name: "hero", title: "Hero 섹션", default: true },
    { name: "about", title: "About / 회사소개" },
    { name: "stats", title: "통계 숫자" },
    { name: "services", title: "서비스 섹션" },
    { name: "why", title: "왜 저희를 선택하나요" },
    { name: "cta", title: "CTA 섹션" },
    { name: "contact", title: "연락처 섹션" },
  ],
  fields: [
    /* ── Hero ── */
    defineField({
      name: "heroTitleTop",
      title: "Hero 제목 — 첫 줄",
      description: '예: "화학사고 예방을 최선으로,"',
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroTitleHighlight",
      title: "Hero 제목 — 강조어 (금색으로 표시)",
      description: '두 번째 줄의 앞부분. 예: "내 회사처럼"',
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroTitleSuffix",
      title: "Hero 제목 — 강조어 뒤 텍스트",
      description: '두 번째 줄의 강조어 뒤. 예: " 일하는 파트너"',
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero 제목 (구버전 — 사용 안 함)",
      description: "위의 3개 필드(첫 줄 / 강조어 / 강조어 뒤)를 사용하세요.",
      type: "string",
      hidden: true,
      group: "hero",
    }),
    defineField({ name: "heroSubtitle", title: "Hero 부제", type: "text", rows: 2, group: "hero" }),
    defineField({ name: "heroCtaButton", title: "Hero CTA 버튼 텍스트", type: "string", group: "hero" }),

    /* ── About ── */
    defineField({ name: "aboutTitle", title: "About 섹션 제목", type: "string", group: "about" }),
    defineField({ name: "aboutContent", title: "About 본문", type: "text", rows: 5, group: "about" }),
    defineField({
      name: "aboutItems",
      title: "About 체크 항목",
      type: "array",
      of: [{ type: "string" }],
      group: "about",
    }),
    defineField({ name: "aboutButtonText", title: "About 버튼 텍스트", type: "string", group: "about" }),

    /* ── Stats ── */
    defineField({
      name: "stats",
      title: "통계 항목 (4개 권장)",
      type: "array",
      of: [{ type: "statItem" }],
      group: "stats",
    }),

    /* ── Services ── */
    defineField({ name: "servicesTitle", title: "서비스 섹션 제목", type: "string", group: "services" }),
    defineField({
      name: "servicesDescription",
      title: "서비스 섹션 설명",
      type: "text",
      rows: 3,
      group: "services",
    }),

    /* ── Why Choose ── */
    defineField({ name: "whyChooseTitle", title: "Why Choose 섹션 제목", type: "string", group: "why" }),
    defineField({
      name: "whyChooseItems",
      title: "Why Choose 항목 (6개 권장)",
      type: "array",
      of: [{ type: "whyItem" }],
      group: "why",
    }),

    /* ── CTA ── */
    defineField({ name: "ctaTitle", title: "CTA 제목", type: "string", group: "cta" }),
    defineField({ name: "ctaDescription", title: "CTA 설명", type: "text", rows: 3, group: "cta" }),
    defineField({ name: "ctaButtonText", title: "CTA 버튼 텍스트", type: "string", group: "cta" }),

    /* ── Contact ── */
    defineField({ name: "contactTitle", title: "Contact 제목", type: "string", group: "contact" }),
    defineField({
      name: "contactDescription",
      title: "Contact 설명",
      type: "text",
      rows: 3,
      group: "contact",
    }),
  ],
  preview: {
    prepare: () => ({ title: "🏠 홈페이지" }),
  },
});
