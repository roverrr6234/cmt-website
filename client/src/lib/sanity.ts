import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const PROJECT_ID =
  (import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined) ||
  "xwuem73x";
const DATASET =
  (import.meta.env.VITE_SANITY_DATASET as string | undefined) || "production";

export const sanityClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});

export const sanityConfig = {
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
};

const builder = imageUrlBuilder(sanityClient);

const DRAFT_FILTER = `!(_id in path("drafts.**"))`;

/**
 * 세션 캐시 — 헤더·푸터·홈·상담폼·플로팅버튼이 같은 문서(companyInfo/services 등)를
 * 페이지마다 각자 요청해 한 페이지에 12회+ 나가던 것을 1회로 줄인다. TTL 5분.
 */
const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { at: number; value: Promise<any> }>();
function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value as Promise<T>;
  const value = load().then(
    (v) => v,
    (e) => {
      cache.delete(key); // 실패는 캐시하지 않음
      throw e;
    },
  );
  cache.set(key, { at: Date.now(), value });
  return value;
}

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
    return await cached("companyInfo", () =>
      sanityClient.fetch(
      `*[_type == "companyInfo" && ${DRAFT_FILTER}][0]`,
      ),
    );
  } catch (error) {
    console.error("Failed to fetch companyInfo:", error);
    return null;
  }
}

// ── 홈페이지 ──
export async function getHomePage() {
  try {
    return await cached("homePage", () =>
      sanityClient.fetch(
      `*[_type == "homePage" && ${DRAFT_FILTER}][0]`,
      ),
    );
  } catch (error) {
    console.error("Failed to fetch homePage:", error);
    return null;
  }
}

// ── 헤더 ──
export async function getSiteHeader() {
  try {
    return await cached("siteHeader", () =>
      sanityClient.fetch(
      `*[_type == "siteHeader" && ${DRAFT_FILTER}][0]`,
      ),
    );
  } catch (error) {
    console.error("Failed to fetch siteHeader:", error);
    return null;
  }
}

// ── 푸터 ──
export async function getSiteFooter() {
  try {
    return await cached("siteFooter", () =>
      sanityClient.fetch(
      `*[_type == "siteFooter" && ${DRAFT_FILTER}][0]`,
      ),
    );
  } catch (error) {
    console.error("Failed to fetch siteFooter:", error);
    return null;
  }
}

/**
 * 서비스 도큐먼트 공통 필드.
 * sections 는 모든 섹션 블록(_type 별 다른 필드)을 포함하도록 모두 가져온다.
 * 이는 GROQ 의 기본 동작 — 명시 projection 없이 sections[] 만 쓰면 nested 객체의 모든 필드 반환.
 */
const SERVICE_FIELDS = `
  _id,
  title,
  shortTitle,
  slug,
  iconName,
  description,
  law,
  lawArticle,
  overview,
  tasks,
  targets,
  documents,
  additionalInfo,
  procedure[]{ step, detail },
  cardImage,
  sections[]{
    _type,
    _key,
    title,
    content,
    alertType, alertTitle, alertContent,
    tableTitle, headers,
    rows[]{ _type, _key, cells, label, values },
    footnote,
    listTitle, items,
    diagramId, image, alt, caption,
    svg
  },
  penalty,
  sortOrder
`;

// ── 서비스 목록 (모든 서비스) ──
export async function getAllServices() {
  try {
    return await cached("services", () =>
      sanityClient.fetch(
      `*[_type == "service" && ${DRAFT_FILTER}] | order(sortOrder asc) { ${SERVICE_FIELDS} }`,
      ),
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
      `*[_type == "service" && ${DRAFT_FILTER} && slug.current == $slug][0] { ${SERVICE_FIELDS} }`,
      { slug },
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
      `*[_type == "notice" && ${DRAFT_FILTER}] | order(isPinned desc, publishedAt desc) {
        _id,
        title,
        category,
        excerpt,
        content,
        publishedAt,
        isPinned,
        attachments[]{ _key, _type, description, asset }
      }`,
    );
  } catch (error) {
    console.error("Failed to fetch notices:", error);
    return [];
  }
}

// ── Notices.tsx 호환 exports ──
export const NOTICES_QUERY = `*[_type == "notice" && ${DRAFT_FILTER}] | order(isPinned desc, publishedAt desc) {
  _id,
  title,
  category,
  excerpt,
  "body": content,
  publishedAt,
  isPinned,
  attachments[]{ _key, _type, description, asset }
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
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dimensions}.${format}${w}`;
}

export function sanityFileUrl(ref: string) {
  if (!ref) return "";
  const [, id, ext] = ref.split("-");
  return `https://cdn.sanity.io/files/${PROJECT_ID}/${DATASET}/${id}.${ext}`;
}

// ── 특정 공지사항 ──
export async function getNoticeById(id: string) {
  try {
    return await sanityClient.fetch(
      `*[_type == "notice" && ${DRAFT_FILTER} && _id == $id][0] {
        _id,
        title,
        category,
        excerpt,
        content,
        publishedAt,
        isPinned,
        attachments[]{ _key, _type, description, asset }
      }`,
      { id },
    );
  } catch (error) {
    console.error("Failed to fetch notice by id:", error);
    return null;
  }
}
