import { defineType, defineField } from "sanity";

/**
 * 사이트 헤더 (싱글톤)
 *
 * 로고는 logo 필드에 업로드하면 자동으로 사이트 헤더에 반영된다.
 * 비어있으면 코드 fallback (client/public/manus-storage/logo_*.png) 사용.
 */
export const siteHeader = defineType({
  name: "siteHeader",
  title: "사이트 헤더",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "로고 이미지",
      type: "image",
      description: "비어있으면 기본 로고가 사용됩니다.",
      options: { hotspot: true },
    }),
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
