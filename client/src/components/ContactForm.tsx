/*
 * Design: "Authoritative Counsel" — Clean form with navy/gold accents
 * Sends inquiry via EmailJS (automatic email sending)
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { companyInfo, services } from "@/lib/serviceData";
import { Send, Phone, Mail, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { sendContactEmail, type SendResult } from "@/lib/emailjs";

interface ContactFormProps {
  variant?: "full" | "compact";
  className?: string;
  preselectedService?: string;
}

export default function ContactForm({ variant = "full", className = "", preselectedService = "" }: ContactFormProps) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    service: preselectedService,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("이름, 연락처, 문의 내용은 필수 입력 항목입니다.");
      return;
    }

    setIsLoading(true);
    try {
      const result: SendResult = await sendContactEmail({
        name: form.name,
        from_company: form.company,
        from_phone: form.phone,
        from_email: form.email,
        service_type: form.service,
        message: form.message,
      });

      if (result.success) {
        toast.success(result.message);
        setForm({
          name: "",
          company: "",
          phone: "",
          email: "",
          service: preselectedService,
          message: "",
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("요청 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(companyInfo.phone);
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
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            required
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="회사명"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className={inputClass}
            disabled={isLoading}
          />
          <input
            type="tel"
            placeholder="연락처 *"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
            required
            disabled={isLoading}
          />
          <textarea
            placeholder="문의 내용 *"
            rows={3}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={inputClass + " resize-none"}
            required
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-navy hover:bg-navy-light text-white py-3 rounded-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                전송 중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                상담 신청하기
              </>
            )}
          </Button>
        </form>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 justify-between">
            <span className="text-navy font-bold text-sm">전화 상담</span>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${companyInfo.phone}`}
                className="flex items-center gap-1 text-navy font-bold text-sm hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4 text-gold" />
                {companyInfo.phone}
              </a>
              <button
                type="button"
                onClick={handleCopyPhone}
                className="p-1 hover:bg-gold/10 rounded transition-colors"
                title="전화번호 복사"
              >
                <Copy className="w-4 h-4 text-gold" />
              </button>
            </div>
          </div>
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-navy hover:bg-navy-light text-white py-3 rounded-sm font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed h-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                전송 중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                상담 신청하기
              </>
            )}
          </Button>
          <div className="flex gap-2 h-full">
            <a
              href={`tel:${companyInfo.phone}`}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-navy text-navy font-medium rounded-sm hover:bg-navy hover:text-white transition-colors text-base"
            >
              <Phone className="w-4 h-4" />
              전화 상담
            </a>
            <button
              type="button"
              onClick={handleCopyPhone}
              className="px-4 py-3 border-2 border-navy text-navy font-medium rounded-sm hover:bg-navy hover:text-white transition-colors flex items-center justify-center gap-2"
              title="전화번호 복사"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
