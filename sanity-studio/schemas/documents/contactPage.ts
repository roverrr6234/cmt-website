import { defineType, defineField } from "sanity";

/**
 * 상담 신청 페이지 (싱글톤)
 *
 * /contact 페이지의 모든 라벨/문구를 Sanity 에서 편집할 수 있도록 모은 도큐먼트.
 * 폼 자체의 항목(이름/연락처/관심 서비스 등)은 컴포넌트 내부에 두고, 화면에 노출되는
 * 텍스트(제목, 안내, 정보 박스 라벨)만 여기에서 관리.
 */
export const contactPage = defineType({
  name: "contactPage",
  title: "상담 페이지",
  type: "document",
  groups: [
    { name: "hero", title: "상단 배너", default: true },
    { name: "info", title: "연락처 정보 박스" },
    { name: "form", title: "상담신청서 안내" },
  ],
  fields: [
    /* ── Hero ── */
    defineField({
      name: "pageTitle",
      title: "페이지 제목",
      type: "string",
      group: "hero",
      description: "예: 상담 신청",
    }),
    defineField({
      name: "pageDescription",
      title: "페이지 부제",
      type: "text",
      rows: 2,
      group: "hero",
    }),
    defineField({
      name: "breadcrumbLabel",
      title: "Breadcrumb 라벨",
      type: "string",
      group: "hero",
      description: "상단 경로 표시용. 비우면 '상담 신청' 사용.",
    }),

    /* ── 연락처 정보 박스 ── */
    defineField({
      name: "infoSectionTitle",
      title: "정보 박스 섹션 제목",
      type: "string",
      group: "info",
      description: "예: 연락처 정보",
    }),
    defineField({
      name: "phoneLabel",
      title: "전화 상담 라벨",
      type: "string",
      group: "info",
    }),
    defineField({
      name: "phoneSub",
      title: "전화 상담 부가 안내",
      type: "string",
      group: "info",
      description: "예: 평일 09:00 - 18:00",
    }),
    defineField({
      name: "emailLabel",
      title: "이메일 라벨",
      type: "string",
      group: "info",
    }),
    defineField({
      name: "emailSub",
      title: "이메일 부가 안내",
      type: "string",
      group: "info",
    }),
    defineField({
      name: "addressLabel",
      title: "주소 라벨",
      type: "string",
      group: "info",
    }),
    defineField({
      name: "addressSub",
      title: "주소 부가 안내",
      type: "string",
      group: "info",
    }),
    defineField({
      name: "hoursLabel",
      title: "상담 시간 라벨",
      type: "string",
      group: "info",
    }),
    defineField({
      name: "hoursWeekday",
      title: "평일 운영 시간",
      type: "string",
      group: "info",
      description: "예: 평일 09:00 - 18:00",
    }),
    defineField({
      name: "hoursEmergency",
      title: "긴급/주말 안내",
      type: "string",
      group: "info",
      description: "예: 긴급 건은 24시간 대응 가능",
    }),

    /* ── 상담신청서 ── */
    defineField({
      name: "formSectionTitle",
      title: "상담신청서 섹션 제목",
      type: "string",
      group: "form",
    }),
    defineField({
      name: "formInstructions",
      title: "상담신청서 안내 문구",
      type: "text",
      rows: 3,
      group: "form",
      description: "폼 위에 노출되는 안내 텍스트.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "💬 상담 페이지" }),
  },
});
