/**
 * Vercel Serverless Function - Email Sending API
 * 
 * Security:
 * - API 키는 서버 환경변수에만 저장
 * - Rate Limiting: Redis 기반 (@upstash/ratelimit)
 * - 입력값 검증 및 XSS 방지
 * - CORS 제한
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 환경변수 검증
const requiredEnvVars = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM_EMAIL",
  "SMTP_RECIPIENT_EMAIL",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
  }
}

// Redis 클라이언트 초기화 (Rate Limiting용)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Rate Limit: 1분당 3회 제한 (IP 기반)
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "60 s"),
  analytics: true,
});

// Nodemailer 트랜스포터 설정
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 입력값 검증 함수
interface EmailRequest {
  name: string;
  from_company?: string;
  from_phone: string;
  from_email?: string;
  service_type?: string;
  message: string;
}

const validateInput = (data: EmailRequest): { valid: boolean; error?: string } => {
  // 필수 필드 검사
  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
    return { valid: false, error: "이름은 필수입니다." };
  }

  if (!data.from_phone || typeof data.from_phone !== "string" || data.from_phone.trim().length === 0) {
    return { valid: false, error: "연락처는 필수입니다." };
  }

  if (!data.message || typeof data.message !== "string" || data.message.trim().length === 0) {
    return { valid: false, error: "문의 내용은 필수입니다." };
  }

  // 길이 제한
  if (data.name.length > 100) {
    return { valid: false, error: "이름은 100자 이내여야 합니다." };
  }

  if (data.from_phone.length > 20) {
    return { valid: false, error: "연락처는 20자 이내여야 합니다." };
  }

  if (data.message.length > 5000) {
    return { valid: false, error: "문의 내용은 5000자 이내여야 합니다." };
  }

  if (data.from_company && data.from_company.length > 100) {
    return { valid: false, error: "회사명은 100자 이내여야 합니다." };
  }

  if (data.service_type && data.service_type.length > 50) {
    return { valid: false, error: "서비스 항목이 올바르지 않습니다." };
  }

  // 이메일 형식 검증
  if (data.from_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.from_email) || data.from_email.length > 254) {
      return { valid: false, error: "이메일 형식이 올바르지 않습니다." };
    }
  }

  // 전화번호 형식 검증 (기본적인 검사)
  const phoneRegex = /^[0-9\-\(\)\s]+$/;
  if (!phoneRegex.test(data.from_phone)) {
    return { valid: false, error: "연락처 형식이 올바르지 않습니다." };
  }

  return { valid: true };
};

// XSS 방지: HTML 특수문자 이스케이프
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

export default async (req: VercelRequest, res: VercelResponse) => {
  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "https://www.cmtbusan.kr");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  // OPTIONS 요청 처리
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // POST만 허용
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    // 수신자 환경변수 검증 — 누락 시 개인 메일로 흘러가는 것을 방지
    const recipientEmail = process.env.SMTP_RECIPIENT_EMAIL;
    if (!recipientEmail) {
      console.error("SMTP_RECIPIENT_EMAIL not configured");
      res.status(500).json({
        error: "Configuration error",
        message: "메일 서버 설정 오류입니다. 관리자에게 문의해 주세요.",
      });
      return;
    }

    // Rate Limiting 검사
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const { success, limit, reset, remaining } = await ratelimit.limit(String(ip));

    if (!success) {
      res.status(429).json({
        error: "Too many requests",
        message: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      });
      return;
    }

    // 요청 본문 파싱
    const body: EmailRequest = req.body;

    // 입력값 검증
    const validation = validateInput(body);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    // XSS 방지: 입력값 이스케이프
    const sanitized = {
      name: escapeHtml(body.name.trim()),
      from_company: body.from_company ? escapeHtml(body.from_company.trim()) : "",
      from_phone: escapeHtml(body.from_phone.trim()),
      from_email: body.from_email ? escapeHtml(body.from_email.trim()) : "",
      service_type: body.service_type ? escapeHtml(body.service_type.trim()) : "",
      message: escapeHtml(body.message.trim()),
    };

    // 이메일 템플릿 생성
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a3a52;">새로운 상담 신청</h2>
        <hr style="border: none; border-top: 2px solid #d4a574;">
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; font-weight: bold; width: 150px; background-color: #f5f5f5;">이름</td>
            <td style="padding: 10px;">${sanitized.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; background-color: #f5f5f5;">회사명</td>
            <td style="padding: 10px;">${sanitized.from_company || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; background-color: #f5f5f5;">연락처</td>
            <td style="padding: 10px;">${sanitized.from_phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; background-color: #f5f5f5;">이메일</td>
            <td style="padding: 10px;">${sanitized.from_email || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; background-color: #f5f5f5;">서비스</td>
            <td style="padding: 10px;">${sanitized.service_type || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; background-color: #f5f5f5; vertical-align: top;">문의 내용</td>
            <td style="padding: 10px; white-space: pre-wrap;">${sanitized.message}</td>
          </tr>
        </table>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          이 이메일은 자동 발송되었습니다. 회신하지 마세요.
        </p>
      </div>
    `;

    // 이메일 발송
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: recipientEmail,
      replyTo: sanitized.from_email || undefined,
      subject: `[상담 신청] ${sanitized.name} - ${sanitized.service_type || "일반"}`,
      html: emailHtml,
      text: `
이름: ${sanitized.name}
회사명: ${sanitized.from_company || "-"}
연락처: ${sanitized.from_phone}
이메일: ${sanitized.from_email || "-"}
서비스: ${sanitized.service_type || "-"}

문의 내용:
${sanitized.message}
      `,
    };

    await transporter.sendMail(mailOptions);

    // 자동 응답 이메일 (선택사항)
    if (sanitized.from_email) {
      const autoReplyHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a3a52;">상담 신청이 접수되었습니다</h2>
          <p>안녕하세요, ${sanitized.name}님!</p>
          <p>화학물질관리기술(CMT)에 상담을 신청해주셔서 감사합니다.</p>
          <p>저희 전문 컨설턴트가 빠르게 연락드리겠습니다.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            <strong>연락처:</strong> 051-412-7707<br>
            <strong>이메일:</strong> ckt9054@naver.com
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        to: sanitized.from_email,
        subject: "상담 신청이 접수되었습니다 - 화학물질관리기술(CMT)",
        html: autoReplyHtml,
        text: `
안녕하세요, ${sanitized.name}님!

화학물질관리기술(CMT)에 상담을 신청해주셔서 감사합니다.
저희 전문 컨설턴트가 빠르게 연락드리겠습니다.

연락처: 051-412-7707
이메일: ckt9054@naver.com
        `,
      });
    }

    res.status(200).json({
      success: true,
      message: "상담 신청이 완료되었습니다. 빠르게 연락드리겠습니다.",
    });
  } catch (error) {
    // 프로덕션 환경에서는 상세 에러 로깅 안 함
    if (process.env.NODE_ENV !== "production") {
      console.error("[DEV] Email sending error:", error);
    }

    res.status(500).json({
      error: "Failed to send email",
      message: "요청 처리 중 오류가 발생했습니다. 다시 시도해 주세요.",
    });
  }
};
