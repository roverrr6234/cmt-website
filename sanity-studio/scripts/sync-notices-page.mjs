/**
 * noticesPage 싱글톤(/notices 페이지의 라벨/메시지) 동기화.
 * Notices.tsx 의 하드코딩 텍스트와 정확히 일치시킨다.
 *
 * 실행:
 *   node scripts/sync-notices-page.mjs
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

const doc = {
  _id: "noticesPage",
  _type: "noticesPage",
  pageTitle: "알림마당",
  pageDescription:
    "법령 개정, 공지사항, 업계 동향 등 화학물질 관리에 필요한 최신 정보를 안내합니다.",
  categoryAllLabel: "전체",
  loadingText: "불러오는 중...",
  errorText: "데이터를 불러오는 중 오류가 발생했습니다.",
  cachedDataNote: "캐시된 데이터를 표시합니다",
  retryButtonText: "재시도",
  pinnedBadgeText: "상단 고정",
  attachmentsLabel: "첨부파일",
  fileDownloadDefaultText: "파일 다운로드",
  paginationPrev: "이전",
  paginationNext: "다음",
};

console.log("Creating/replacing noticesPage doc on 7l80ou25...");

const resp = await fetch(
  `https://${PROJECT_ID}.api.sanity.io/v2024-12-01/data/mutate/${DATASET}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
  },
);

const data = await resp.json();
if (!resp.ok) {
  console.error("❌ Failed:", JSON.stringify(data, null, 2));
  process.exit(1);
}
console.log("✅ noticesPage created/updated.");
console.log(JSON.stringify(data, null, 2));
