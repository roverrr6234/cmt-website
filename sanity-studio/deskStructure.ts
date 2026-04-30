import type { StructureBuilder } from "sanity/structure";

/**
 * Sanity Studio 좌측 메뉴(Desk) 구조.
 *
 * - ⭐ 서비스 관리 (5대 서비스): 가장 상단. 클릭하면 서비스 도큐먼트 목록.
 * - 사이트 콘텐츠 4종은 싱글톤(고정 ID)으로 1개씩만 존재 — "새로 만들기" 버튼이 안 뜸.
 * - 알림마당은 자유롭게 여러 개 추가 가능.
 *
 * 메뉴 텍스트와 이모지는 아버님이 한눈에 찾을 수 있도록 구성.
 */
export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .id("root")
    .title("콘텐츠 관리")
    .items([
      /* ⭐ 주요업무 관리 — 가장 상단 */
      S.listItem()
        .id("services")
        .title("⭐ 주요업무 관리")
        .child(
          S.documentTypeList("service")
            .title("주요업무 목록")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
        ),

      S.divider(),

      /* 사이트 콘텐츠 (싱글톤) */
      S.listItem()
        .id("homePage")
        .title("🏠 홈페이지")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .id("contactPage")
        .title("📞 상담 신청 페이지")
        .child(S.document().schemaType("contactPage").documentId("contactPage")),
      S.listItem()
        .id("noticesPage")
        .title("📢 알림마당 페이지")
        .child(S.document().schemaType("noticesPage").documentId("noticesPage")),
      S.listItem()
        .id("companyInfo")
        .title("🏢 회사 정보")
        .child(S.document().schemaType("companyInfo").documentId("companyInfo")),
      S.listItem()
        .id("siteHeader")
        .title("🔝 헤더")
        .child(S.document().schemaType("siteHeader").documentId("siteHeader")),
      S.listItem()
        .id("siteFooter")
        .title("🔻 푸터")
        .child(S.document().schemaType("siteFooter").documentId("siteFooter")),

      S.divider(),

      /* 알림마당 공지사항 */
      S.listItem()
        .id("notices")
        .title("📰 공지사항 목록")
        .child(
          S.documentTypeList("notice")
            .title("공지사항")
            .defaultOrdering([
              { field: "isPinned", direction: "desc" },
              { field: "publishedAt", direction: "desc" },
            ]),
        ),
    ]);
