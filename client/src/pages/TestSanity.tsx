import { useEffect, useState } from "react";
import { sanityClient, sanityConfig } from "@/lib/sanity";

/**
 * Sanity 연동 진단 페이지. 의도적으로 단순하게 유지한다.
 * 다른 어떤 모듈(serviceData.ts, images.ts 등)도 참조하지 않는다 — 진단의 독립성 보장.
 */

const DOC_TYPES = [
  "homePage",
  "companyInfo",
  "siteHeader",
  "siteFooter",
  "service",
  "notice",
] as const;

type TypeReport = {
  type: string;
  count: number | null;
  sample: unknown;
  error: string | null;
};

type SmokeResult =
  | { ok: true; sample: unknown }
  | { ok: false; error: string; hint?: string };

function inferHint(error: unknown): string | undefined {
  const msg = error instanceof Error ? error.message : String(error);
  if (/401|Unauthorized/i.test(msg))
    return "토큰 누락/만료. .env의 SANITY_AUTH_TOKEN을 확인하세요.";
  if (/CORS|cross-origin/i.test(msg))
    return "CORS 미설정. sanity.io/manage → API → CORS Origins에 도메인 추가.";
  if (/network|fetch/i.test(msg))
    return "네트워크 오류. 인터넷 연결 또는 projectId/dataset 오타 확인.";
  return undefined;
}

export default function TestSanity() {
  const [smoke, setSmoke] = useState<SmokeResult | null>(null);
  const [reports, setReports] = useState<TypeReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 1. 스모크 테스트
      try {
        const sample = await sanityClient.fetch<unknown>(
          `*[!(_id in path("drafts.**"))][0...1]`,
        );
        if (!cancelled) setSmoke({ ok: true, sample });
      } catch (error) {
        if (!cancelled) {
          const msg = error instanceof Error ? error.message : String(error);
          setSmoke({ ok: false, error: msg, hint: inferHint(error) });
        }
      }

      // 2. 타입별 카운트 + 샘플
      const next: TypeReport[] = [];
      for (const type of DOC_TYPES) {
        try {
          const [count, sample] = await Promise.all([
            sanityClient.fetch<number>(
              `count(*[_type == $type && !(_id in path("drafts.**"))])`,
              { type },
            ),
            sanityClient.fetch<unknown>(
              `*[_type == $type && !(_id in path("drafts.**"))][0]`,
              { type },
            ),
          ]);
          next.push({ type, count, sample, error: null });
        } catch (error) {
          next.push({
            type,
            count: null,
            sample: null,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      if (!cancelled) {
        setReports(next);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 text-sm leading-6">
      <h1 className="text-2xl font-bold mb-2">Sanity 연동 진단</h1>
      <p className="text-gray-600 mb-6">
        이 페이지는 <code>client/src/lib/sanity.ts</code>의 클라이언트 설정과 6개
        도큐먼트 타입 응답을 검증합니다.
      </p>

      <section className="mb-8 rounded border border-gray-200 p-4 bg-gray-50">
        <h2 className="font-semibold mb-2">1. 클라이언트 설정</h2>
        <table className="text-xs">
          <tbody>
            <tr>
              <td className="pr-4 font-mono text-gray-500">projectId</td>
              <td className="font-mono">{sanityConfig.projectId}</td>
            </tr>
            <tr>
              <td className="pr-4 font-mono text-gray-500">dataset</td>
              <td className="font-mono">{sanityConfig.dataset}</td>
            </tr>
            <tr>
              <td className="pr-4 font-mono text-gray-500">apiVersion</td>
              <td className="font-mono">{sanityConfig.apiVersion}</td>
            </tr>
            <tr>
              <td className="pr-4 font-mono text-gray-500">useCdn</td>
              <td className="font-mono">
                {String(sanityConfig.useCdn)}
                {sanityConfig.useCdn ? (
                  <span className="ml-2 text-red-600">
                    ⚠️ true이면 Studio 변경 반영 지연
                  </span>
                ) : (
                  <span className="ml-2 text-green-600">✓</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="pr-4 font-mono text-gray-500">VITE env 주입</td>
              <td className="font-mono">
                {import.meta.env.VITE_SANITY_PROJECT_ID
                  ? "✓ 주입됨"
                  : "⚠ env 누락 (fallback 사용중)"}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8 rounded border border-gray-200 p-4">
        <h2 className="font-semibold mb-2">2. 스모크 테스트</h2>
        {smoke === null ? (
          <p className="text-gray-500">측정 중…</p>
        ) : smoke.ok ? (
          <div>
            <p className="text-green-700 mb-2">✓ 응답 도착</p>
            <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-auto max-h-48">
              {JSON.stringify(smoke.sample, null, 2)}
            </pre>
          </div>
        ) : (
          <div>
            <p className="text-red-700 mb-2">✗ 실패: {smoke.error}</p>
            {smoke.hint && (
              <p className="text-amber-700 text-xs">→ {smoke.hint}</p>
            )}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="font-semibold mb-2">3. 도큐먼트 타입별 응답</h2>
        {loading && <p className="text-gray-500">측정 중…</p>}
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r.type}
              className="rounded border border-gray-200 p-4"
            >
              <div className="flex items-baseline justify-between mb-2">
                <code className="font-mono font-semibold">{r.type}</code>
                <span
                  className={
                    r.count === null
                      ? "text-red-600 text-xs"
                      : r.count === 0
                        ? "text-amber-600 text-xs"
                        : "text-green-700 text-xs"
                  }
                >
                  {r.count === null ? "ERROR" : `count: ${r.count}`}
                </span>
              </div>
              {r.error ? (
                <div>
                  <p className="text-red-700 text-xs mb-1">{r.error}</p>
                  {inferHint(new Error(r.error)) && (
                    <p className="text-amber-700 text-xs">
                      → {inferHint(new Error(r.error))}
                    </p>
                  )}
                </div>
              ) : r.sample ? (
                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-auto max-h-64">
                  {JSON.stringify(r.sample, null, 2)}
                </pre>
              ) : (
                <p className="text-amber-700 text-xs">
                  published 도큐먼트 없음. Studio에서 publish 누르면 즉시
                  해결됩니다.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded border border-blue-200 bg-blue-50 p-4 text-xs leading-6">
        <p className="font-semibold mb-1">검증 가이드</p>
        <ol className="list-decimal pl-4 space-y-1">
          <li>
            6개 타입 모두 <code>count ≥ 1</code>이고 JSON 출력이 보이면 연동
            완료.
          </li>
          <li>
            Studio (https://cmt-busan.sanity.studio)에서 한 필드를 수정하고
            Publish → 이 페이지 새로고침 → 즉시 반영되는지 확인.
          </li>
          <li>
            반영이 늦으면 <code>useCdn</code>이 <code>false</code>인지 다시
            확인하고 dev 서버 재시작.
          </li>
          <li>
            CORS / 401 등 에러는 <code>.claude/skills/sanity-debug.md</code>
            참조.
          </li>
        </ol>
      </section>
    </main>
  );
}
