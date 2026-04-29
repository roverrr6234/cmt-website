/*
 * Sticky phone button - always visible on mobile
 * Desktop: bottom-right floating button
 *
 * Sanity-with-fallback: companyInfo 도큐먼트의 phone 을 우선 사용, 비어있으면 serviceData fallback.
 */
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { companyInfo as fallbackCompanyInfo } from "@/lib/serviceData";
import { getCompanyInfo } from "@/lib/sanity";

export default function StickyPhone() {
  const [phone, setPhone] = useState<string>(fallbackCompanyInfo.phone);

  useEffect(() => {
    getCompanyInfo()
      .then((info) => {
        if (info?.phone) setPhone(info.phone);
      })
      .catch(() => {
        // 실패해도 fallback 그대로
      });
  }, []);

  return (
    <a
      href={`tel:${phone}`}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-navy text-white px-5 py-3.5 rounded-full shadow-2xl hover:bg-navy-light transition-all hover:scale-105 group"
      aria-label="전화 상담"
    >
      <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
        <Phone className="w-5 h-5 text-navy" />
      </div>
      <div className="hidden sm:block">
        <p className="text-xs text-white/70">지금 바로 상담</p>
        <p className="font-bold text-sm tracking-wide">{phone}</p>
      </div>
    </a>
  );
}
