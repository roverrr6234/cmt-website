/**
 * Sanity → Vercel 자동 재배포 webhook 핸들러
 *
 * Sanity Studio에서 문서가 publish/unpublish/delete 될 때
 * 이 엔드포인트가 호출되어 Vercel 재배포를 트리거합니다.
 * 재배포 시 prerender 스크립트가 다시 실행되므로
 * 프리렌더 HTML이 항상 최신 Sanity 콘텐츠를 반영합니다.
 *
 * 환경변수:
 *   SANITY_WEBHOOK_SECRET   — Sanity Studio webhook 설정의 시크릿 (선택)
 *   VERCEL_DEPLOY_HOOK_URL  — Vercel 프로젝트 설정 > Git > Deploy Hooks URL
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Sanity webhook 서명 검증 (시크릿이 설정된 경우)
  const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = req.headers["sanity-webhook-signature"] as string | undefined;
    if (!signature) {
      return res.status(401).json({ error: "Missing sanity-webhook-signature header" });
    }

    try {
      const body = JSON.stringify(req.body);
      const hmac = crypto.createHmac("sha256", webhookSecret);
      hmac.update(body);
      const expected = `v1=${hmac.digest("hex")}`;
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        return res.status(401).json({ error: "Invalid webhook signature" });
      }
    } catch {
      return res.status(401).json({ error: "Signature verification failed" });
    }
  }

  // Vercel Deploy Hook URL 확인
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!deployHookUrl) {
    console.error("[sanity-webhook] VERCEL_DEPLOY_HOOK_URL not configured");
    return res.status(500).json({ error: "Deploy hook not configured" });
  }

  try {
    const response = await fetch(deployHookUrl, { method: "POST" });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("[sanity-webhook] Deploy hook returned:", response.status, text);
      return res.status(502).json({ error: "Deploy hook request failed" });
    }

    const docType = req.body?._type ?? "unknown";
    const docId = req.body?._id ?? "unknown";
    console.log(`[sanity-webhook] 재배포 트리거 완료 — 문서: ${docType}/${docId}`);

    return res.status(200).json({
      success: true,
      message: "Vercel 재배포가 시작되었습니다.",
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[sanity-webhook] fetch 오류:", msg);
    return res.status(500).json({ error: "Failed to trigger deploy", detail: msg });
  }
}
