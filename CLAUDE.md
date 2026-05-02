# CMT Busan 홈페이지 — Claude 작업 지침

## 프로젝트 정보
- 사이트: https://cmtbusan.kr
- 스택: **Vite + React 19 SPA + Express 백엔드 + Wouter 라우터** (Next.js 아님)
- 패키지매니저: **pnpm 10**
- CMS: Sanity (projectId `xwuem73x`, dataset `production`, Studio https://cmt-busan.sanity.studio)
- 호스팅: Vercel
- 목표: Sanity Studio에서 홈페이지 모든 내용을 수정 가능하게

## 디렉터리 구조 (핵심만)
```
.
├── client/src/             # 프론트엔드
│   ├── App.tsx             # Wouter 라우팅 정의
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── Home.tsx
│   │   ├── ServiceDetail.tsx   # /service/:slug 동적 라우팅
│   │   ├── Notices.tsx
│   │   └── TestSanity.tsx      # Sanity 연동 진단 (이 사이트의 진실 시그널)
│   ├── components/
│   ├── lib/
│   │   ├── sanity.ts       # Sanity 클라이언트 + GROQ 쿼리들
│   │   ├── serviceData.ts  # ⚠️ 5대 서비스 fallback (제거 예정)
│   │   └── images.ts       # ⚠️ 이미지 URL 하드코딩
│   └── ...
├── server/                 # Express 백엔드
├── sanity-studio/          # Sanity Studio 별도 패키지
│   ├── schemas/
│   └── scripts/            # seed/sync 1회성 스크립트
└── .env                    # VITE_SANITY_*, SANITY_AUTH_TOKEN, VERCEL_AUTH_TOKEN
```

## 핵심 규칙 (반드시 지킬 것)

### 작업 방식
1. 작업 전 항상 현재 파일 상태 확인 후 시작
2. 한 번에 하나씩 변경하고 테스트
3. 테스트 없이 다음 단계 절대 진행 금지
4. 에러 발생 시 즉시 멈추고 원인 분석 후 수정

### Sanity 연동 규칙
- `useCdn: false` — Studio 변경이 즉시 반영되어야 함
- `apiVersion`: `2024-01-01` (안정 버전 고정)
- 환경변수는 `import.meta.env.VITE_SANITY_PROJECT_ID` / `VITE_SANITY_DATASET`에서 읽기
- `.env` 누락 시 fallback으로 `xwuem73x` / `production` 사용 (white screen 방지)
- draft 문서는 프론트엔드에 절대 노출 금지
  - 모든 GROQ 쿼리에 `!(_id in path("drafts.**"))` 포함

### 테스트 루프 (필수)
작업 완료 → `pnpm run check` 통과 → `pnpm run dev` →
`localhost:3000/test-sanity`에서 데이터 확인 →
홈페이지에서 실제 반영 확인 → 안 되면 디버그 가이드(`.claude/skills/sanity-debug.md`)

### 하드코딩 금지 (단 fallback 제거 시점은 사용자 트리거)
- 텍스트, 이미지, URL 등 모든 콘텐츠는 Sanity에서 관리
- 레이아웃/스타일 코드만 프론트엔드에 존재
- **새 코드를 작성할 때는 `client/src/lib/serviceData.ts`와 `client/src/lib/images.ts`에 import 의존을 추가하지 않는다** — 두 파일은 곧 제거 대상

### 스키마 설계 원칙
- 서비스 추가 = Sanity Studio에서 `service` document 추가만으로 완결
- slug 기반 동적 라우팅: `App.tsx`의 `<Route path="/service/:slug" component={ServiceDetail} />` (Wouter, 단수형 — 이미 존재)
- 모든 섹션은 재사용 가능한 컴포넌트로 분리

### 라우팅 (Wouter)
```tsx
// client/src/App.tsx 안에서
<Switch>
  <Route path="/" component={Home} />
  <Route path="/service/:slug" component={ServiceDetail} />
  <Route path="/test-sanity" component={TestSanity} />
  {/* ... */}
  <Route component={NotFound} />   {/* catch-all 항상 마지막 */}
</Switch>
```
- Wouter는 first-match. 새 라우트는 catch-all `<Route component={NotFound} />` 위에 추가.
- 페이지 컴포넌트에서 slug는 `useParams<{ slug: string }>()`로 수신.

### 빌드/검증 명령
- `pnpm run check` — TypeScript 타입체크 (`tsc --noEmit`). 빠르고 핵심 시그널.
- `pnpm run dev` — Vite dev 서버 (host 노출).
- `pnpm run build` — `vite build && esbuild server/index.ts ... --outdir=dist`. 무거우니 자주 X.
- `pnpm run format` — Prettier.

### GitHub 연동
- 작업 완료된 기능은 반드시 commit
- commit message: `[기능명] 설명` 또는 `feat: ...` / `fix: ...` / `chore: ...` 형식
- Vercel 자동 배포

## 현재 해결 과제 (체크리스트)
- [ ] `client/src/lib/sanity.ts` 정상화 (useCdn:false, env 분리, draft 필터)
- [x] `/test-sanity` 진단 페이지
- [ ] Sanity Studio 수정이 홈페이지에 즉시 반영되는지 회귀 검증
- [ ] 5대 서비스 데이터 Sanity 시딩 + Studio에서 published 확인
- [ ] Sanity 연동 100% 검증 후 **`client/src/lib/serviceData.ts` 완전 제거** (최종 단계)
- [ ] `client/src/lib/images.ts` 정리 (Sanity asset 이관 또는 별도 결정)
- [ ] 하드코딩된 텍스트(`Home.tsx`의 `whyChooseData`, `aboutItems`, Hero 슬로건 등) 전부 Sanity로 이관
- [ ] Sanity webhook 자동 배포 설정

## serviceData.ts 제거 절차 (Sanity 100% 검증 후)
1. `client/src/pages/Home.tsx` — `serviceData`/`companyInfo` import 제거, 모든 fallback 분기 제거
2. `client/src/pages/ServiceDetail.tsx` — `serviceData`/`getService` 참조 및 fallback 분기 제거
3. `client/src/lib/serviceData.ts` 파일 삭제
4. `sanity-studio/scripts/seed-services.mjs` 파일 삭제 (1회성 부트스트랩 종료)
5. `pnpm run check && pnpm run build`로 회귀 확인 후 커밋

## 참고 자료
- `.claude/skills/sanity-debug.md` — 데이터가 안 나올 때 체크 순서
- `.claude/skills/service-page-template.md` — 새 서비스 추가 가이드
