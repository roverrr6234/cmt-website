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

/**
 * 회사 기본 정보 타입
 */
export interface SanityCompanyInfo {
  _id: string;
  companyName: string;
  companyNameEng: string;
  ceoName: string;
  businessNumber: string;
  address: string;
  phone: string;
  email: string;
  businessHours: string;
  description: string;
  logoImage?: { asset: { _ref: string } };
  ceoPhotoImage?: { asset: { _ref: string } };
  ceoGreeting?: string;
}

/**
 * 회사 정보 쿼리
 */
export const COMPANY_INFO_QUERY = `*[_type == "companyInfo"][0] {
  _id,
  companyName,
  companyNameEng,
  ceoName,
  businessNumber,
  address,
  phone,
  email,
  businessHours,
  description,
  logoImage,
  ceoPhotoImage,
  ceoGreeting
}`;

/**
 * 헤더 타입
 */
export interface SanityHeader {
  _id: string;
  logoText: string;
  logoTextEng: string;
  menuItems: Array<{
    _key: string;
    label: string;
    link: string;
  }>;
}

/**
 * 헤더 쿼리
 */
export const HEADER_QUERY = `*[_type == "siteHeader"][0] {
  _id,
  logoText,
  logoTextEng,
  menuItems
}`;

/**
 * 푸터 타입
 */
export interface SanityFooter {
  _id: string;
  businessInfoTitle: string;
  companyNameFooter: string;
  ceoNameFooter: string;
  businessNumberFooter: string;
  addressFooter: string;
  servicesTitle: string;
  servicesList: Array<{
    _key: string;
    label: string;
    link: string;
  }>;
  quickLinksTitle: string;
  quickLinks: Array<{
    _key: string;
    label: string;
    link: string;
    isExternal: boolean;
  }>;
  contactTitle: string;
  phoneFooter: string;
  emailFooter: string;
  hoursFooter: string;
  copyrightText: string;
}

/**
 * 푸터 쿼리
 */
export const FOOTER_QUERY = `*[_type == "siteFooter"][0] {
  _id,
  businessInfoTitle,
  companyNameFooter,
  ceoNameFooter,
  businessNumberFooter,
  addressFooter,
  servicesTitle,
  servicesList,
  quickLinksTitle,
  quickLinks,
  contactTitle,
  phoneFooter,
  emailFooter,
  hoursFooter,
  copyrightText
}`;

/**
 * 서비스 타입
 */
export interface SanityService {
  _id: string;
  title: string;
  shortTitle: string;
  slug: { current: string };
  law: string;
  lawArticle: string;
  iconName: string;
  description: string;
  overview: string;
  penalty: string;
  tasks: string[];
  targets: string[];
  procedure: Array<{
    _key: string;
    step: string;
    detail: string;
  }>;
  documents: string[];
  additionalInfo: string[];
  sections: Array<any>; // 다양한 블록 타입
  cardImage?: { asset: { _ref: string } };
  sortOrder: number;
}

/**
 * 모든 서비스 쿼리
 */
export const SERVICES_QUERY = `*[_type == "service"] | order(sortOrder asc) {
  _id,
  title,
  shortTitle,
  slug,
  law,
  lawArticle,
  iconName,
  description,
  overview,
  penalty,
  tasks,
  targets,
  procedure,
  documents,
  additionalInfo,
  sections,
  cardImage,
  sortOrder
}`;

/**
 * 단일 서비스 쿼리 (slug 기반)
 */
export const SERVICE_BY_SLUG_QUERY = `*[_type == "service" && slug.current == $slug][0] {
  _id,
  title,
  shortTitle,
  slug,
  law,
  lawArticle,
  iconName,
  description,
  overview,
  penalty,
  tasks,
  targets,
  procedure,
  documents,
  additionalInfo,
  sections,
  cardImage,
  sortOrder
}`;

/**
 * 홈페이지 타입
 */
export interface SanityHomePage {
  _id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: { asset: { _ref: string } };
  aboutTitle: string;
  aboutContent: string;
  aboutImage?: { asset: { _ref: string } };
  servicesTitle: string;
  whyChooseTitle: string;
  whyChooseItems: Array<{
    _key: string;
    title: string;
    description: string;
  }>;
  ctaTitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

/**
 * 홈페이지 쿼리
 */
export const HOME_PAGE_QUERY = `*[_type == "homePage"][0] {
  _id,
  heroTitle,
  heroSubtitle,
  heroImage,
  aboutTitle,
  aboutContent,
  aboutImage,
  servicesTitle,
  whyChooseTitle,
  whyChooseItems,
  ctaTitle,
  ctaButtonText,
  ctaButtonLink
}`;
