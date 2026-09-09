import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";

const sanity = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || "xwuem73x",
  dataset: process.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const BASE = "https://www.cmtbusan.kr";
const DRAFT = `!(_id in path("drafts.**"))`;

function xml(urls: { loc: string; lastmod: string; priority: string; changefreq: string }[]) {
  const items = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const [services, notices] = await Promise.all([
      sanity.fetch<{ slug: { current: string }; _updatedAt: string }[]>(
        `*[_type == "service" && ${DRAFT}]{ slug, _updatedAt } | order(sortOrder asc)`
      ),
      sanity.fetch<{ _id: string; publishedAt: string; _updatedAt: string }[]>(
        `*[_type == "notice" && ${DRAFT} && defined(title)] | order(publishedAt desc)[0...200]{ _id, publishedAt, _updatedAt }`
      ),
    ]);

    const urls = [
      { loc: `${BASE}/`, lastmod: today, priority: "1.0", changefreq: "weekly" },
      { loc: `${BASE}/notices`, lastmod: today, priority: "0.8", changefreq: "weekly" },
      { loc: `${BASE}/contact`, lastmod: today, priority: "0.8", changefreq: "monthly" },
      ...services.map((s) => ({
        loc: `${BASE}/service/${s.slug?.current}`,
        lastmod: s._updatedAt ? s._updatedAt.slice(0, 10) : today,
        priority: "0.9",
        changefreq: "monthly",
      })),
      // 알림마당 개별 글 — 경로는 client/src/lib/notice-ui.ts 의 noticePath() 와 동일해야 함
      ...notices.map((n) => ({
        loc: `${BASE}/notices/${encodeURIComponent(n._id)}`,
        lastmod: (n._updatedAt || n.publishedAt || today).slice(0, 10),
        priority: "0.7",
        changefreq: "monthly",
      })),
    ].filter((u) => u.loc && !u.loc.includes("undefined"));

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.status(200).send(xml(urls));
  } catch {
    res.status(500).json({ error: "sitemap generation failed" });
  }
}
