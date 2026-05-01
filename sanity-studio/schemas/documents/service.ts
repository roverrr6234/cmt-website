import { defineType, defineField } from "sanity";

/**
 * 한글 → 영문 로마자 변환 (국어의 로마자 표기법 2000 기준).
 * Generate 버튼이 한글 제목을 받아 안전한 URL slug 로 자동 생성하도록 사용.
 *
 * 예) "화학사고 예방관리 계획서" → "hwahagsago-yebanggwanli-gyehoegseo"
 *     "영업허가" → "yeongeobheoga"
 */
const HANGUL_INITIALS = [
  "g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s",
  "ss", "", "j", "jj", "ch", "k", "t", "p", "h",
];
const HANGUL_MEDIALS = [
  "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa",
  "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i",
];
const HANGUL_FINALS = [
  "", "g", "kk", "gs", "n", "nj", "nh", "d", "l", "lg",
  "lm", "lb", "ls", "lt", "lp", "lh", "m", "b", "bs", "s",
  "ss", "ng", "j", "ch", "k", "t", "p", "h",
];

function romanizeKorean(text: string): string {
  let result = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const offset = code - 0xac00;
      const initial = Math.floor(offset / 588);
      const medial = Math.floor((offset % 588) / 28);
      const finalIdx = offset % 28;
      result +=
        HANGUL_INITIALS[initial] +
        HANGUL_MEDIALS[medial] +
        HANGUL_FINALS[finalIdx];
    } else {
      result += ch;
    }
  }
  return result;
}

/**
 * 서비스 (5대 서비스 + 무한 확장)
 *
 * 새 서비스를 추가할 때마다 cmtbusan.kr/service/<slug> 주소로
 * 동일한 디자인의 페이지가 자동 생성된다.
 *
 * 필드 구성은 client/src/lib/serviceData.ts 의 ServiceData 인터페이스와
 * 1:1 매핑되도록 설계되어, 디자인을 변경하지 않고 데이터만 Sanity 에서 관리할 수 있다.
 *
 * 모든 필드를 한 화면에 노출 (groups 제거) — 아버님이 탭을 놓치지 않고
 * 위에서부터 아래로 채울 수 있도록 설계.
 */
export const service = defineType({
  name: "service",
  title: "주요업무",
  type: "document",
  fields: [
    /* ── 1. 기본 정보 ── */
    defineField({
      name: "title",
      title: "1. 주요업무 명 (정식)",
      type: "string",
      description: "예: 화학사고 예방관리 계획서",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "shortTitle",
      title: "2. 짧은 제목",
      type: "string",
      description: "메뉴/breadcrumb 에 표시되는 짧은 이름. 비우면 정식 제목 사용.",
    }),
    defineField({
      name: "slug",
      title: "3. 주소(slug)",
      type: "slug",
      description:
        "사이트 주소가 됩니다. 예: cmtbusan.kr/service/<여기>. " +
        "1번 서비스 명을 먼저 입력한 후 [Generate] 를 누르면 한글이 자동으로 영문(로마자)으로 변환됩니다. " +
        "예) '화학사고 예방관리' → 'hwahagsago-yebanggwanli'. 마음에 안 들면 그 위에 직접 수정해도 됩니다.",
      options: {
        source: "title",
        maxLength: 60,
        slugify: (input: string) =>
          romanizeKorean(input)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 60),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "iconName",
      title: "4. 카드 아이콘",
      type: "string",
      description:
        "홈페이지/헤더 주요업무 카드에 표시되는 아이콘. 기존 5대 주요업무와 어울리는 것을 선택하세요.",
      options: {
        list: [
          { title: "📄 문서 (FileText)", value: "FileText" },
          { title: "🔍 검사/돋보기 (Search)", value: "Search" },
          { title: "🏆 허가/인증 (Award)", value: "Award" },
          { title: "🛡 안전 (Shield)", value: "Shield" },
          { title: "📋 클립보드 (ClipboardCheck)", value: "ClipboardCheck" },
          { title: "🎯 타겟 (Target)", value: "Target" },
          { title: "👥 사람들 (Users)", value: "Users" },
          { title: "⚡ 번개 (Zap)", value: "Zap" },
          { title: "📍 위치 (MapPin)", value: "MapPin" },
        ],
      },
      initialValue: "FileText",
    }),
    defineField({
      name: "cardImage",
      title: "5. 대표 이미지 (선택)",
      type: "image",
      description:
        "주요업무 카드용 대표 이미지 (JPG/PNG/WebP, 권장 가로 800px 이상). 비워두면 위 아이콘이 사용됩니다.",
      options: {
        hotspot: true,
        accept: "image/jpeg,image/png,image/webp,image/gif",
      },
    }),
    defineField({
      name: "description",
      title: "6. 짧은 요약",
      type: "string",
      description: "주요업무 카드/breadcrumb 에 노출되는 한 줄 요약.",
      validation: (Rule) => Rule.required().max(120),
    }),

    /* ── 2. 근거 법령 ── */
    defineField({
      name: "law",
      title: "7. 근거 법령",
      type: "string",
      description: "예: 화학물질관리법, 산업안전보건법",
    }),
    defineField({
      name: "lawArticle",
      title: "8. 근거 조항",
      type: "string",
      description: "예: 제23조",
    }),

    /* ── 3. 본문 메인 섹션 (상세 페이지 상단부) ── */
    defineField({
      name: "overview",
      title: "9. 개요",
      type: "text",
      rows: 6,
      description: "상세 페이지의 '개요' 섹션 본문.",
    }),
    defineField({
      name: "penalty",
      title: "10. 벌칙 규정 (선택)",
      type: "text",
      rows: 2,
      description: "비워두면 '벌칙 규정' 박스가 노출되지 않습니다.",
    }),
    defineField({
      name: "tasks",
      title: "11. 업무 내용",
      type: "array",
      of: [{ type: "string" }],
      description: "상세 페이지의 '업무 내용' 카드들. 한 줄에 한 항목.",
    }),
    defineField({
      name: "targets",
      title: "12. 대상",
      type: "array",
      of: [{ type: "text", rows: 2 }],
      description: "상세 페이지의 '대상' 목록. 항목 하나당 여러 줄 가능.",
    }),
    defineField({
      name: "procedure",
      title: "13. 제출 절차",
      type: "array",
      of: [{ type: "procedureStep" }],
      description: "상세 페이지의 '제출 절차' 단계별 흐름 (단계 제목 + 설명).",
    }),
    defineField({
      name: "documents",
      title: "14. 필요 서류",
      type: "array",
      of: [{ type: "text", rows: 2 }],
      description: "상세 페이지의 '필요 서류' 목록.",
    }),

    /* ── 4. 상세 정보 섹션 (표/체크리스트/알림 박스/다이어그램 등) ── */
    defineField({
      name: "sections",
      title: "15. 상세 정보 섹션 (표 · 체크리스트 · 알림 · 비교표 · 다이어그램 · SVG)",
      type: "array",
      description:
        "상세 페이지 하단의 '상세 정보' 영역. 원하는 만큼 추가하고 순서를 자유롭게 조정하세요. " +
        "텍스트(서식 가능)/알림 박스/표/체크리스트/비교표/절차 이미지/SVG 도표 7가지 종류 중 선택할 수 있습니다.",
      of: [
        { type: "sectionText" },
        { type: "sectionAlert" },
        { type: "sectionTable" },
        { type: "sectionChecklist" },
        { type: "sectionComparisonTable" },
        { type: "sectionProcedureImage" },
        { type: "sectionRawSvg" },
      ],
    }),

    /* ── 5. 참고 사항 (페이지 최하단) ── */
    defineField({
      name: "additionalInfo",
      title: "16. 참고 사항 (선택)",
      type: "array",
      of: [{ type: "text", rows: 2 }],
      description: "상세 페이지 맨 아래 '참고 사항' 박스에 노출되는 ※ 항목들.",
    }),

    /* ── 6. 정렬 ── */
    defineField({
      name: "sortOrder",
      title: "17. 정렬 순서",
      type: "number",
      description: "숫자가 작을수록 앞에 노출됩니다. (1, 2, 3 ...)",
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: "정렬 순서",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
    {
      title: "최근 수정순",
      name: "recent",
      by: [{ field: "_updatedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "cardImage",
      sortOrder: "sortOrder",
    },
    prepare: ({ title, subtitle, media, sortOrder }) => ({
      title: typeof sortOrder === "number" ? `${sortOrder}. ${title}` : title,
      subtitle,
      media,
    }),
  },
});
