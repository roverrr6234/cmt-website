/*
 * Design: "Authoritative Counsel" — Clean form with navy/gold accents
 * Sends inquiry via mailto link (static site)
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { companyInfo, services } from "@/lib/serviceData";
import { Send, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

interface ContactFormProps {
  variant?: "full" | "compact";
  className?: string;
}

export default function ContactForm({ variant = "full", className = "" }: ContactFormProps) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("이름, 연락처, 문의 내용은 필수 입력 항목입니다.");
      return;
    }

    const subject = encodeURIComponent(
      `[홈페이지 상담문의] ${form.company || form.name} - ${form.service || "일반문의"}`
    );
    const body = encodeURIComponent(
      `■ 상담 신청 정보\n\n` +
        `이름: ${form.name}\n` +
        `회사명: ${form.company}\n` +
        `연락처: ${form.phone}\n` +
        `이메일: ${form.email}\n` +
        `관심 서비스: ${form.service}\n\n` +
        `■ 문의 내용\n${form.message}`
    );

    window.location.href = `mailto:${companyInfo.email}?subject=${subject}&body=${body}`;
    toast.success("이메일 클라이언트가 열립니다. 전송을 완료해 주세요.");
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
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            required
          />
          <input
            type="text"
            placeholder="회사명"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className={inputClass}
          />
          <input
            type="tel"
            placeholder="연락처 *"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
            required
          />
          <textarea
            placeholder="문의 내용 *"
            rows={3}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={inputClass + " resize-none"}
            required
          />
          <Button
            type="submit"
            className="w-full bg-navy hover:bg-navy-light text-white py-3 rounded-sm font-medium"
          >
            <Send className="w-4 h-4 mr-2" />
            상담 신청하기
          </Button>
        </form>
        <div className="mt-4 pt-4 border-t border-border">
          <a
            href={`tel:${companyInfo.phone}`}
            className="flex items-center gap-2 text-navy font-bold text-sm hover:text-gold transition-colors"
          >
            <Phone className="w-4 h-4 text-gold" />
            전화 상담: {companyInfo.phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              이름 <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="홍길동"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              회사명
            </label>
            <input
              type="text"
              placeholder="(주)화학기업"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              연락처 <span className="text-destructive">*</span>
            </label>
            <input
              type="tel"
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              이메일
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            관심 서비스
          </label>
          <select
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            className={inputClass}
          >
            <option value="">서비스를 선택해 주세요</option>
            {services.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="기타">기타 문의</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            문의 내용 <span className="text-destructive">*</span>
          </label>
          <textarea
            placeholder="문의하실 내용을 자세히 적어주세요. (사업장 현황, 취급 화학물질, 필요 서비스 등)"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={inputClass + " resize-none"}
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            className="flex-1 bg-navy hover:bg-navy-light text-white py-3 rounded-sm font-medium text-base"
          >
            <Send className="w-4 h-4 mr-2" />
            상담 신청하기
          </Button>
          <a
            href={`tel:${companyInfo.phone}`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-navy text-navy font-medium rounded-sm hover:bg-navy hover:text-white transition-colors text-base"
          >
            <Phone className="w-4 h-4" />
            전화 상담
          </a>
        </div>
      </form>
    </div>
  );
}
