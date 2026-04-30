import { defineType, defineField } from "sanity";

/**
 * 상담 신청 페이지 (싱글톤)
 *
 * /contact 페이지의 hero / 라벨 / 보조 설명 텍스트.
 * 전화/이메일/주소 본문 자체는 companyInfo 도큐먼트에서 fetch 한다.
 */
export const contactPage = defineType({
  name: "contactPage",
  title: "상담 신청 페이지",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "info", title: "연락처 정보 카드 라벨" },
    { name: "form", title: "상담 신청서" },
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
    defineField({
      name: "breadcrumbCurrent",
      title: "Breadcrumb 현재 위치 텍스트",
      type: "string",
      description: '예: "상담 신청"',
      group: "hero",
    }),

    /* ── 연락처 정보 카드 ── */
    defineField({
      name: "infoSectionTitle",
      title: '"연락처 정보" 섹션 제목',
      type: "string",
      group: "info",
    }),
    defineField({
      name: "phoneLabel",
      title: "전화 카드 라벨",
      type: "string",
      description: '예: "전화 상담"',
      group: "info",
    }),
    defineField({
      name: "emailLabel",
      title: "이메일 카드 라벨",
      type: "string",
      group: "info",
    }),
    defineField({
      name: "addressLabel",
      title: "주소 카드 라벨",
      type: "string",
      group: "info",
    }),
    defineField({
      name: "addressNote",
      title: "주소 카드 보조 설명",
      type: "string",
      description: '예: "부산, 울산, 경남 포함 전국 출장 서비스"',
      group: "info",
    }),
    defineField({
      name: "hoursLabel",
      title: "상담 시간 카드 라벨",
      type: "string",
      group: "info",
    }),
    defineField({
      name: "hoursValue",
      title: "상담 시간 값",
      type: "string",
      description: '예: "평일 09:00 - 18:00"',
      group: "info",
    }),
    defineField({
      name: "hoursNote",
      title: "상담 시간 보조 설명",
      type: "string",
      description: '예: "긴급 건은 전화로 문의해 주세요"',
      group: "info",
    }),

    /* ── 상담 신청서 ── */
    defineField({
      name: "formSectionTitle",
      title: '"상담 신청서" 섹션 제목',
      type: "string",
      group: "form",
    }),
    defineField({
      name: "formGuideText",
      title: "신청서 위 안내 문구",
      type: "text",
      rows: 3,
      description:
        '본문 안에 이메일 주소가 자동으로 들어갈 자리에는 "{email}" 을 사용하세요.',
      group: "form",
    }),
  ],
  preview: {
    prepare: () => ({ title: "📞 상담 신청 페이지" }),
  },
});
