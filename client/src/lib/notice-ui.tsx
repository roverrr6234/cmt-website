/**
 * 알림마당 공용 UI 헬퍼
 * - 목록(Notices.tsx)과 상세(NoticeDetail.tsx)에서 동일하게 사용
 * - Portable Text 렌더러, 카테고리 색상, 날짜 포맷, 글 URL 생성
 */

import { sanityImageUrl } from "@/lib/sanity";

/** 글 상세 페이지 경로 — 사이트맵/프리렌더(scripts/prerender.mjs)와 반드시 동일하게 유지 */
export function noticePath(id: string) {
  return `/notices/${encodeURIComponent(id)}`;
}

export const SITE_URL = "https://www.cmtbusan.kr";

/** 카테고리 배지 색상 — Sanity 스키마(notice.ts)와 기존 데이터의 카테고리를 모두 커버 */
const categoryColorMap: Record<string, string> = {
  법령개정: "bg-red-100 text-red-800 border-red-200",
  "법규 안내": "bg-red-100 text-red-800 border-red-200",
  공지사항: "bg-blue-100 text-blue-800 border-blue-200",
  "업무 안내": "bg-emerald-100 text-emerald-800 border-emerald-200",
  업계동향: "bg-emerald-100 text-emerald-800 border-emerald-200",
  기타: "bg-gray-100 text-gray-700 border-gray-200",
};

export function categoryColor(category?: string) {
  return (
    (category && categoryColorMap[category]) ||
    "bg-gray-100 text-gray-700 border-gray-200"
  );
}

export function formatNoticeDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

/** Portable Text 커스텀 컴포넌트 (기존 Notices.tsx에서 이동) */
export const noticePortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      const url = sanityImageUrl(value.asset._ref, 800);
      return (
        <figure className="my-4">
          <img
            src={url}
            alt={value.alt || ""}
            className="rounded-lg max-w-full h-auto border border-gray-200"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="text-xs text-gray-500 mt-2 text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-lg font-bold text-[#0a1628] mt-5 mb-2">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-base font-semibold text-[#0a1628] mt-4 mb-2">{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[#0a1628] pl-4 py-2 my-3 bg-gray-50 text-gray-700 italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p className="text-sm text-gray-700 leading-relaxed mb-2">{children}</p>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        {children}
      </a>
    ),
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    underline: ({ children }: any) => <span className="underline">{children}</span>,
  },
};

/** Portable Text → 평문 (메타 description 용). 최대 length 자로 자름 */
export function portableTextToPlain(blocks: any, maxLength = 155): string {
  if (!Array.isArray(blocks)) return "";
  const text = blocks
    .filter((b) => b?._type === "block" && Array.isArray(b.children))
    .map((b) => b.children.map((c: any) => c?.text ?? "").join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? text.slice(0, maxLength - 1) + "…" : text;
}
