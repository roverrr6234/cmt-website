import { defineType, defineField } from "sanity";

/**
 * 사이트 푸터 (싱글톤)
 *
 * 기존 production 데이터셋의 siteFooter 필드를 그대로 반영.
 */
export const siteFooter = defineType({
  name: "siteFooter",
  title: "사이트 푸터",
  type: "document",
  groups: [
    { name: "company", title: "사업자 정보", default: true },
    { name: "contact", title: "연락처" },
    { name: "links", title: "바로가기 링크" },
    { name: "labels", title: "섹션 제목/카피라이트" },
  ],
  fields: [
    /* ── 사업자 정보 ── */
    defineField({ name: "companyNameFooter", title: "회사명 (푸터용)", type: "string", group: "company" }),
    defineField({ name: "ceoNameFooter", title: "대표자명 (푸터용)", type: "string", group: "company" }),
    defineField({
      name: "businessNumberFooter",
      title: "사업자등록번호 (푸터용)",
      type: "string",
      group: "company",
    }),
    defineField({ name: "addressFooter", title: "주소 (푸터용)", type: "string", group: "company" }),

    /* ── 연락처 ── */
    defineField({ name: "phoneFooter", title: "전화번호 (푸터용)", type: "string", group: "contact" }),
    defineField({ name: "emailFooter", title: "이메일 (푸터용)", type: "string", group: "contact" }),

    /* ── 바로가기 ── */
    defineField({
      name: "quickLinks",
      title: "바로가기 항목",
      type: "array",
      of: [{ type: "quickLink" }],
      group: "links",
    }),

    /* ── 섹션 제목 ── */
    defineField({ name: "businessInfoTitle", title: "'사업자 정보' 섹션 제목", type: "string", group: "labels" }),
    defineField({ name: "contactTitle", title: "'연락처' 섹션 제목", type: "string", group: "labels" }),
    defineField({ name: "servicesTitle", title: "'주요 업무' 섹션 제목", type: "string", group: "labels" }),
    defineField({ name: "quickLinksTitle", title: "'바로가기' 섹션 제목", type: "string", group: "labels" }),
    defineField({ name: "copyrightText", title: "카피라이트 문구", type: "string", group: "labels" }),
    defineField({
      name: "seoBottomText",
      title: "푸터 하단 SEO 텍스트",
      type: "text",
      rows: 2,
      description:
        '카피라이트 옆에 표시되는 검색엔진용 한 줄. 예: "부산, 울산, 경남 포함 전국 화학안전 컨설팅 | 화학사고예방관리계획서 | ..."',
      group: "labels",
    }),
  ],
  preview: {
    prepare: () => ({ title: "🔻 사이트 푸터" }),
  },
});
