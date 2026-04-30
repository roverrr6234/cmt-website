/**
 * homePage 도큐먼트의 텍스트를 라이브 사이트(client/src/pages/Home.tsx) 와 동일하게 맞춘다.
 *
 * 목적: Home.tsx 가 Sanity homePage 도큐먼트를 읽도록 와이어링한 직후에
 * 사용자에게 보이는 텍스트가 변하지 않도록 미리 동기화.
 *
 * 일치하는 필드(stats, whyChooseItems 등)는 patch 에 포함하지 않아 그대로 유지.
 *
 * 실행:
 *   node scripts/sync-home-page.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envText = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf-8");
const TOKEN = envText.match(/SANITY_AUTH_TOKEN=(.+)/)?.[1].trim();
const PROJECT_ID = "xwuem73x";
const DATASET = "production";
if (!TOKEN) throw new Error("Missing SANITY_AUTH_TOKEN");

/**
 * 라이브 사이트의 정확한 텍스트.
 * client/src/pages/Home.tsx 에서 발췌.
 */
const liveValues = {
  // hero
  heroTitle: "화학사고 예방을 최선으로, 내 회사처럼 일하는 파트너",
  heroSubtitle: "화학물질관리법 · 산업안전보건법 전문 컨설팅",
  heroCtaButton: "무료 상담 신청",

  // about
  aboutTitle: "20년 이상의 EHS 전문 경력,\n신뢰할 수 있는 파트너",
  aboutContent:
    "화학물질관리기술은 화학물질관리법과 산업안전보건법에 근거한 각종 인허가 및 안전 컨설팅을 전문으로 수행하는 기업입니다. 신규 화학물질 취급 공장 설립부터 기존 사업장의 설비 변경까지, 기업이 필요로 하는 모든 화학안전 서비스를 제공합니다.",
  aboutItems: [
    "화학사고예방관리계획서 작성 및 제출 대행",
    "취급시설 설치·정기·수시검사 수검 지원",
    "유해화학물질 영업허가 취득 전 과정 대행",
    "공정안전보고서(PSM) 작성 및 심사 대응",
    "유해위험방지계획서 작성 및 현장 확인 대응",
  ],
  aboutButtonText: "상담 문의하기",

  // services
  servicesTitle: "5대 핵심 서비스",
  servicesDescription:
    "화학물질관리법과 산업안전보건법에 근거한 전문 컨설팅으로 귀사의 법적 의무 이행을 완벽하게 지원합니다.",

  // why choose
  whyChooseTitle: "화학물질관리기술을 선택하는 이유",

  // CTA
  ctaTitle: "화학안전 인허가, 전문가에게 맡기세요",
  ctaDescription:
    "복잡한 법규와 절차, 화학물질관리기술이 함께합니다.\n무료 상담을 통해 귀사에 필요한 서비스를 확인하세요.",
  ctaButtonText: "무료 상담 신청",

  // contact
  contactTitle: "상담 신청",
  contactDescription:
    "화학안전 인허가에 관한 궁금한 점이 있으시면 언제든지 문의해 주세요. 전문 컨설턴트가 빠르게 답변 드리겠습니다.",
};

console.log("Patching homePage doc to match live site values...");

const resp = await fetch(
  `https://${PROJECT_ID}.api.sanity.io/v2024-12-01/data/mutate/${DATASET}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      mutations: [{ patch: { id: "homePage", set: liveValues } }],
    }),
  },
);

const data = await resp.json();
if (!resp.ok) {
  console.error("❌ Failed:", JSON.stringify(data, null, 2));
  process.exit(1);
}
console.log("✅ Updated homePage:");
console.log(JSON.stringify(data, null, 2));
