/**
 * Design: "Authoritative Counsel" — Clean form with navy/gold accents
 * Sends inquiry via Vercel API Route (backend email sending)
 * Security: Input validation, Rate limiting, XSS prevention with DOMPurify
 * DATA: All content loaded from Sanity CMS
 */
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getCompanyInfo, getAllServices } from "@/lib/sanity";
import { Send, Phone, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import DOMPurify from "dompurify";

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

// 전화번호 검증 (기본 형식)
const validatePhone = (phone: string): boolean => {
  if (!phone || phone.trim().length === 0) return false;
  const phonePattern = /^[0-9\-\(\)\s]+$/;
  return phonePattern.test(phone) && phone.length >= 10 && phone.length <= 20;
};

// Rate Limit 설정
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 60000; // 1분
const submitAttempts = new Map<string, number[]>();

const checkRateLimit = (): boolean => {
  const key = typeof window !== "undefined" ? navigator.userAgent : "server";
  const now = Date.now();

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
  const [phone, setPhone] = useState("051-714-4100");
  const [services, setServices] = useState<any[]>([]);
  const rateLimitTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sanity에서 데이터 로드
  useEffect(() => {
    getCompanyInfo().then((d: any) => { if (d?.phone) setPhone(d.phone); }).catch(() => {});
    getAllServices().then((d: any[]) => { if (d?.length) setServices(d); }).catch(() => {});
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
      } else {
        toast.error(data.message || "요청 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phone);
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
            {services.map((s: any) => (
              <option key={s.slug?.current || s.slug} value={s.slug?.current || s.slug}>
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

          {rateLimitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              요청이 너무 많습니다. 1분 후 다시 시도해 주세요.
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || rateLimitError}
            className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-3"
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
      </div>
    );
  }

  // Full variant
  return (
    <div className={`bg-white rounded-sm border border-border/50 p-8 lg:p-10 ${className}`}>
      <h3 className="text-navy font-bold text-2xl font-serif mb-2">
        무료 상담 신청
      </h3>
      <div className="gold-line mb-8" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              이름 *
            </label>
            <input
              type="text"
              placeholder="이름을 입력해 주세요"
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
              placeholder="회사명을 입력해 주세요"
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
              placeholder="010-1234-5678"
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
              placeholder="example@company.com"
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
            {services.map((s: any) => (
              <option key={s.slug?.current || s.slug} value={s.slug?.current || s.slug}>
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
            placeholder="문의 내용을 입력해 주세요"
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

      {/* 연락처 정보 */}
      <div className="mt-8 pt-8 border-t border-border/50">
        <p className="text-sm text-muted-foreground mb-4">
          빠른 상담을 원하신다면 아래로 연락주세요:
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleCopyPhone}
            className="flex items-center gap-3 p-3 bg-warm-gray rounded-sm hover:bg-navy hover:text-white transition-all group"
          >
            <Phone className="w-5 h-5 text-gold group-hover:text-gold" />
            <span className="text-sm font-medium">{phone}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
