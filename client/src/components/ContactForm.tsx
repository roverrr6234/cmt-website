/**
 * Design: "Authoritative Counsel" — Clean form with navy/gold accents
 * Sends inquiry via Vercel API Route (backend email sending)
 * Security: Input validation, Rate limiting, server-side XSS prevention
 */
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { ServiceData } from "@/lib/types";
import { Send, Phone, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getCompanyInfo, getAllServices } from "@/lib/sanity";
import { convertSanityServiceList } from "@/lib/sanityToService";

interface ContactFormProps {
  variant?: "full" | "compact";
  className?: string;
  preselectedService?: string;
}

// 입력값 검증 함수
const validateInput = (value: string, maxLength: number = 1000): boolean => {
  if (!value || value.trim().length === 0) return false;
  if (value.length > maxLength) return false;
  return true;
};

// 이메일 형식 검증
const validateEmail = (email: string): boolean => {
  if (!email) return true; // 선택 항목
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email) && email.length <= 254;
};

// 전화번호 형식 검증
const validatePhone = (phone: string): boolean => {
  const phonePattern = /^[0-9\-\(\)\s]+$/;
  return phonePattern.test(phone) && phone.length >= 10 && phone.length <= 20;
};

// Rate Limit 저장소 (클라이언트 사이드, 보조 역할)
const submitAttempts = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1분
const MAX_ATTEMPTS = 3; // 1분에 3회 제한

const checkRateLimit = (): boolean => {
  const now = Date.now();
  const key = "contact-form";

  if (!submitAttempts.has(key)) {
    submitAttempts.set(key, []);
  }

  const attempts = submitAttempts.get(key)!;
  const recentAttempts = attempts.filter((t) => now - t < RATE_LIMIT_WINDOW);

  if (recentAttempts.length >= MAX_ATTEMPTS) {
    return false;
  }

  recentAttempts.push(now);
  submitAttempts.set(key, recentAttempts);
  return true;
};

export default function ContactForm({
  variant = "full",
  className = "",
  preselectedService = "",
}: ContactFormProps) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    service: preselectedService,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const rateLimitTimerRef = useRef<NodeJS.Timeout | null>(null);

  /* Sanity-with-fallback */
  const [companyPhone, setCompanyPhone] = useState<string>("");
  const [services, setServices] = useState<ServiceData[]>([]);

  useEffect(() => {
    Promise.all([getCompanyInfo(), getAllServices()])
      .then(([info, srv]) => {
        if (info?.phone) setCompanyPhone(info.phone);
        const converted = convertSanityServiceList(srv);
        if (converted.length > 0) setServices(converted);
      })
      .catch(() => {
        // fallback 유지
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate Limit 검사 (클라이언트 사이드, 보조)
    if (!checkRateLimit()) {
      setRateLimitError(true);
      toast.error("요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.");

      if (rateLimitTimerRef.current) clearTimeout(rateLimitTimerRef.current);
      rateLimitTimerRef.current = setTimeout(() => {
        setRateLimitError(false);
      }, RATE_LIMIT_WINDOW);
      return;
    }

    // 입력값 검증
    if (!validateInput(form.name, 100)) {
      toast.error("이름을 올바르게 입력해 주세요. (1-100자)");
      return;
    }

    if (!validatePhone(form.phone)) {
      toast.error("연락처를 올바르게 입력해 주세요.");
      return;
    }

    if (form.email && !validateEmail(form.email)) {
      toast.error("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (!validateInput(form.message, 5000)) {
      toast.error("문의 내용을 올바르게 입력해 주세요. (1-5000자)");
      return;
    }

    if (form.company && !validateInput(form.company, 100)) {
      toast.error("회사명을 올바르게 입력해 주세요. (1-100자)");
      return;
    }

    setIsLoading(true);
    try {
      // Vercel API Route로 요청 전송
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          from_company: form.company.trim(),
          from_phone: form.phone.trim(),
          from_email: form.email.trim(),
          service_type: form.service,
          message: form.message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "상담 신청이 완료되었습니다.");
        setForm({
          name: "",
          company: "",
          phone: "",
          email: "",
          service: preselectedService,
          message: "",
        });
      } else if (response.status === 429) {
        // 서버 사이드 Rate Limit
        setRateLimitError(true);
        toast.error(data.message || "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.");

        if (rateLimitTimerRef.current) clearTimeout(rateLimitTimerRef.current);
        rateLimitTimerRef.current = setTimeout(() => {
          setRateLimitError(false);
        }, (data.retryAfter || 60) * 1000);
      } else {
        toast.error(data.message || "요청 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      // 프로덕션 환경에서는 에러 로깅 미수행
      if (process.env.NODE_ENV !== "production") {
        console.error("[DEV] Form submission error:", error);
      }
      toast.error("요청 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(companyPhone);
    toast.success("전화번호가 복사되었습니다.");
  };

  const inputClass =
    "w-full px-4 py-3 bg-white border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors";

  if (variant === "compact") {
    return (
      <div className={`bg-warm-gray p-6 lg:p-8 rounded-sm ${className}`}>
        <h3 className="text-navy font-bold text-lg font-serif mb-2">
          무료 상담 신청
        </h3>
        <div className="gold-line mb-4" />
        <p className="text-muted-foreground text-sm mb-6">
          전문 컨설턴트가 빠르게 연락드리겠습니다.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="이름 *"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value.slice(0, 100) })
            }
            className={inputClass}
            required
            disabled={isLoading || rateLimitError}
            maxLength={100}
          />
          <input
            type="text"
            placeholder="회사명"
            value={form.company}
            onChange={(e) =>
              setForm({ ...form, company: e.target.value.slice(0, 100) })
            }
            className={inputClass}
            disabled={isLoading || rateLimitError}
            maxLength={100}
          />
          <input
            type="tel"
            placeholder="연락처 *"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value.slice(0, 20) })
            }
            className={inputClass}
            required
            disabled={isLoading || rateLimitError}
            maxLength={20}
          />
          <input
            type="email"
            placeholder="이메일"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value.slice(0, 254) })
            }
            className={inputClass}
            disabled={isLoading || rateLimitError}
            maxLength={254}
          />
          <select
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            className={inputClass}
            disabled={isLoading || rateLimitError}
          >
            <option value="">서비스 선택</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
          <textarea
            placeholder="문의 내용 *"
            rows={3}
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value.slice(0, 5000) })
            }
            className={inputClass + " resize-none"}
            required
            disabled={isLoading || rateLimitError}
            maxLength={5000}
          />
          <Button
            type="submit"
            disabled={isLoading || rateLimitError}
            className="w-full bg-navy hover:bg-navy/90 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                전송 중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                상담 신청
              </>
            )}
          </Button>
          {rateLimitError && (
            <p className="text-xs text-red-600 text-center">
              요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.
            </p>
          )}
        </form>
      </div>
    );
  }

  // Full variant
  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            이름 *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value.slice(0, 100) })
            }
            className={inputClass}
            required
            disabled={isLoading || rateLimitError}
            maxLength={100}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            회사명
          </label>
          <input
            type="text"
            value={form.company}
            onChange={(e) =>
              setForm({ ...form, company: e.target.value.slice(0, 100) })
            }
            className={inputClass}
            disabled={isLoading || rateLimitError}
            maxLength={100}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            연락처 *
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value.slice(0, 20) })
            }
            className={inputClass}
            required
            disabled={isLoading || rateLimitError}
            maxLength={20}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            이메일
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value.slice(0, 254) })
            }
            className={inputClass}
            disabled={isLoading || rateLimitError}
            maxLength={254}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          서비스 선택
        </label>
        <select
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          className={inputClass}
          disabled={isLoading || rateLimitError}
        >
          <option value="">서비스를 선택해 주세요</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          문의 내용 *
        </label>
        <textarea
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value.slice(0, 5000) })
          }
          className={inputClass + " resize-none"}
          rows={6}
          required
          disabled={isLoading || rateLimitError}
          maxLength={5000}
        />
      </div>

      {rateLimitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          요청이 너무 많습니다. 1분 후 다시 시도해 주세요.
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || rateLimitError}
        className="w-full bg-navy hover:bg-navy/90 text-white text-base py-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            전송 중...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            상담 신청
          </>
        )}
      </Button>
    </form>
  );
}
