# 서비스 페이지 무한 확장 구조

새 서비스를 코드 변경 없이 Sanity Studio에서 추가하는 방법과 그 뒤의 동작 흐름.

## 핵심 원칙

서비스 추가 = **Sanity Studio에서 `service` document 추가만으로 완결**. 별도 코드 수정 없음.

## Sanity 스키마 (이미 존재)

`sanity-studio/schemas/documents/service.ts` — 17개 필드. 직접 변경할 일은 거의 없음.

주요 필드:
- `title` — 서비스명
- `slug` — URL 슬러그 (자동생성, source: title)
- `iconName`, `cardImage`
- `description`, `law`, `lawArticle`, `overview`, `penalty`
- `tasks[]`, `targets[]`, `documents[]`, `additionalInfo[]`
- `procedure[]` (procedureStep 객체 배열)
- `sections[]` (text/alert/table/checklist/comparisonTable/procedureImage 6종 블록)
- `sortOrder` — 정렬 순서

## 동적 라우팅 (Wouter, 이미 존재)

`client/src/App.tsx`:
```tsx
<Route path="/service/:slug" component={ServiceDetail} />
```
**단수형 `/service/:slug`** (Next.js 컨벤션의 `/services/[slug]`가 아님 — Wouter + 기존 URL 호환).

`client/src/pages/ServiceDetail.tsx`:
```tsx
import { useParams } from "wouter";
import { getServiceBySlug } from "@/lib/sanity";

const { slug } = useParams<{ slug: string }>();
const data = await getServiceBySlug(slug);
```

## 데이터 페칭 (이미 존재)

`client/src/lib/sanity.ts` 안:
- `getAllServices()` — sortOrder 정렬, 모든 필드
- `getServiceBySlug(slug)` — 단건 조회
- 두 함수 모두 draft 필터 `!(_id in path("drafts.**"))` 포함

## 새 서비스 추가하는 법 (관리자 가이드)

1. https://cmt-busan.sanity.studio 접속
2. 좌측 ⭐ **주요업무** 클릭
3. 우상단 **+** (또는 "Create new") 클릭
4. 다음 입력:
   - **서비스명** (title) → 슬러그 자동 생성
   - 슬러그가 마음에 안 들면 수동 편집 (영문 + 하이픈)
   - 짧은 제목, 아이콘 이름, 카드 이미지
   - 설명, 근거 법령, 조항, 개요, 벌칙
   - 업무 내용 / 대상 / 제출 절차 / 필요 서류 / 추가 정보 (배열)
   - 정렬 순서 (sortOrder, 작을수록 위)
5. 우하단 **Publish** 클릭
6. 잠시 후 사이트에서 `https://cmtbusan.kr/service/<슬러그>` 자동 생성 확인
7. 헤더의 "주요업무" 메뉴에도 자동 노출

## 이미 시드된 5대 서비스 슬러그

`prevention-plan`, `installation-inspection`, `business-license`, `psm`, `hazard-prevention`.

이 5개는 `sanity-studio/scripts/seed-services.mjs`로 1회 부트스트랩됨.
이후 Studio에서 직접 편집/추가/삭제 가능. (시드 스크립트는 `createIfNotExists`라 재실행해도 기존 값을 덮어쓰지 않음.)

## 검증

- 추가 후 `https://cmtbusan.kr/test-sanity`의 `service` 카운트가 1 증가했는지
- 슬러그로 직접 접속 시 정상 렌더되는지
- 헤더 "주요업무" 드롭다운에 노출되는지
