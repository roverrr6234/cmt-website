#!/usr/bin/env bash
# 작업 후 자동 실행되는 타입체크 (Git Bash)
# settings.local.json의 Stop 훅에서 호출됨. 빠른 시그널이 핵심이라 build 대신 check만 돌린다.

set -u

# 프로젝트 루트로 이동 (이 스크립트는 .claude/hooks/ 안에 있음)
cd "$(dirname "$0")/../.." || exit 0

echo "=== 작업 후 타입체크 ==="

# pnpm이 가용하면 사용, 아니면 node_modules/.bin/tsc 직접 호출
if command -v pnpm >/dev/null 2>&1; then
  output=$(pnpm run check 2>&1)
  status=$?
elif [ -x "node_modules/.bin/tsc" ]; then
  output=$(node_modules/.bin/tsc --noEmit 2>&1)
  status=$?
else
  echo "⚠️  pnpm/tsc 둘 다 가용하지 않음 — 타입체크 건너뜀"
  exit 0
fi

echo "$output" | tail -30

if [ $status -eq 0 ]; then
  echo ""
  echo "✅ 타입체크 통과"
  echo "👉 다음 검증: pnpm run dev → http://localhost:3000/test-sanity"
else
  echo ""
  echo "❌ 타입체크 실패 — 위 에러 수정 필요"
fi

# Stop 훅이므로 exit code는 항상 0 (작업 흐름 차단 방지)
exit 0
