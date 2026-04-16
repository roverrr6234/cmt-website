/*
 * Design: "Authoritative Counsel" — Deep Navy footer with gold accents
 * SEO keywords: 부산, 울산, 경남 포함 전국 화학안전 컨설팅
 */
import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import { companyInfo, services } from "@/lib/serviceData";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Main footer */}
      <div className="container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Company info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gold rounded-sm flex items-center justify-center">
                <span className="text-navy font-bold text-lg font-serif">CKT</span>
              </div>
              <div>
                <p className="font-bold text-lg font-serif">화학물질관리기술</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              20년 이상의 EHS 전문 경력을 바탕으로 화학사고 예방부터 인허가 취득까지,
              귀사의 화학안전 파트너로서 함께합니다.
            </p>
            <div className="gold-line mb-4" />
            <p className="text-gold text-sm font-medium">
              "{companyInfo.slogan}"
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-6 font-sans">
              주요 업무
            </h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/service/${s.slug}`}
                    className="text-white/70 text-sm hover:text-gold transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-6 font-sans">
              바로가기
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/70 text-sm hover:text-gold transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/70 text-sm hover:text-gold transition-colors">
                  블로그
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 text-sm hover:text-gold transition-colors">
                  상담 신청
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-6 font-sans">
              연락처
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${companyInfo.phone}`}
                  className="flex items-start gap-3 text-white/70 hover:text-gold transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-sm">{companyInfo.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="flex items-start gap-3 text-white/70 hover:text-gold transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-sm">{companyInfo.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                <span className="text-sm">{companyInfo.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} 화학물질관리기술. All rights reserved.
          </p>
          <p className="text-white/40 text-xs text-center">
            부산, 울산, 경남 포함 전국 화학안전 컨설팅 | 화학사고예방관리계획서 | 설치검사 | 영업허가 | PSM | 유해위험방지계획서
          </p>
        </div>
      </div>
    </footer>
  );
}
