# cmt-sanity-studio

화학물질관리기술(CMT) Sanity Studio. **이 디렉터리는 메인 사이트(cmtbusan.kr) 빌드와 완전히 독립**되어 있다.
`tsconfig.json` 의 `include` 와 `vite.config.ts` 의 `root` 모두 이 폴더를 가리키지 않으므로,
이 안의 어떤 파일을 수정해도 라이브 사이트 화면이나 빌드는 영향받지 않는다.

## 무엇이 있나

```
sanity-studio/
├── .env                    ← 배포 토큰 (gitignored)
├── .gitignore
├── package.json
├── sanity.config.ts        ← project: xwuem73x, dataset: production
├── sanity.cli.ts
├── tsconfig.json
├── deskStructure.ts        ← 좌측 메뉴 구조
├── README.md
└── schemas/
    ├── index.ts
    ├── documents/          ← Studio 좌측 메뉴에 노출되는 6종
    │   ├── service.ts          (NEW — 5대 서비스 + 무한 확장)
    │   ├── homePage.ts         (기존 데이터 그대로 편집 가능)
    │   ├── companyInfo.ts
    │   ├── siteHeader.ts
    │   ├── siteFooter.ts
    │   └── notice.ts
    └── objects/            ← 위 도큐먼트 안에서 쓰이는 재사용 객체들
        ├── procedureStep.ts
        ├── sectionBlocks.ts    ← 6가지 섹션 블록 (텍스트/알림/표/체크리스트/비교표/절차이미지)
        ├── statItem.ts
        ├── whyItem.ts
        ├── quickLink.ts
        └── noticeAttachment.ts
```

## 로컬 개발 (브라우저에서 미리보기)

```bash
cd sanity-studio
npm install
npm run dev
```

기본 포트 `http://localhost:3333` 으로 Studio 가 뜬다.
이 단계에서 production 데이터셋과 직접 연결되므로, 입력/수정한 내용은 **곧바로 production 에 반영**된다는 점에 유의.

## 배포 (`*.sanity.studio` 호스트에 올리기)

> ⚠️ 주의 — 기존 호스트에 덮어쓰기 됨.
> 처음 `sanity deploy` 를 실행하면 호스트 이름을 묻는 프롬프트가 뜬다.
> **기존 *.sanity.studio 의 서브도메인을 그대로 입력**하면 그 사이트가 새 Studio 로 교체된다.

### 1. 토큰 확인

`sanity-studio/.env` 에 `SANITY_AUTH_TOKEN=...` 이 있어야 한다 (이미 들어있음).
이 토큰은 Sanity 관리 페이지에서 발급받은 deploy 권한 토큰이다 — `.gitignore` 로 git 에 커밋되지 않는다.

### 2. 의존성 설치

```bash
cd sanity-studio
npm install
```

### 3. 배포

```bash
npm run deploy
```

또는 호스트 이름을 미리 알고 있다면 인자로 전달:

```bash
npx sanity deploy <hostname>
```

(`<hostname>` 은 기존 `*.sanity.studio` 의 서브도메인.)

### 4. 결과 확인

배포가 끝나면 `https://<hostname>.sanity.studio` 로 접속 가능. 좌측 메뉴 최상단에 **⭐ 서비스 관리(5대 서비스)** 가 보인다.

## Studio 메뉴 구조

```
콘텐츠 관리
├── ⭐ 서비스 관리 (5대 서비스)        ← 새 서비스 추가/수정
├── ─── (구분선)
├── 🏠 홈페이지                        ← 기존 homePage 데이터 편집
├── 🏢 회사 정보
├── 🔝 헤더
├── 🔻 푸터
├── ─── (구분선)
└── 📢 알림마당                        ← 공지사항 추가/수정
```

## 데이터 호환성

기존 `production` 데이터셋에 이미 들어있는 데이터(homePage / companyInfo / siteHeader / siteFooter / notice 다수)는
**모두 그대로 보존되며 새 Studio 에서 바로 편집 가능**하도록 필드 이름을 그대로 매칭해뒀다.

(`statItem`, `whyItem` 등 객체 타입 이름까지 기존 데이터의 `_type` 값과 정확히 일치시킴.)

## 다음 단계 (이 README 와 별개)

이 Studio 가 배포되어도 라이브 사이트(`cmtbusan.kr`)는 여전히 `client/src/lib/serviceData.ts` 의
하드코딩된 5대 서비스를 보여준다 — 즉 Studio 에서 새 서비스를 추가해도 화면에 바로 안 나타남.
이는 의도된 안전 장치다 (디자인 픽셀이 망가질 위험 0).

다음 단계(Phase B)에서 `client/src/pages/ServiceDetail.tsx` 가 다음 순서로 데이터를 찾도록 와이어링한다:

1. Sanity 에서 `slug` 로 조회
2. 없으면 `serviceData.ts` 의 5대 서비스 fallback 사용
3. 둘 다 없으면 404

이렇게 하면 5대 서비스는 그대로 보이고, 새로 추가한 서비스만 즉시 동일 디자인으로 나타난다.
Phase B 는 이 Studio 배포 + Studio 에서 신규 서비스 1개 입력 검증 후 별도 합의로 진행한다.
