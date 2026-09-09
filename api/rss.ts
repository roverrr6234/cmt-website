import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";

/**
 * RSS 2.0 피드 — /rss.xml (vercel.json rewrite → /api/rss)
 * Sanity 알림마당 글을 서버에서 생성한다. (기존: 정적 rss.xml + 클라이언트 React 페이지 → 크롤러가 읽지 못함)
 */

const sanity = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || "xwuem73x",
  dataset: process.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const BASE = "https://www.cmtbusan.kr";
const DRAFT = `!(_id in path("drafts.**"))`;

function esc(s: unknown) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function plain(blocks: any, max = 300) {
  if (!Array.isArray(blocks)) return "";
  const t = blocks
    .filter((b) => b?._type === "block" && Array.isArray(b.children))
    .map((b) => b.children.map((c: any) => c?.text ?? "").join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

type Notice = {
  _id: string;
  title: string;
  category?: string;
  excerpt?: string;
  content?: any;
  publishedAt: string;
};

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const notices = await sanity.fetch<Notice[]>(
      `*[_type == "notice" && ${DRAFT} && defined(title)] | order(publishedAt desc)[0...50]{
        _id, title, category, excerpt, content, publishedAt
      }`
    );

    const items = notices
      .map((n) => {
        const link = `${BASE}/notices/${encodeURIComponent(n._id)}`;
        const desc = n.excerpt || plain(n.content);
        const pub = n.publishedAt ? new Date(n.publishedAt).toUTCString() : "";
        return `    <item>
      <title>${esc(n.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      ${n.category ? `<category>${esc(n.category)}</category>` : ""}
      ${pub ? `<pubDate>${pub}</pubDate>` : ""}
      <description>${esc(desc)}</description>
    </item>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>화학물질관리기술(CMT) - 알림마당</title>
    <link>${BASE}/notices</link>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>화학물질관리법과 산업안전보건법 관련 법령 개정, 공지사항, 업무 안내</description>
    <language>ko-kr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.status(200).send(xml);
  } catch {
    res.status(500).send("rss generation failed");
  }
}
