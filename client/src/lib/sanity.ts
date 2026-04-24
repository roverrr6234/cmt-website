import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "7l80ou25",
  dataset: "production",
  apiVersion: "2026-04-18",
  useCdn: true,
});

/**
 * Sanity 이미지 URL 빌더
 * @sanity/image-url 없이 직접 URL을 생성합니다.
 */
export function sanityImageUrl(ref: string, width?: number): string {
  // ref 형식: "image-abc123-800x600-png"
  const [, assetId, dimensions, format] = ref.split("-");
  const base = `https://cdn.sanity.io/images/7l80ou25/production/${assetId}-${dimensions}.${format}`;
  if (width) return `${base}?w=${width}&fit=max&auto=format`;
  return `${base}?auto=format`;
}

/**
 * Sanity 파일 URL 빌더
 */
export function sanityFileUrl(ref: string): string {
  // ref 형식: "file-abc123-pdf"
  const [, assetId, ext] = ref.split("-");
  return `https://cdn.sanity.io/files/7l80ou25/production/${assetId}.${ext}`;
}

/**
 * 알림마당 게시물 타입
 */
export interface SanityNotice {
  _id: string;
  title: string;
  category: "법령개정" | "공지사항" | "업계동향";
  isPinned: boolean;
  publishedAt: string;
  excerpt: string;
  body?: any[]; // Portable Text
  attachments?: Array<{
    _key: string;
    asset: { _ref: string };
    description?: string;
  }>;
}

/**
 * 알림마당 게시물 목록 쿼리
 */
export const NOTICES_QUERY = `*[_type == "notice"] | order(isPinned desc, publishedAt desc) {
  _id,
  title,
  category,
  isPinned,
  publishedAt,
  excerpt,
  body,
  attachments
}`;

/**
 * 단일 게시물 쿼리
 */
export const NOTICE_BY_ID_QUERY = `*[_type == "notice" && _id == $id][0] {
  _id,
  title,
  category,
  isPinned,
  publishedAt,
  excerpt,
  body,
  attachments
}`;
