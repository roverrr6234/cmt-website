#!/usr/bin/env bash
# 작업 전 자동 실행되는 환경 체크 (Git Bash)
# 사용처: 사용자가 수동으로 호출하거나, settings.json의 PreToolUse 훅으로 등록 가능.

set -u

echo "=== 작업 전 환경 체크 ==="

# 프로젝트 루트로 이동 (이 스크립트는 .claude/hooks/ 안에 있음)
cd "$(dirname "$0")/../.." || exit 1

# .env 존재 확인
if [ ! -f ".env" ]; then
  echo "❌ .env 파일 없음! 다음 키들을 추가해야 합니다:"
  echo "   VITE_SANITY_PROJECT_ID=xwuem73x"
  echo "   VITE_SANITY_DATASET=production"
  echo "   SANITY_AUTH_TOKEN=..."
  exit 1
fi

# 필수 환경변수 확인 (Vite 컨벤션)
required_vars=("VITE_SANITY_PROJECT_ID" "VITE_SANITY_DATASET")
missing=0
for var in "${required_vars[@]}"; do
  if ! grep -q "^${var}=" .env; then
    echo "❌ ${var} 환경변수가 .env에 없음"
    missing=1
  fi
done

if [ $missing -ne 0 ]; then
  echo ""
  echo "→ .env에 누락된 키를 추가하세요. 자세한 내용은 CLAUDE.md 참고."
  exit 1
fi

echo "✅ 환경변수 OK (.env)"
echo "✅ 작업 시작 가능"
