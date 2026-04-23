/*
 * Sticky phone button - always visible on mobile
 * Desktop: bottom-right floating button
 */
import { Phone } from "lucide-react";
import { companyInfo } from "@/lib/serviceData";

export default function StickyPhone({ phone }: { phone?: string } = {}) {
  const displayPhone = phone || companyInfo.phone;
  return (
    <a
      href={`tel:${displayPhone}`}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-navy text-white px-5 py-3.5 rounded-full shadow-2xl hover:bg-navy-light transition-all hover:scale-105 group"
      aria-label="전화 상담"
    >
      <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
        <Phone className="w-5 h-5 text-navy" />
      </div>
      <div className="hidden sm:block">
        <p className="text-xs text-white/70">지금 바로 상담</p>
        <p className="font-bold text-sm tracking-wide">{displayPhone}</p>
      </div>
    </a>
  );
}
