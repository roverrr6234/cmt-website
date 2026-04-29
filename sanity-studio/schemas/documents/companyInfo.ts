import { defineType, defineField } from "sanity";

/**
 * 회사 정보 (싱글톤)
 *
 * 기존 production 데이터셋에 이미 존재하는 companyInfo 도큐먼트의 필드 모양 그대로.
 */
export const companyInfo = defineType({
  name: "companyInfo",
  title: "회사 정보",
  type: "document",
  fields: [
    defineField({
      name: "companyName",
      title: "회사명",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "ceoName", title: "대표자명", type: "string" }),
    defineField({ name: "businessNumber", title: "사업자등록번호", type: "string" }),
    defineField({
      name: "phone",
      title: "전화번호",
      type: "string",
      description: "예: 051-412-7707",
    }),
    defineField({ name: "email", title: "이메일", type: "string" }),
    defineField({ name: "address", title: "주소", type: "string" }),
  ],
  preview: {
    select: { title: "companyName", subtitle: "phone" },
    prepare: ({ title, subtitle }) => ({
      title: `🏢 ${title || "회사 정보"}`,
      subtitle,
    }),
  },
});
