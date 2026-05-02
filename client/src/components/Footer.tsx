/*
 * Design: "Authoritative Counsel" — Deep Navy footer with gold accents
 * SEO keywords: 부산, 울산, 경남 포함 전국 화학안전 컨설팅
 * Blog link → external Naver blog (target="_blank")
 *
 * Sanity-with-fallback: siteFooter + companyInfo + services 도큐먼트 사용.
 * 비어있는 필드는 현재 라이브 텍스트(하드코딩 fallback)로 노출.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Phone, Mail } from "lucide-react";
import type { ServiceData } from "@/lib/types";
import { getSiteFooter, getCompanyInfo, getAllServices } from "@/lib/sanity";
import { convertSanityServiceList } from "@/lib/sanityToService";

const BLOG_URL = "https://blog.naver.com/ckt9054";

function pick<T>(v: T | null | undefined | "", fallback: T): T {
  return v !== null && v !== undefined && v !== "" ? v : fallback;
}

export default function Footer() {
  const [footer, setFooter] = useState<any | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [services, setServices] = useState<ServiceData[]>([]);

  useEffect(() => {
    Promise.all([getSiteFooter(), getCompanyInfo(), getAllServices()])
      .then(([f, info, srv]) => {
        setFooter(f);
        if (info?.phone) setPhone(info.phone);
        if (info?.email) setEmail(info.email);
        setServices(convertSanityServiceList(srv));
      })
      .catch(() => {
        /* 빈 상태 유지 */
      });
  }, []);

  /* siteFooter 우선, 없으면 companyInfo, 없으면 하드코딩 */
  const phoneFinal = pick(footer?.phoneFooter, phone);
  const emailFinal = pick(footer?.emailFooter, email);
  const businessInfoTitle = pick(footer?.businessInfoTitle, "사업자 정보");
  const servicesTitle = pick(footer?.servicesTitle, "주요 업무");
  const quickLinksTitle = pick(footer?.quickLinksTitle, "바로가기");
  const contactTitle = pick(footer?.contactTitle, "연락처");
  const companyNameFooter = pick(footer?.companyNameFooter, "화학물질관리기술(CMT)");
  const ceoNameFooter = pick(footer?.ceoNameFooter, "전규탁");
  const businessNumberFooter = pick(footer?.businessNumberFooter, "785-17-02316");
  const addressFooter = pick(
    footer?.addressFooter,
    "부산광역시 영도구 꿈나무길 261 (2층)",
  );
  const copyrightText = pick(
    footer?.copyrightText,
    `© ${new Date().getFullYear()} 화학물질관리기술. All rights reserved.`,
  );

  /* 바로가기 — Sanity quickLinks 가 있으면 사용, 없으면 기본 4개 */
  const quickLinks: Array<{ label: string; link: string; isExternal?: boolean }> =
    Array.isArray(footer?.quickLinks) && footer.quickLinks.length > 0
      ? footer.quickLinks
      : [
          { label: "홈", link: "/", isExternal: false },
          { label: "블로그", link: BLOG_URL, isExternal: true },
          { label: "알림마당", link: "/notices", isExternal: false },
          { label: "상담 신청", link: "/contact", isExternal: false },
        ];

  return (
    <footer className="bg-navy text-white">
      {/* Main footer */}
      <div className="container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* 사업자 정보 */}
          <div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-6 font-sans">
              {businessInfoTitle}
            </h3>
            <ul className="space-y-3">
              <li className="text-white/70 text-sm">
                <span className="text-white/90 font-medium">상호명:</span>{" "}
                {companyNameFooter}
              </li>
              <li className="text-white/70 text-sm">
                <span className="text-white/90 font-medium">대표자:</span>{" "}
                {ceoNameFooter}
              </li>
              <li className="text-white/70 text-sm">
                <span className="text-white/90 font-medium">사업자등록번호:</span>{" "}
                {businessNumberFooter}
              </li>
              <li className="text-white/70 text-sm">
                <span className="text-white/90 font-medium">주소:</span>{" "}
                {addressFooter}
              </li>
            </ul>
          </div>

          {/* 주요 업무 */}
          <div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-6 font-sans">
              {servicesTitle}
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
              {quickLinksTitle}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((q, i) =>
                q.isExternal ? (
                  <li key={i}>
                    <a
                      href={q.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 text-sm hover:text-gold transition-colors"
                    >
                      {q.label}
                    </a>
                  </li>
                ) : (
                  <li key={i}>
                    <Link
                      href={q.link}
                      className="text-white/70 text-sm hover:text-gold transition-colors"
                    >
                      {q.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-6 font-sans">
              {contactTitle}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${phoneFinal}`}
                  className="flex items-start gap-3 text-white/70 hover:text-gold transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-sm">Tel: {phoneFinal}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${emailFinal}`}
                  className="flex items-start gap-3 text-white/70 hover:text-gold transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-sm">E-mail: {emailFinal}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">{copyrightText}</p>
          <p className="text-white/40 text-xs text-center">
            부산, 울산, 경남 포함 전국 화학안전 컨설팅 | 화학사고예방관리계획서 | 설치검사 | 영업허가 | PSM | 유해위험방지계획서
          </p>
        </div>
      </div>
    </footer>
  );
}
