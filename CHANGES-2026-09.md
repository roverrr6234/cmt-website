# cmtbusan.kr 점검·수정 내역 (2026-09-10)

브랜치: `fix/seo-notices-2026-09` · 기준: `main` (2026-09-10 시점)

## 왜 고쳤나 (점검 결과 요약)

| # | 발견 | 영향 | 상태 |
|---|------|------|------|
| 1 | 알림마당 글이 아코디언(펼침)이라 글별 URL이 없고 목록에 `<a href>`가 0개 | 4월~9월에 올린 글 전부 검색엔진 색인 불가 → 검색 유입 0 | **수정** |
| 2 | `client/public/sitemap.xml` 정적 파일이 `/api/sitemap` 리라이트보다 먼저 서빙됨 (lastmod 2026-06-04 고정, URL 8개) | 동적 사이트맵이 무시됨. 알림마당 글 사이트맵 미등록 | **수정** |
| 3 | `client/public/rss.xml` 정적 파일에 4월 20일자 폴백(가짜) 글 2개 고정. `/rss` React 페이지는 크롤러가 못 읽음 | RSS 구독/네이버 수집에 잘못된 내용 노출 | **수정** |
| 4 | `index.html`의 Umami 분석 스크립트 `%VITE_ANALYTICS_ENDPOINT%` 미치환 (Vercel에 변수 없음 + CSP가 외부 스크립트 차단) | 방문자 통계 전무. 매 방문마다 404 요청 1회 | **수정** (Vercel Web Analytics로 교체) |
| 5 | `og:url` / `og:title` / `og:description` / `canonical` / `description`이 정적 태그 + Helmet 태그로 **두 벌** 렌더링 | 카톡/페북 공유 시 어느 값이 잡힐지 불확실 | **수정** |
| 6 | viewport `maximum-scale=1` | 모바일 확대 불가 (접근성) | **수정** |
| 7 | 알림마당 필터 버튼(`법령개정/업계동향`)이 Sanity 스키마 카테고리(`법규 안내/업무 안내/기타`)와 불일치 | "법규 안내" 글 필터 불가, 배지 색상 누락 | **수정** (데이터 기반 동적 필터) |
| 8 | 메인 CTA 버튼 문구 "무료 상담 신청**테스트**" | 첫 화면 신뢰도 | **코드 아님** — Sanity Studio에서 수정 필요 (아래) |
| 9 | 상담 폼은 `/api/send-email` (SMTP + Upstash) 사용. 환경변수 8개 미설정 시 상담 전부 실패 | 상담 유실 가능성 | **확인 필요** (아래) |
| 10 | `desktop.ini` 커밋됨 | 없음 (정리) | 삭제 |
| 11 | **Sanity 웹훅 서명 검증 버그** — 타임스탬프를 초로(실제는 밀리초), 서명을 hex로(실제는 base64url) 비교 → 6월 5일 이후 모든 웹훅이 401 | Sanity에 글을 올려도 Vercel 재배포가 안 됨 → 크롤러용 HTML이 6월 5일에 멈춤 | **수정** (`@sanity/webhook` 공식 검증으로 교체, 6개 케이스 테스트) |
| 12 | Vercel에 `SMTP_FROM_EMAIL` 누락 | 상담 메일 발신 실패 가능성 | **수정** (2026-09-10 Vercel에 추가, 재배포 시 적용) |

SEO 태그, 구조화 데이터(Organization/LocalBusiness), robots.txt, 서비스 5개 페이지 프리렌더링, Google/네이버 인증 태그는 이미 정상이라 손대지 않았습니다.

## 변경 파일

- `client/src/pages/NoticeDetail.tsx` **(신규)** — `/notices/:id` 글 상세 페이지. 글별 title/description/canonical/OG + Article/BreadcrumbList JSON-LD. 없는 글은 404 안내 + `noindex`.
- `client/src/lib/notice-ui.tsx` **(신규)** — 목록/상세 공용: Portable Text 렌더러, 카테고리 색상, 날짜, `noticePath()`.
- `client/src/pages/Notices.tsx` — 아코디언 → 글 상세 링크. 카테고리 필터를 데이터 기반으로.
- `client/src/App.tsx` — `/notices/:id` 라우트 추가, `/rss` React 라우트 제거, `<Analytics />` 추가.
- `scripts/prerender.mjs` — 알림마당 **개별 글 정적 HTML** 생성(`dist/public/notices/<id>/index.html`, 본문·첨부·JSON-LD 포함), 목록에 링크 삽입, `data-rh` 태그 호환.
- `api/sitemap.ts` — 알림마당 글 URL 포함 (최대 200개).
- `api/rss.ts` **(신규)** — 서버에서 RSS 2.0 생성.
- `api/sanity-webhook.ts` — 서명 검증을 `@sanity/webhook`(공식)으로 교체. 밀리초 타임스탬프 5분 창, base64url 서명. Legacy `?token=` 방식은 호환 유지.
- `vercel.json` — `/rss.xml → /api/rss` 리라이트, CSP `script-src`에 `https://va.vercel-scripts.com` 추가.
- `client/index.html` — Umami 태그 제거, viewport 수정, Helmet이 관리하는 5개 태그에 `data-rh="true"` (중복 제거).
- `package.json` — `@vercel/analytics`, `@sanity/webhook` 추가.
- 삭제: `client/public/sitemap.xml`, `client/public/rss.xml`, `client/src/pages/RSSFeed.tsx`, `client/src/lib/rss-generator.ts`, `desktop.ini`.

## 검증한 것

- `pnpm run check` (tsc) 통과, `pnpm build` (vite + prerender + esbuild) 통과.
- 프리렌더는 Sanity 접근이 막힌 환경이라 **모의 데이터**로 실행: 글별 HTML, 이스케이프(`"`, `&`, `</script>`), 링크/굵게/목록/이미지/첨부 변환, JSON-LD 3개, 목록 링크 생성 확인.
- 실제 Sanity 데이터로는 Vercel 빌드 로그에서 `[prerender] 알림마당 개별 페이지 N개 생성` 줄로 확인할 것.

## 배포 전 체크리스트 (순서대로)

1. **Vercel 환경변수 확인** (Settings → Environment Variables). 값이 아니라 존재 여부만:
   - 상담 폼: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL`, `SMTP_RECIPIENT_EMAIL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — 하나라도 없으면 상담 신청이 전부 500 에러.
   - 자동 재배포: `SANITY_WEBHOOK_SECRET`, `VERCEL_DEPLOY_HOOK_URL` — 없으면 새 글이 프리렌더 HTML에 반영되려면 수동 재배포 필요 (사이트 자체는 동적으로 정상 동작).
     - 2026-09-10: 시크릿을 새 키로 교체하고 Sanity에 GROQ-powered webhook `vercel-redeploy`(POST, production, create/update/delete)를 생성함. Sanity 관리 화면과 Vercel의 값이 **같아야** 동작. 6월 5일자 Legacy webhook(URL에 옛 토큰 노출)은 삭제.
   - 더 이상 필요 없음: `VITE_ANALYTICS_ENDPOINT`, `VITE_ANALYTICS_WEBSITE_ID` (있어도 무해).
2. **Vercel → 프로젝트 → Analytics 탭 → Enable** (Web Analytics). 이걸 켜야 `<Analytics />`가 수집을 시작함. 무료 플랜 포함.
3. 브랜치를 Preview 배포로 먼저 확인:
   - `/notices` 목록에서 글 클릭 → `/notices/<id>` 로 이동하고 본문·첨부 표시
   - `/sitemap.xml` 에 `/notices/...` URL이 보이는지
   - `/rss.xml` 에 실제 글이 보이는지
   - 상담 폼 1회 제출 → 메일 수신 확인 (제목에 "테스트" 명시)
   - 모바일에서 핀치 줌 되는지
4. `main` 에 머지 → Production 배포.
5. **Sanity Studio** (`homePage` 문서 → Hero CTA 버튼 텍스트) 에서 "무료 상담 신청테스트" → "무료 상담 신청" 으로 수정. 저장 즉시 반영됨 (재배포 불필요).
6. 배포 후:
   - Google Search Console → 사이트맵 → `https://www.cmtbusan.kr/sitemap.xml` 재제출
   - 네이버 서치어드바이저 → 요청 → 사이트맵 제출 → 같은 URL 재제출, RSS 제출에 `https://www.cmtbusan.kr/rss.xml`
   - 1~2주 후 Search Console "페이지" 리포트에서 `/notices/...` 색인 여부 확인

## 롤백

문제가 생기면 Vercel → Deployments → 이전 배포 → "Promote to Production" (1분). 코드 롤백은 `git revert` 한 커밋.

## 손대지 않은 것 / 추후 과제

- 페이지 멈춤 현상: 코드에서 무한 루프·리스너 누수는 발견되지 않음 (카운터 rAF는 2초 후 종료, 옵저버 정상 해제). 점검 도구(Chrome 확장) 쪽 문제로 추정되나 배포 후 실기기에서 알림마당 클릭·스크롤 확인 권장.
- 서비스 페이지 프리렌더에서 `sections[]`(표·알림 블록)는 정적 HTML에 미포함 — 기존 동작 유지.
- Sanity `useCdn: false`는 CLAUDE.md 규칙대로 유지.
- 검색 유입을 늘리려면 알림마당에 "대상·기한·과태료·절차" 형태의 안내글을 꾸준히 올리는 것이 코드보다 효과가 큼.
