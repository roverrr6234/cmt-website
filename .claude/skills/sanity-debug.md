# Sanity 연동 디버그 가이드

데이터가 안 나오거나 Studio 변경이 반영되지 않을 때 사용하는 트러블슈팅 체크리스트.

## 0. **`/test-sanity` 라우트 먼저 확인**

`pnpm run dev` 후 `http://localhost:3000/test-sanity` 접속. 이 페이지가:
- ✅ 6개 도큐먼트 타입(`homePage`, `companyInfo`, `siteHeader`, `siteFooter`, `service`, `notice`) 카운트가 모두 ≥ 1로 보이고 raw JSON이 출력되면 → **연동 정상**. 문제는 컴포넌트 코드 쪽.
- ❌ 빈 응답/에러가 보이면 → 아래 1~4단계 순서로 진단.

## 1. 클라이언트 설정 확인

`client/src/lib/sanity.ts`:
```ts
import { createClient } from "@sanity/client";

const PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID || "xwuem73x";
const DATASET = import.meta.env.VITE_SANITY_DATASET || "production";

export const sanityClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,    // ← 반드시 false. true면 Studio 변경이 CDN에 캐싱돼 늦게 반영됨.
});
```

체크:
- `useCdn: false`인지
- `import.meta.env.VITE_SANITY_PROJECT_ID`가 빌드에 주입됐는지 (Vite는 `VITE_` 접두사만 노출)
- `.env`에 `VITE_SANITY_PROJECT_ID=xwuem73x`가 있는지

## 2. GROQ 쿼리 확인

draft 필터 필수:
```groq
*[_type == "service" && !(_id in path("drafts.**"))] | order(sortOrder asc)
```

`sanity.ts`의 모든 fetch에 위 필터가 들어가 있어야 한다. draft만 있는 도큐먼트는 빈 응답이 반환됨 → Studio에서 publish 누르면 즉시 해결.

## 3. CORS 확인

`https://www.sanity.io/manage` → 프로젝트 (xwuem73x) → API → CORS Origins:
- ✅ `http://localhost:3000` (개발)
- ✅ `https://cmtbusan.kr` (프로덕션)

CORS 에러는 브라우저 콘솔에 `Access-Control-Allow-Origin` 메시지로 명확히 뜬다.

## 4. 토큰 / 권한 확인

읽기 전용은 토큰 불필요. 단 draft 도큐먼트를 보거나 시드 스크립트를 실행할 땐 `SANITY_AUTH_TOKEN` 필요. 이 키는 `.env`(루트)와 `sanity-studio/.env`(스튜디오) 양쪽에 동일하게 있어야 하는 케이스가 있음.

## 에러별 해결책

| 증상 | 원인 | 조치 |
|---|---|---|
| 401 Unauthorized | 토큰 누락/만료 | `.env`의 `SANITY_AUTH_TOKEN` 갱신 |
| CORS Error | Origin 미등록 | sanity.io/manage에서 도메인 추가 |
| 빈 배열 `[]` | dataset 오타 또는 draft만 존재 | `.env` 확인 + Studio에서 publish |
| `undefined` | projectId 오류 | `.env`의 `VITE_SANITY_PROJECT_ID` 확인 |
| Studio 변경 반영 지연 | `useCdn:true` | `false`로 변경 후 Vite 재시작 |
| 화면이 빈 화면(white screen) | env 변수 빌드에 미주입 | Vite는 빌드 시점에 env를 인라인. `pnpm run dev` 재시작 |

## 디버그 코드 한 줄

브라우저 콘솔에서 즉시 확인:
```ts
// /test-sanity가 막혔거나 페이지 외부에서 빠르게 확인하고 싶을 때
import { sanityClient } from "@/lib/sanity";
sanityClient.fetch('*[!(_id in path("drafts.**"))][0...3]').then(console.log);
```

## 추가 컨텍스트

- 7l80ou25는 **별개 프로젝트**(ckt-notices). 이 사이트와 혼동하지 말 것.
- Studio 호스트는 https://cmt-busan.sanity.studio 다. 다른 호스트로 접속하면 다른 dataset일 수 있음.
