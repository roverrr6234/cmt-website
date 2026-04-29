import { defineType, defineField } from "sanity";

/**
 * 섹션 블록 타입들
 *
 * 각 블록은 service.sections 배열에 들어가며,
 * 프론트엔드(client/src/pages/ServiceDetail.tsx)의 RenderSection 함수가
 * 동일한 디자인으로 렌더링한다.
 *
 * 디자인 불변 원칙: 새로운 블록을 함부로 추가하지 말 것.
 * 현재 코드가 렌더할 수 있는 타입만 노출한다.
 */

/* ── 1. 텍스트 블록 (Portable Text) ── */
export const sectionText = defineType({
  name: "sectionText",
  title: "텍스트 블록",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "섹션 제목",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "본문 (서식 가능)",
      type: "array",
      of: [{ type: "block" }],
      description: "글자 굵게/기울임/링크 등 자유롭게 편집 가능합니다.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: `📄 ${title || "텍스트 블록"}` }),
  },
});

/* ── 2. 알림 박스 ── */
export const sectionAlert = defineType({
  name: "sectionAlert",
  title: "알림 박스",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "섹션 제목 (선택)",
      type: "string",
    }),
    defineField({
      name: "alertType",
      title: "알림 종류",
      type: "string",
      options: {
        list: [
          { title: "주의 (노랑)", value: "warning" },
          { title: "정보 (파랑)", value: "info" },
          { title: "팁 (초록)", value: "tip" },
          { title: "위험 (빨강)", value: "danger" },
        ],
        layout: "radio",
      },
      initialValue: "info",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alertTitle",
      title: "알림 제목",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alertContent",
      title: "알림 내용",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "alertTitle", subtitle: "alertType" },
    prepare: ({ title, subtitle }) => ({
      title: `⚠️ ${title || "알림"}`,
      subtitle: subtitle ? `종류: ${subtitle}` : undefined,
    }),
  },
});

/* ── 3. 일반 표 ── */
export const sectionTable = defineType({
  name: "sectionTable",
  title: "표",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "섹션 제목",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tableTitle",
      title: "표 제목 (선택)",
      type: "string",
    }),
    defineField({
      name: "headers",
      title: "헤더 (열 제목)",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "rows",
      title: "행 (각 행 = 셀들의 배열)",
      type: "array",
      of: [
        {
          type: "object",
          name: "row",
          title: "행",
          fields: [
            defineField({
              name: "cells",
              title: "셀",
              type: "array",
              of: [{ type: "text", rows: 2 }],
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare: ({ cells }) => ({
              title: Array.isArray(cells) && cells.length > 0 ? String(cells[0]).slice(0, 60) : "(비어있음)",
            }),
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "footnote",
      title: "각주 (선택)",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: `🗂 ${title || "표"}` }),
  },
});

/* ── 4. 체크리스트 ── */
export const sectionChecklist = defineType({
  name: "sectionChecklist",
  title: "체크리스트",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "섹션 제목",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "listTitle",
      title: "리스트 제목",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "체크 항목들",
      type: "array",
      of: [{ type: "text", rows: 2 }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "listTitle" },
    prepare: ({ title }) => ({ title: `✅ ${title || "체크리스트"}` }),
  },
});

/* ── 5. 비교표 (1군 vs 2군 같은 O/X 비교) ── */
export const sectionComparisonTable = defineType({
  name: "sectionComparisonTable",
  title: "비교표 (O/X)",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "섹션 제목",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tableTitle",
      title: "표 제목 (선택)",
      type: "string",
    }),
    defineField({
      name: "headers",
      title: "헤더 (열 제목)",
      type: "array",
      of: [{ type: "string" }],
      description: "예: ['구성요소', '2군', '1군']",
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: "rows",
      title: "행",
      type: "array",
      of: [
        {
          type: "object",
          name: "comparisonRow",
          title: "비교 행",
          fields: [
            defineField({
              name: "label",
              title: "항목명",
              type: "string",
              description: "하위 항목은 앞에 공백 2칸을 넣으면 들여쓰기 됩니다 (예: '  가. 사업장 정보').",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "values",
              title: "값들",
              type: "array",
              of: [{ type: "string" }],
              description: "헤더 수만큼 입력 (보통 'O' 또는 'X')",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", values: "values" },
            prepare: ({ title, values }) => ({
              title,
              subtitle: Array.isArray(values) ? values.join(" | ") : "",
            }),
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "footnote",
      title: "각주 (선택)",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: `🆚 ${title || "비교표"}` }),
  },
});

/* ── 6. 절차 이미지 (또는 코드 다이어그램 ID) ── */
export const sectionProcedureImage = defineType({
  name: "sectionProcedureImage",
  title: "절차 이미지/다이어그램",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "섹션 제목",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "diagramId",
      title: "기존 코드 다이어그램 ID (있으면 입력)",
      type: "string",
      description:
        "기존 5대 서비스에 쓰이는 코드로 그려진 다이어그램이 있는 경우만 입력합니다. 일반적으로는 비워두고 아래 이미지를 업로드하세요.",
    }),
    defineField({
      name: "image",
      title: "이미지",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => Boolean(parent?.diagramId),
    }),
    defineField({
      name: "alt",
      title: "이미지 대체 텍스트",
      type: "string",
      hidden: ({ parent }) => Boolean(parent?.diagramId),
    }),
    defineField({
      name: "caption",
      title: "이미지 캡션 (선택)",
      type: "string",
      hidden: ({ parent }) => Boolean(parent?.diagramId),
    }),
  ],
  preview: {
    select: { title: "title", media: "image" },
    prepare: ({ title, media }) => ({
      title: `🖼 ${title || "절차 이미지"}`,
      media,
    }),
  },
});
