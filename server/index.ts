import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 간단한 메모리 기반 Rate Limit 저장소
const requestCounts = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1분
const MAX_REQUESTS_PER_MINUTE = 100; // 1분에 100 요청 제한

/**
 * IP 기반 Rate Limit 미들웨어
 * 악성 봇의 반복 공격 방어
 */
function rateLimitMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const timestamps = requestCounts.get(ip)!;
  // 시간 윈도우 밖의 요청 제거
  const recentRequests = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    res.status(429).json({
      error: 'Too many requests',
      message: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
    });
    return;
  }

  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  next();
}

/**
 * 보안 헤더 미들웨어
 * XSS, 클릭재킹, MIME 스니핑 방지
 */
function securityHeadersMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  // X-Content-Type-Options: MIME 스니핑 방지
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options: 클릭재킹 방지
  res.setHeader('X-Frame-Options', 'DENY');

  // X-XSS-Protection: 구형 브라우저 XSS 필터 활성화
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy: 참조 정보 유출 방지
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy: 브라우저 기능 제한
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // HSTS: HTTPS 강제 (프로덕션만)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Content-Security-Policy: XSS 및 인젝션 공격 방지
  // 프로덕션 환경에서는 더 엄격한 정책 적용
  const cspPolicy = process.env.NODE_ENV === 'production'
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://7l80ou25.api.sanity.io https://*.emailjs.com; frame-ancestors 'none';"
    : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://7l80ou25.api.sanity.io https://*.emailjs.com; frame-ancestors 'none';";

  res.setHeader('Content-Security-Policy', cspPolicy);

  next();
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // 보안 미들웨어 적용
  app.use(securityHeadersMiddleware);
  app.use(rateLimitMiddleware);

  // JSON 파싱
  app.use(express.json({ limit: '1mb' }));

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath, {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0',
    etag: false,
  }));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(console.error);
