/*
 * Design: "Authoritative Counsel" — Deep Navy footer with gold accents
 * SEO keywords: 부산, 울산, 경남 포함 전국 화학안전 컨설팅
 * Blog link → external Naver blog (target="_blank")
 */
import { Link } from "wouter";
import { Phone, Mail } from "lucide-react";
import { companyInfo, services } from "@/lib/serviceData";

const BLOG_URL = "https://blog.naver.com/ckt9054";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Main footer */}
      <div className="container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* 사업자 정보 */}
          <div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-6 font-sans">
              사업자 정보
            </h3>
            <ul className="space-y-3">
              <li className="text-white/70 text-sm">
                <span className="text-white/90 font-medium">상호명:</span> 화학물질관리기술(CMT)
              </li>
              <li className="text-white/70 text-sm">
                <span className="text-white/90 font-medium">대표자:</span> 전규탁
              </li>
              <li className="text-white/70 text-sm">
                <span className="text-white/90 font-medium">사업자등록번호:</span> 785-17-02316
              </li>
              <li className="text-white/70 text-sm">
                <span className="text-white/90 font-medium">주소:</span> 부산광역시 영도구 꿈나무길 261
              </li>
            </ul>
          </div>

          {/* 주요 업무 */}
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

          {/* 바로가기 */}
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
                <a
                  href={BLOG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 text-sm hover:text-gold transition-colors"
                >
                  블로그
                </a>
              </li>
              <li>
                <Link href="/notices" className="text-white/70 text-sm hover:text-gold transition-colors">
                  알림마당
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 text-sm hover:text-gold transition-colors">
                  상담 신청
                </Link>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-6 font-sans">
              연락처
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${companyInfo.phone}`}
                  className="flex items-start gap-3 text-white/70 hover:text-gold transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-sm">Tel: {companyInfo.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="flex items-start gap-3 text-white/70 hover:text-gold transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-sm">E-mail: {companyInfo.email}</span>
                </a>
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
