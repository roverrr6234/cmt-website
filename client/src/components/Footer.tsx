/*
 * Design: "Authoritative Counsel" — Deep Navy footer with gold accents
 * SEO keywords: 부산, 울산, 경남 포함 전국 화학안전 컨설팅
 * Blog link → external Naver blog (target="_blank")
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Phone, Mail } from "lucide-react";
import { sanityClient, FOOTER_QUERY, SERVICES_QUERY, SanityFooter, SanityService } from "@/lib/sanity";

const BLOG_URL = "https://blog.naver.com/ckt9054";

export default function Footer() {
  const [footer, setFooter] = useState<SanityFooter | null>(null);
  const [services, setServices] = useState<SanityService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [footerData, servicesData] = await Promise.all([
          sanityClient.fetch(FOOTER_QUERY),
          sanityClient.fetch(SERVICES_QUERY),
        ]);
        setFooter(footerData);
        setServices(servicesData);
      } catch (err) {
        console.error("Failed to fetch footer data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !footer) {
    return null;
  }

  return (
    <footer className="bg-navy text-white">
      {/* Main footer */}
      <div className="container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* 사업자 정보 */}
          <div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-6 font-sans">
              {footer.businessInfoTitle}
            </h3>
            <ul className="space-y-3">
              <li className="text-white/70 text-sm">
                <span className="text-white/90 font-medium">상호명:</span> {footer.companyNameFooter}
              </li>
              <li className="text-white/70 text-sm">
                <span className="text-white/90 font-medium">대표자:</span> {footer.ceoNameFooter}
              </li>
              <li className="text-white/70 text-sm">
                <span className="text-white/90 font-medium">사업자등록번호:</span> {footer.businessNumberFooter}
              </li>
              <li className="text-white/70 text-sm">
                <span className="text-white/90 font-medium">주소:</span> {footer.addressFooter}
              </li>
            </ul>
          </div>

          {/* 주요 업무 */}
          <div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-6 font-sans">
              {footer.servicesTitle}
            </h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s._id}>
                  <Link
                    href={`/service/${s.slug.current}`}
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
              {footer.quickLinksTitle}
            </h3>
            <ul className="space-y-3">
              {footer.quickLinks.map((link) => (
                <li key={link._key}>
                  {link.isExternal ? (
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 text-sm hover:text-gold transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.link} className="text-white/70 text-sm hover:text-gold transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-6 font-sans">
              {footer.contactTitle}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${footer.phoneFooter}`}
                  className="flex items-start gap-3 text-white/70 hover:text-gold transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-sm">Tel: {footer.phoneFooter}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${footer.emailFooter}`}
                  className="flex items-start gap-3 text-white/70 hover:text-gold transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-sm">E-mail: {footer.emailFooter}</span>
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
            {footer.copyrightText}
          </p>
          <p className="text-white/40 text-xs text-center">
            부산, 울산, 경남 포함 전국 화학안전 컨설팅 | 화학사고예방관리계획서 | 설치검사 | 영업허가 | PSM | 유해위험방지계획서
          </p>
        </div>
      </div>
    </footer>
  );
}
