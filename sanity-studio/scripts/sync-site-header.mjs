/**
 * siteHeader 싱글톤(헤더 라벨/링크) 동기화.
 * Header.tsx 의 하드코딩 라벨/블로그 URL/로고 alt 와 일치.
 *
 * patch 로 동작 — 기존에 들어있는 logoTextEng 등 다른 필드는 보존되고,
 * 우리가 새로 추가한 필드만 set 한다. 도큐먼트가 없으면 createIfNotExists 로 생성.
 *
 * 실행:
 *   node scripts/sync-site-header.mjs
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

const newFields = {
  logoAlt: "화학물질관리기술 로고",
  topBarPhonePrefix: "상담 문의",
  homeMenuLabel: "홈",
  servicesMenuLabel: "주요 업무",
  noticesMenuLabel: "알림마당",
  blogMenuLabel: "블로그",
  contactMenuLabel: "상담 신청",
  consultButtonLabel: "무료 상담 신청",
  blogUrl: "https://blog.naver.com/ckt9054",
};

console.log("Patching siteHeader doc on 7l80ou25 (preserving existing fields)...");

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
        { createIfNotExists: { _id: "siteHeader", _type: "siteHeader" } },
        { patch: { id: "siteHeader", set: newFields } },
      ],
    }),
  },
);

const data = await resp.json();
if (!resp.ok) {
  console.error("❌ Failed:", JSON.stringify(data, null, 2));
  process.exit(1);
}
console.log("✅ siteHeader patched.");
console.log(JSON.stringify(data, null, 2));
