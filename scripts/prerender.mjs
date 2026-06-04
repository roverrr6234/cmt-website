/**
 * Post-build SSG prerender script
 *
 * 빌드 후 Sanity에서 실제 데이터를 받아 각 페이지의 정적 HTML 파일을 생성합니다.
 * - dist/public/service/{slug}/index.html
 * - dist/public/notices/index.html
 * - dist/public/contact/index.html
 *
 * Vercel은 정적 파일을 rewrite보다 먼저 서빙하므로
 * 크롤러(구글봇·네이버봇)는 실제 콘텐츠가 담긴 HTML을 받게 됩니다.
 * 사용자(JS 활성)는 React SPA로 정상 동작합니다.
 *
 * 실패해도 빌드 자체는 계속 진행됩니다(non-fatal).
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist/public");
const DRAFT = `!(_id in path("drafts.**"))`;

/* HTML 특수문자 이스케이프 */
function esc(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * base HTML(SPA 셸)에 페이지별 메타 + 본문 + 추가 JSON-LD를 주입합니다.
 * React는 createRoot().render()로 root 내용을 완전히 교체하므로 hydration 충돌 없음.
 */
function injectPage(baseHtml, {
  title,
  description,
  canonical,
  ogUrl,
  ogTitle,
  ogDesc,
  ogType = "website",
  bodyHtml,
  extraJsonLd = [],   // 추가 JSON-LD 객체 배열
}) {
  let html = baseHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1${description}"`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${canonical}"`)
    .replace(/(<meta property="og:type" content=")[^"]*"/, `$1${ogType}"`)
    .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${ogUrl}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${ogTitle}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${ogDesc}"`)
    .replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${ogTitle}"`)
    .replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${ogDesc}"`)
    .replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

  // 추가 JSON-LD 블록을 </head> 직전에 삽입
  // < → < 이스케이프: Sanity 데이터에 </script>가 포함돼도 스크립트 태그를 벗어나지 못함
  if (extraJsonLd.length > 0) {
    const ldBlocks = extraJsonLd
      .map(obj => {
        const safe = JSON.stringify(obj, null, 2).replace(/</g, "\\u003c");
        return `  <script type="application/ld+json">\n  ${safe}\n  </script>`;
      })
      .join("\n");
    html = html.replace("</head>", `${ldBlocks}\n</head>`);
  }

  return html;
}

function writeFile(relPath, html) {
  const abs = path.join(DIST, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, html, "utf-8");
  console.log(`[prerender] ✓  /${relPath}`);
}

function listItems(arr) {
  return (arr || [])
    .filter(Boolean)
    .map((s) => `<li>${esc(s)}</li>`)
    .join("");
}

async function main() {
  console.log("[prerender] 시작...");

  const shellPath = path.join(DIST, "index.html");
  if (!fs.existsSync(shellPath)) {
    console.warn("[prerender] dist/public/index.html 없음 — 건너뜁니다");
    return;
  }

  const baseHtml = fs.readFileSync(shellPath, "utf-8");

  const sanity = createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID || "xwuem73x",
    dataset: process.env.VITE_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    useCdn: true,
  });

  /* ── 1. 서비스 상세 페이지 ── */
  let services = [];
  try {
    services = await sanity.fetch(
      `*[_type == "service" && ${DRAFT}] | order(sortOrder asc) {
        _id, title, shortTitle, slug, description, overview, law, lawArticle,
        tasks, targets, documents, penalty,
        procedure[]{ step, detail }
      }`
    );
    console.log(`[prerender] 서비스 ${services.length}개 수신`);
  } catch (e) {
    console.warn("[prerender] Sanity 서비스 조회 실패:", e.message);
  }

  for (const svc of services) {
    const slug =
      typeof svc.slug === "string" ? svc.slug : svc.slug?.current;
    if (!slug || !svc.title) continue;

    const title = `${esc(svc.title)} | 화학물질관리기술(CMT)`;
    const rawDesc =
      svc.overview ||
      `${svc.title} 전문 컨설팅 — 화학물질관리기술(CMT)`;
    const desc = esc(rawDesc.substring(0, 155));
    const url = `https://www.cmtbusan.kr/service/${slug}`;

    const procItems = (svc.procedure || [])
      .filter((p) => p?.step)
      .map(
        (p, i) =>
          `<li><strong>${i + 1}단계: ${esc(p.step)}</strong><p>${esc(p.detail)}</p></li>`
      )
      .join("");

    const tasksHtml = listItems(svc.tasks);
    const targetsHtml = listItems(svc.targets);
    const docsHtml = listItems(svc.documents);

    const bodyHtml = `
<article itemscope itemtype="https://schema.org/Service">
  <nav aria-label="breadcrumb">
    <a href="/">홈</a> &gt;
    <span>주요 업무</span> &gt;
    <span itemprop="name">${esc(svc.shortTitle || svc.title)}</span>
  </nav>
  <h1 itemprop="name">${esc(svc.title)}</h1>
  <p><em>${esc(svc.law)} ${esc(svc.lawArticle)}</em></p>
  <p itemprop="description">${esc(svc.overview)}</p>
  ${svc.penalty ? `<p><strong>벌칙 규정:</strong> ${esc(svc.penalty)}</p>` : ""}
  ${tasksHtml ? `<section><h2>업무 내용</h2><ul>${tasksHtml}</ul></section>` : ""}
  ${targetsHtml ? `<section><h2>대상</h2><ul>${targetsHtml}</ul></section>` : ""}
  ${docsHtml ? `<section><h2>필요 서류</h2><ul>${docsHtml}</ul></section>` : ""}
  ${procItems ? `<section><h2>제출 절차</h2><ol>${procItems}</ol></section>` : ""}
  <section>
    <h2>무료 상담 신청</h2>
    <p>화학물질관리기술(CMT) 전문 컨설턴트에게 문의하세요.</p>
    <p>전화: <a href="tel:+82-51-412-7707">051-412-7707</a></p>
    <p>이메일: <a href="mailto:ckt9054@naver.com">ckt9054@naver.com</a></p>
  </section>
</article>`;

    // 서비스 페이지 전용 JSON-LD (Service + BreadcrumbList)
    const extraJsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": svc.title,
        "description": rawDesc.substring(0, 155),
        "url": url,
        "provider": { "@id": "https://www.cmtbusan.kr/#organization" },
        "areaServed": "부산, 울산, 경남 포함 전국",
        "serviceType": svc.law
          ? `${svc.law} ${svc.lawArticle}`
          : "화학안전 컨설팅",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "홈",
            "item": "https://www.cmtbusan.kr",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "주요 업무",
            "item": "https://www.cmtbusan.kr/#services",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": svc.title,
            "item": url,
          },
        ],
      },
    ];

    const html = injectPage(baseHtml, {
      title,
      description: desc,
      canonical: url,
      ogUrl: url,
      ogTitle: title,
      ogDesc: desc,
      ogType: "article",
      bodyHtml,
      extraJsonLd,
    });
    writeFile(`service/${slug}/index.html`, html);
  }

  /* ── 2. 알림마당 ── */
  let notices = [];
  try {
    notices = await sanity.fetch(
      `*[_type == "notice" && ${DRAFT}] | order(isPinned desc, publishedAt desc)[0...30] {
        _id, title, excerpt, publishedAt, category
      }`
    );
    console.log(`[prerender] 공지 ${notices.length}개 수신`);
  } catch (e) {
    console.warn("[prerender] Sanity 공지 조회 실패:", e.message);
  }

  {
    const items = notices
      .map(
        (n) => `
<article>
  <h2>${esc(n.title)}</h2>
  ${n.category ? `<p><small>${esc(n.category)}</small></p>` : ""}
  ${n.excerpt ? `<p>${esc(n.excerpt)}</p>` : ""}
  ${n.publishedAt ? `<time datetime="${n.publishedAt.slice(0, 10)}">${n.publishedAt.slice(0, 10)}</time>` : ""}
</article>`
      )
      .join("\n");

    const noticDesc =
      "화학물질관리기술(CMT) 공지사항 및 법령 개정 안내. 화학사고예방관리계획서, 설치검사, PSM, 영업허가, 유해위험방지계획서 최신 정보.";
    const noticUrl = "https://www.cmtbusan.kr/notices";
    const noticTitle = "알림마당 | 화학물질관리기술(CMT)";

    const bodyHtml = `
<section>
  <h1>알림마당</h1>
  <p>${esc(noticDesc)}</p>
  ${items}
</section>`;

    writeFile(
      "notices/index.html",
      injectPage(baseHtml, {
        title: noticTitle,
        description: esc(noticDesc),
        canonical: noticUrl,
        ogUrl: noticUrl,
        ogTitle: noticTitle,
        ogDesc: esc(noticDesc),
        ogType: "website",
        bodyHtml,
        extraJsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://www.cmtbusan.kr" },
              { "@type": "ListItem", "position": 2, "name": "알림마당", "item": noticUrl },
            ],
          },
        ],
      })
    );
  }

  /* ── 3. 상담 신청 ── */
  {
    const contactDesc =
      "화학안전 인허가 무료 상담 신청. 화학사고예방관리계획서, 설치검사, PSM(공정안전보고서), 영업허가, 유해위험방지계획서 전문 컨설팅 — 화학물질관리기술(CMT).";
    const contactUrl = "https://www.cmtbusan.kr/contact";
    const contactTitle = "상담 신청 | 화학물질관리기술(CMT)";

    const bodyHtml = `
<section itemscope itemtype="https://schema.org/ContactPage">
  <h1>상담 신청</h1>
  <p>${esc(contactDesc)}</p>
  <address>
    <p>전화: <a href="tel:+82-51-412-7707">051-412-7707</a></p>
    <p>이메일: <a href="mailto:ckt9054@naver.com">ckt9054@naver.com</a></p>
    <p>주소: 부산광역시 영도구 꿈나무길 261 (2층)</p>
    <p>운영시간: 월요일–금요일 09:00–18:00</p>
    <p>서비스 지역: 부산, 울산, 경남 포함 전국</p>
  </address>
</section>`;

    writeFile(
      "contact/index.html",
      injectPage(baseHtml, {
        title: contactTitle,
        description: esc(contactDesc),
        canonical: contactUrl,
        ogUrl: contactUrl,
        ogTitle: contactTitle,
        ogDesc: esc(contactDesc),
        ogType: "website",
        bodyHtml,
        extraJsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://www.cmtbusan.kr" },
              { "@type": "ListItem", "position": 2, "name": "상담 신청", "item": contactUrl },
            ],
          },
        ],
      })
    );
  }

  console.log("[prerender] 완료!");
}

main().catch((e) => {
  /* 빌드를 실패시키지 않기 위해 에러를 잡아 로그만 남깁니다 */
  console.error("[prerender] 오류 (non-fatal):", e?.message ?? e);
});
