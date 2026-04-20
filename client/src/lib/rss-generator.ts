/**
 * RSS 피드 생성 유틸리티
 * Sanity CMS에서 가져온 공지사항을 RSS 형식으로 변환
 */

import { SanityNotice } from "./sanity";

export interface RSSItem {
  title: string;
  link: string;
  guid: string;
  category: string;
  pubDate: string;
  description: string;
}

export interface RSSFeed {
  title: string;
  link: string;
  description: string;
  language: string;
  lastBuildDate: string;
  ttl: number;
  items: RSSItem[];
}

/**
 * Sanity 공지사항을 RSS 아이템으로 변환
 */
export function convertNoticeToRSSItem(notice: SanityNotice): RSSItem {
  return {
    title: notice.title,
    link: `https://www.cmtbusan.kr/notices`,
    guid: notice._id,
    category: notice.category,
    pubDate: formatRSSDate(notice.publishedAt),
    description: notice.excerpt || notice.title,
  };
}

/**
 * ISO 날짜를 RSS 형식(RFC 2822)으로 변환
 */
export function formatRSSDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

/**
 * RSS 피드 XML 생성
 */
export function generateRSSXML(feed: RSSFeed): string {
  const items = feed.items
    .map(
      (item) => `
    <item>
      <title><![CDATA[${escapeXML(item.title)}]]></title>
      <link>${escapeXML(item.link)}</link>
      <guid>${escapeXML(item.guid)}</guid>
      <category>${escapeXML(item.category)}</category>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${escapeXML(item.description)}]]></description>
    </item>
  `
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${escapeXML(feed.title)}]]></title>
    <link>${escapeXML(feed.link)}</link>
    <description><![CDATA[${escapeXML(feed.description)}]]></description>
    <language>${feed.language}</language>
    <lastBuildDate>${feed.lastBuildDate}</lastBuildDate>
    <ttl>${feed.ttl}</ttl>
    <image>
      <url>https://www.cmtbusan.kr/logo.png</url>
      <title><![CDATA[${escapeXML(feed.title)}]]></title>
      <link>${escapeXML(feed.link)}</link>
    </image>
    ${items}
  </channel>
</rss>`;
}

/**
 * XML 특수 문자 이스케이프
 */
function escapeXML(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Sanity 공지사항 배열을 RSS 피드로 변환
 */
export function createRSSFeed(notices: SanityNotice[]): RSSFeed {
  const items = notices
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 50) // 최근 50개만 포함
    .map(convertNoticeToRSSItem);

  return {
    title: "화학물질관리기술 - 알림마당",
    link: "https://www.cmtbusan.kr/notices",
    description:
      "화학물질관리법과 산업안전보건법에 관련된 최신 뉴스, 법령 개정사항, 공지사항을 제공합니다.",
    language: "ko-kr",
    lastBuildDate: new Date().toUTCString(),
    ttl: 3600, // 1시간
    items,
  };
}
