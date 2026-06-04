/**
 * CMT 부산 og-image.png 생성 스크립트
 * pnpm node scripts/generate-og-image.mjs
 */
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../client/public/og-image.png");

/* ── 색상 팔레트 ── */
const NAVY       = "#0a1628";
const NAVY_LIGHT = "#112040";
const GOLD       = "#c9a84c";
const GOLD_LIGHT = "#e8c76a";
const WHITE      = "#ffffff";
const WHITE_DIM  = "rgba(255,255,255,0.55)";

const W = 1200;
const H = 630;

const canvas = createCanvas(W, H);
const ctx    = canvas.getContext("2d");

/* ══════════════════════════════
 * 1. 배경
 * ══════════════════════════════ */
// 전체 네이비 배경
ctx.fillStyle = NAVY;
ctx.fillRect(0, 0, W, H);

// 우측 상단 장식용 원형 그라데이션
const grad = ctx.createRadialGradient(1050, 80, 0, 1050, 80, 380);
grad.addColorStop(0, "rgba(201,168,76,0.12)");
grad.addColorStop(1, "rgba(201,168,76,0)");
ctx.fillStyle = grad;
ctx.fillRect(0, 0, W, H);

// 좌측 세로 골드 바
ctx.fillStyle = GOLD;
ctx.fillRect(0, 0, 8, H);

/* ══════════════════════════════
 * 2. 상단 골드 구분선
 * ══════════════════════════════ */
ctx.fillStyle = GOLD;
ctx.fillRect(60, 72, 60, 4);

/* ══════════════════════════════
 * 3. 텍스트 — 영문 폰트 기반 레이아웃
 * ══════════════════════════════ */

// CMT — 대형 이니셜
ctx.save();
ctx.font = "bold 140px serif";
ctx.fillStyle = GOLD;
ctx.fillText("CMT", 60, 220);
ctx.restore();

// 구분 수평선
ctx.strokeStyle = GOLD;
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(60, 248);
ctx.lineTo(560, 248);
ctx.stroke();

// 회사 영문명
ctx.save();
ctx.font = "bold 38px sans-serif";
ctx.fillStyle = WHITE;
ctx.fillText("Chemical Management Technology", 60, 310);
ctx.restore();

// 한국어 회사명 (영문 대체 표기)
ctx.save();
ctx.font = "28px sans-serif";
ctx.fillStyle = "rgba(255,255,255,0.75)";
ctx.fillText("Hwahak Mulljil Gwanri Gisul", 60, 358);
ctx.restore();

// 태그라인 영문
ctx.save();
ctx.font = "22px sans-serif";
ctx.fillStyle = GOLD_LIGHT;
ctx.fillText("Chemical Safety Consulting  |  EHS Permit  |  PSM", 60, 420);
ctx.restore();

// 서비스 뱃지들
const badges = [
  "Prevention Plan",
  "Installation Inspection",
  "Business License",
  "PSM Report",
  "Hazard Prevention",
];
let bx = 60;
const by = 480;
ctx.font = "16px sans-serif";
badges.forEach((b) => {
  const w = ctx.measureText(b).width + 28;
  // 뱃지 배경
  ctx.fillStyle = "rgba(201,168,76,0.15)";
  roundRect(ctx, bx, by, w, 34, 4);
  ctx.fill();
  // 뱃지 테두리
  ctx.strokeStyle = "rgba(201,168,76,0.4)";
  ctx.lineWidth = 1;
  roundRect(ctx, bx, by, w, 34, 4);
  ctx.stroke();
  // 뱃지 텍스트
  ctx.fillStyle = GOLD_LIGHT;
  ctx.fillText(b, bx + 14, by + 22);
  bx += w + 10;
});

/* ══════════════════════════════
 * 4. 우측 장식 패널
 * ══════════════════════════════ */
// 우측 반투명 패널
ctx.fillStyle = "rgba(255,255,255,0.04)";
roundRect(ctx, 780, 80, 360, 470, 8);
ctx.fill();

// 패널 상단 골드 선
ctx.fillStyle = GOLD;
ctx.fillRect(780, 80, 360, 4);

// 아이콘 대신 수치 표기
const stats = [
  { value: "20+", label: "Years of Experience" },
  { value: "500+", label: "Projects Completed" },
  { value: "300+", label: "Client Companies" },
  { value: "99%", label: "Client Satisfaction" },
];
stats.forEach((s, i) => {
  const sy = 130 + i * 100;
  ctx.save();
  ctx.font = "bold 46px serif";
  ctx.fillStyle = GOLD;
  ctx.fillText(s.value, 810, sy + 46);
  ctx.font = "15px sans-serif";
  ctx.fillStyle = WHITE_DIM;
  ctx.fillText(s.label, 810, sy + 72);
  // 구분선
  if (i < stats.length - 1) {
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(810, sy + 90);
    ctx.lineTo(1115, sy + 90);
    ctx.stroke();
  }
  ctx.restore();
});

/* ══════════════════════════════
 * 5. 하단 URL 바
 * ══════════════════════════════ */
ctx.fillStyle = "rgba(0,0,0,0.35)";
ctx.fillRect(0, H - 56, W, 56);

ctx.save();
ctx.font = "18px sans-serif";
ctx.fillStyle = WHITE_DIM;
ctx.fillText("www.cmtbusan.kr", 68, H - 20);
ctx.restore();

ctx.save();
ctx.font = "18px sans-serif";
ctx.fillStyle = WHITE_DIM;
const phone = "051-412-7707";
const pw = ctx.measureText(phone).width;
ctx.fillText(phone, W - 68 - pw, H - 20);
ctx.restore();

/* ══════════════════════════════
 * 저장
 * ══════════════════════════════ */
const buf = canvas.toBuffer("image/png");
writeFileSync(OUT, buf);
console.log("✅ og-image.png 생성 완료:", OUT);
console.log("   크기:", W, "×", H, "px |", (buf.length / 1024).toFixed(1), "KB");

/** helper: rounded rect path */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
