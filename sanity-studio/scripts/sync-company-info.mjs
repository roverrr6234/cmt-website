/**
 * companyInfo 도큐먼트의 텍스트를 라이브 사이트(serviceData.ts) 와 동일하게 맞춘다.
 *
 * 실행:
 *   node scripts/sync-company-info.mjs
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

/**
 * 라이브 사이트의 정확한 값.
 * client/src/lib/serviceData.ts companyInfo + Footer.tsx 의 하드코딩 값과 매칭.
 */
const liveValues = {
  companyName: "화학물질관리기술(CMT)",
  ceoName: "전규탁",
  businessNumber: "785-17-02316",
  phone: "051-412-7707",
  email: "ckt9054@naver.com",
  address: "부산광역시 영도구 꿈나무길 261 (2층)",
};

console.log("Patching companyInfo doc to match live site...");

const resp = await fetch(
  `https://${PROJECT_ID}.api.sanity.io/v2024-12-01/data/mutate/${DATASET}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      mutations: [{ patch: { id: "companyInfo", set: liveValues } }],
    }),
  },
);

const data = await resp.json();
if (!resp.ok) {
  console.error("❌ Failed:", JSON.stringify(data, null, 2));
  process.exit(1);
}
console.log("✅ Updated companyInfo:");
console.log(JSON.stringify(data, null, 2));
