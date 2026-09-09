/**
 * Sanity → Vercel 자동 재배포 webhook 핸들러
 *
 * 환경변수 (둘 다 필수):
 *   SANITY_WEBHOOK_SECRET   — Sanity Studio webhook 설정의 시크릿
 *   VERCEL_DEPLOY_HOOK_URL  — Vercel 프로젝트 설정 > Git > Deploy Hooks URL
 *
 * 보안:
 *   - SANITY_WEBHOOK_SECRET 미설정 시 500으로 즉시 거부 (선택 아님)
 *   - Sanity 서명 포맷 "t=<ms>,v1=<base64url sig>" — @sanity/webhook 으로 검증
 *   - HMAC: SHA-256("<ms>.<rawBody>"), base64url 인코딩
 *   - rawBody가 필요하므로 Vercel body parser 비활성
 *   - timingSafeEqual 전 버퍼 길이 동일 여부 확인
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { decodeSignatureHeader, isValidSignature } from "@sanity/webhook";

// Vercel body parser 비활성 — 서명 검증에 raw bytes 필요
export const config = { api: { bodyParser: false } };

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req as AsyncIterable<unknown>) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string));
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 시크릿 필수 — 미설정 시 즉시 거부
  const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[sanity-webhook] SANITY_WEBHOOK_SECRET 미설정");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  // raw body 읽기 (서명 검증에 필요)
  let rawBody: Buffer;
  try {
    rawBody = await readRawBody(req);
  } catch {
    return res.status(400).json({ error: "Failed to read request body" });
  }

  const signatureHeader = req.headers["sanity-webhook-signature"] as string | undefined;

  if (signatureHeader) {
    // GROQ-powered webhook: Sanity 공식 검증 (@sanity/webhook)
    //  - 헤더 형식 "t=<ms>,v1=<base64url(HMAC-SHA256(secret, `${t}.${rawBody}`))>"
    //  - 이전 구현은 타임스탬프를 초 단위로, 서명을 hex로 가정해 항상 401이 났음 (2026-09-10 수정)
    let decoded: { timestamp: number };
    try {
      decoded = decodeSignatureHeader(signatureHeader);
    } catch {
      return res.status(401).json({ error: "Malformed sanity-webhook-signature header" });
    }

    // 리플레이 공격 방지: 타임스탬프(밀리초)가 5분 이내여야 함
    if (Math.abs(Date.now() - decoded.timestamp) > 5 * 60 * 1000) {
      return res.status(401).json({ error: "Webhook timestamp out of range" });
    }

    let valid = false;
    try {
      valid = await isValidSignature(rawBody.toString("utf8"), signatureHeader, webhookSecret);
    } catch (e: unknown) {
      console.error("[sanity-webhook] 서명 검증 오류:", e instanceof Error ? e.message : String(e));
      return res.status(500).json({ error: "Signature verification failed" });
    }
    if (!valid) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }
  } else {
    // Classic webhook: URL 쿼리 토큰으로 인증 (?token=<secret>)
    const urlToken = req.query["token"] as string | undefined;
    const expectedToken = Buffer.from(webhookSecret);
    const receivedToken = Buffer.from(urlToken ?? "");

    if (
      receivedToken.length === 0 ||
      receivedToken.length !== expectedToken.length ||
      !crypto.timingSafeEqual(receivedToken, expectedToken)
    ) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }

  // Deploy Hook URL 확인
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!deployHookUrl) {
    console.error("[sanity-webhook] VERCEL_DEPLOY_HOOK_URL 미설정");
    return res.status(500).json({ error: "Deploy hook not configured" });
  }

  try {
    const response = await fetch(deployHookUrl, { method: "POST" });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("[sanity-webhook] Deploy hook 응답:", response.status, text);
      return res.status(502).json({ error: "Deploy hook request failed" });
    }

    // 서명 검증 통과 후 body 파싱 (로그용)
    let body: Record<string, unknown> = {};
    try {
      body = JSON.parse(rawBody.toString("utf-8"));
    } catch {
      // 파싱 실패해도 이미 배포 트리거됨
    }

    console.log(
      `[sanity-webhook] 재배포 트리거 완료 — ${body._type ?? "unknown"}/${body._id ?? "unknown"}`
    );

    return res.status(200).json({ success: true, message: "Vercel 재배포가 시작되었습니다." });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[sanity-webhook] fetch 오류:", msg);
    return res.status(500).json({ error: "Failed to trigger deploy" });
  }
}
