/**
 * contactPage 싱글톤 도큐먼트의 텍스트를 라이브 사이트(client/src/pages/Contact.tsx) 와
 * 동일하게 맞춘다.
 *
 * 실행:
 *   node scripts/sync-contact-page.mjs
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
  _id: "contactPage",
  _type: "contactPage",
  pageTitle: "상담 신청",
  pageDescription:
    "화학안전 인허가에 관한 궁금한 점이 있으시면 언제든지 문의해 주세요. 전문 컨설턴트가 빠르게 답변 드리겠습니다.",
  breadcrumbLabel: "상담 신청",
  infoSectionTitle: "연락처 정보",
  phoneLabel: "전화 상담",
  phoneSub: "평일 09:00 - 18:00",
  emailLabel: "이메일",
  emailSub: "24시간 접수",
  addressLabel: "주소",
  addressSub: "부산, 울산, 경남 포함 전국 출장 서비스",
  hoursLabel: "상담 시간",
  hoursWeekday: "평일 09:00 - 18:00",
  hoursEmergency: "긴급 건은 전화로 문의해 주세요",
  formSectionTitle: "상담 신청서",
  formInstructions:
    "아래 양식을 작성하시면 이메일로 문의 내용이 전달됩니다. 빠른 시일 내에 전문 컨설턴트가 연락드리겠습니다.",
};

console.log("Creating/replacing contactPage doc on 7l80ou25...");

const resp = await fetch(
  `https://${PROJECT_ID}.api.sanity.io/v2024-12-01/data/mutate/${DATASET}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      mutations: [{ createOrReplace: doc }],
    }),
  },
);

const data = await resp.json();
if (!resp.ok) {
  console.error("❌ Failed:", JSON.stringify(data, null, 2));
  process.exit(1);
}
console.log("✅ contactPage created/updated.");
console.log(JSON.stringify(data, null, 2));
