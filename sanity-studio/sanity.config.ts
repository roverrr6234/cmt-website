import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { allSchemaTypes } from "./schemas";
import { deskStructure } from "./deskStructure";

/**
 * 화학물질관리기술(CMT) Sanity Studio
 *
 * - Project ID: xwuem73x
 * - Dataset:    production
 * - 메뉴 구성:  ⭐ 서비스 관리(5대 서비스) / 🏠 홈페이지 / 🏢 회사정보 / 🔝 헤더 / 🔻 푸터 / 📢 알림마당
 *
 * 배포: 같은 폴더에서 `npx sanity deploy` 실행. 인터랙티브로 호스트 이름을 묻는데,
 * 기존 *.sanity.studio 의 서브도메인을 그대로 입력하면 덮어쓰기 된다.
 */
export default defineConfig({
  name: "cmt-studio",
  title: "화학물질관리기술 (CMT) — 콘텐츠 관리",

  projectId: "xwuem73x",
  dataset: "production",

  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(),
  ],

  schema: {
    types: allSchemaTypes,
  },
});
