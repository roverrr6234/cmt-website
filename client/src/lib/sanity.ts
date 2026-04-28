import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: "7l80ou25",
  dataset: "production",
  apiVersion: "2026-04-18",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

/**
 * Sanity 이미지 URL 빌더
 */
export function urlFor(source: any) {
  if (!source) return "";
  return builder.image(source).url();
}

// ── 회사 정보 ──
export async function getCompanyInfo() {
  try {
    return await sanityClient.fetch(`*[_type == "companyInfo"][0]`);
  } catch (error) {
    console.error("Failed to fetch companyInfo:", error);
    return null;
  }
}

// ── 홈페이지 ──
export async function getHomePage() {
  try {
    return await sanityClient.fetch(`*[_type == "homePage"][0]`);
  } catch (error) {
    console.error("Failed to fetch homePage:", error);
    return null;
  }
}

// ── 헤더 ──
export async function getSiteHeader() {
  try {
    return await sanityClient.fetch(`*[_type == "siteHeader"][0]`);
  } catch (error) {
    console.error("Failed to fetch siteHeader:", error);
    return null;
  }
}

// ── 푸터 ──
export async function getSiteFooter() {
  try {
    return await sanityClient.fetch(`*[_type == "siteFooter"][0]`);
  } catch (error) {
    console.error("Failed to fetch siteFooter:", error);
    return null;
  }
}

// ── 서비스 목록 (모든 서비스) ──
export async function getAllServices() {
  try {
    return await sanityClient.fetch(
      `*[_type == "service"] | order(sortOrder asc) {
        _id,
        title,
        shortTitle,
        slug,
        description,
        law,
        lawArticle,
        overview,
        tasks,
        targets,
        documents,
        additionalInfo,
        procedure,
        cardImage,
        sections,
        penalty
      }`
    );
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

// ── 특정 서비스 (slug로 조회) ──
export async function getServiceBySlug(slug: string) {
  try {
    return await sanityClient.fetch(
      `*[_type == "service" && slug.current == $slug][0] {
        _id,
        title,
        shortTitle,
        slug,
        description,
        law,
        lawArticle,
        overview,
        tasks,
        targets,
        documents,
        additionalInfo,
        procedure,
        cardImage,
        sections,
        penalty
      }`,
      { slug }
    );
  } catch (error) {
    console.error("Failed to fetch service by slug:", error);
    return null;
  }
}

// ── 알림마당 (공지사항) ──
export async function getAllNotices() {
  try {
    return await sanityClient.fetch(
      `*[_type == "notice"] | order(isPinned desc, publishedAt desc) {
        _id,
        title,
        category,
        excerpt,
        content,
        publishedAt,
        isPinned
      }`
    );
  } catch (error) {
    console.error("Failed to fetch notices:", error);
    return [];
  }
}

// ── 특정 공지사항 ──
// ── Notices.tsx 호환 exports ──
export const NOTICES_QUERY = `*[_type == "notice"] | order(isPinned desc, publishedAt desc) {
  _id,
  title,
  category,
  excerpt,
  "body": content,
  publishedAt,
  isPinned
}`;

export type SanityNotice = {
  _id: string;
  title: string;
  category: string;
  excerpt?: string;
  body?: any;
  publishedAt: string;
  isPinned: boolean;
  attachments?: any[];
};

export function sanityImageUrl(ref: string, width?: number) {
  if (!ref) return "";
  const [, id, dimensions, format] = ref.split("-");
  const w = width ? `?w=${width}` : "";
  return `https://cdn.sanity.io/images/7l80ou25/production/${id}-${dimensions}.${format}${w}`;
}

export function sanityFileUrl(ref: string) {
  if (!ref) return "";
  const [, id, ext] = ref.split("-");
  return `https://cdn.sanity.io/files/7l80ou25/production/${id}.${ext}`;
}

// ── 특정 공지사항 ──
export async function getNoticeById(id: string) {
  try {
    return await sanityClient.fetch(
      `*[_type == "notice" && _id == $id][0] {
        _id,
        title,
        category,
        excerpt,
        content,
        publishedAt,
        isPinned
      }`,
      { id }
    );
  } catch (error) {
    console.error("Failed to fetch notice by id:", error);
    return null;
  }
}
