/**
 * Sanity → Vercel 자동 재배포 webhook 핸들러
 *
 * 환경변수 (둘 다 필수):
 *   SANITY_WEBHOOK_SECRET   — Sanity Studio webhook 설정의 시크릿
 *   VERCEL_DEPLOY_HOOK_URL  — Vercel 프로젝트 설정 > Git > Deploy Hooks URL
 *
 * 보안:
 *   - SANITY_WEBHOOK_SECRET 미설정 시 500으로 즉시 거부 (선택 아님)
 *   - Sanity 실제 서명 포맷 "t=<ts>,v1=<sig>" 파싱
 *   - HMAC: SHA-256("<ts>.<rawBody>")
 *   - rawBody가 필요하므로 Vercel body parser 비활성
 *   - timingSafeEqual 전 버퍼 길이 동일 여부 확인
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

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

  // raw body 읽기 (서명 검증에 필요)
  let rawBody: Buffer;
  try {
    rawBody = await readRawBody(req);
  } catch {
    return res.status(400).json({ error: "Failed to read request body" });
  }

  // 서명 헤더가 있을 때만 HMAC 검증 (없으면 classic webhook으로 간주 — 허용)
  const signatureHeader = req.headers["sanity-webhook-signature"] as string | undefined;
  const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;

  if (signatureHeader && webhookSecret) {
    // Sanity 서명 포맷 파싱: "t=<timestamp>,v1=<hmac-hex>"
    const parts: Record<string, string> = {};
    for (const segment of signatureHeader.split(",")) {
      const eq = segment.indexOf("=");
      if (eq !== -1) parts[segment.slice(0, eq)] = segment.slice(eq + 1);
    }

    const timestamp = parts["t"];
    const receivedSig = parts["v1"];

    if (!timestamp || !receivedSig) {
      return res.status(401).json({ error: "Malformed sanity-webhook-signature header" });
    }

    // HMAC-SHA256("<timestamp>.<rawBody>")
    const hmac = crypto.createHmac("sha256", webhookSecret);
    hmac.update(`${timestamp}.`);
    hmac.update(rawBody);
    const expectedSig = hmac.digest("hex");

    const receivedBuf = Buffer.from(receivedSig, "hex");
    const expectedBuf = Buffer.from(expectedSig, "hex");

    if (
      receivedBuf.length === 0 ||
      receivedBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(receivedBuf, expectedBuf)
    ) {
      return res.status(401).json({ error: "Invalid webhook signature" });
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
