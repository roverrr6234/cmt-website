/**
 * 로컬 정적 이미지 경로.
 * 2026-09-10: Manus CDN(d2xsxph8kpxj0f.cloudfront.net)의 hero/cta/about/service 이미지는 전부 403(삭제됨)이라 제거.
 * 홈 Hero/CTA 배경은 CSS(네이비 그라데이션)로 대체.
 *
 * 아래 서비스 상세 이미지 11장은 Sanity 응답이 없을 때만 쓰이는 serviceData.ts 폴백 전용이며,
 * 파일이 client/public/manus-storage/ 에 없어 실제로는 404다 (운영은 Sanity `sections` 이미지 사용).
 */
export const images = {
  logo: "/manus-storage/logo_ab75d543.png",

  // serviceData.ts 폴백 전용 (파일 없음 — 참조 유지만)
  preventionFlowJudge: "/manus-storage/1.jpg_fed930f8.jpeg",
  preventionMaxCalc: "/manus-storage/2.jpg_d7ee7514.webp",
  preventionCompare: "/manus-storage/3.jpg_7d5e41b2.jpeg",
  preventionProcess: "/manus-storage/4.jpg_22d53c58.png",
  inspectionFacilityTypes: "/manus-storage/5.jpg_32264a08.png",
  inspectionSchedule: "/manus-storage/6.jpg_eddec92a.png",
  inspectionConsulting: "/manus-storage/7.jpg_d37e4cff.png",
  psmComponents: "/manus-storage/8.jpg_fc74c18b.png",
  psmConsulting: "/manus-storage/9.jpg_26a10c22.png",
  hazardReview: "/manus-storage/10.jpg_085877be.png",
  hazardConsulting: "/manus-storage/11.jpg_36ad6083.png",
};
