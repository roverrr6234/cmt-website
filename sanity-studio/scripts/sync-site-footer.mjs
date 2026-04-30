/**
 * siteFooter 싱글톤의 SEO 하단 문구 + 누락된 라벨 동기화.
 * Footer.tsx 의 하드코딩 텍스트와 일치.
 *
 * patch 로 동작 — 기존 quickLinks 등 컬렉션 필드는 보존, 빈 라벨만 채움.
 *
 * 실행:
 *   node scripts/sync-site-footer.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envText = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf-8");
const TOKEN = envText.match(/SANITY_AUTH_TOKEN=(.+)/)?.[1].trim();
const PROJECT_ID = "7l80ou25";
const DATASET = "production";
if (!TOKEN) throw new Error("Missing SANITY_AUTH_TOKEN");

/* setIfMissing 으로 빈 라벨/카피 텍스트만 채우고, 이미 값이 있으면 보존 */
const setIfMissing = {
  businessInfoTitle: "사업자 정보",
  contactTitle: "연락처",
  servicesTitle: "주요 업무",
  quickLinksTitle: "바로가기",
  copyrightText: `© ${new Date().getFullYear()} 화학물질관리기술. All rights reserved.`,
  companyNameFooter: "화학물질관리기술(CMT)",
  ceoNameFooter: "전규탁",
  businessNumberFooter: "785-17-02316",
  addressFooter: "부산광역시 영도구 꿈나무길 261 (2층)",
  phoneFooter: "051-412-7707",
  emailFooter: "ckt9054@naver.com",
};

/* SEO 텍스트는 항상 최신값으로 set */
const setAlways = {
  seoBottomText:
    "부산, 울산, 경남 포함 전국 화학안전 컨설팅 | 화학사고예방관리계획서 | 설치검사 | 영업허가 | PSM | 유해위험방지계획서",
};

console.log("Patching siteFooter on 7l80ou25...");

const resp = await fetch(
  `https://${PROJECT_ID}.api.sanity.io/v2024-12-01/data/mutate/${DATASET}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      mutations: [
        { createIfNotExists: { _id: "siteFooter", _type: "siteFooter" } },
        { patch: { id: "siteFooter", setIfMissing } },
        { patch: { id: "siteFooter", set: setAlways } },
      ],
    }),
  },
);

const data = await resp.json();
if (!resp.ok) {
  console.error("❌ Failed:", JSON.stringify(data, null, 2));
  process.exit(1);
}
console.log("✅ siteFooter patched.");
console.log(JSON.stringify(data, null, 2));
