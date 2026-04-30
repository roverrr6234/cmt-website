import { defineType, defineField } from "sanity";

/**
 * 사이트 헤더 (싱글톤)
 *
 * 기존 데이터셋에는 logoTextEng 1개 필드만 존재. 추후 와이어링 단계에서
 * 한글 로고/메뉴 항목 등을 점진적으로 확장할 예정.
 */
export const siteHeader = defineType({
  name: "siteHeader",
  title: "사이트 헤더",
  type: "document",
  fields: [
    defineField({
      name: "logoTextEng",
      title: "로고 영문 텍스트",
      type: "string",
      description: "예: Chemicals Management Technology",
    }),
  ],
  preview: {
    prepare: () => ({ title: "🔝 사이트 헤더" }),
  },
});
