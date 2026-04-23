/*
 * Design: "Authoritative Counsel" — Service detail page
 * Renders all section types: alert, table, checklist, procedure-image, text
 * Includes mid-page CTA and strong typographic hierarchy
 */
import { useParams, Link } from "wouter";
import {
  ArrowRight,
  ArrowLeft,
  Phone,
  FileText,
  Target,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  ClipboardList,
  Info,
  Lightbulb,
  CheckSquare,
  ImageIcon,
  Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import StickyPhone from "@/components/StickyPhone";
import { sanityClient, SERVICE_BY_SLUG_QUERY, SERVICES_QUERY, COMPANY_INFO_QUERY, SanityService, SanityCompanyInfo, sanityImageUrl } from "@/lib/sanity";
import { useEffect, useRef, useState, useCallback } from "react";
import { diagramComponents } from "@/components/diagrams";

/* ── Breadcrumb with hover dropdown ── */
function BreadcrumbNav({ currentSlug, currentTitle, services }: { currentSlug: string; currentTitle: string; services: SanityService[] }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 200);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <nav className="flex items-center gap-2 text-sm text-white/50 mb-8" aria-label="breadcrumb">
      <Link href="/" className="hover:text-gold transition-colors">
        홈
      </Link>
      <ChevronRight className="w-3 h-3" />
      <div
        className="relative"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <button
          className="hover:text-gold transition-colors cursor-pointer underline-offset-4 hover:underline"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          주요 업무
        </button>
        {dropdownOpen && (
          <div
            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-sm shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            {services.map((s) => (
              <Link
                key={s._id}
                href={`/service/${s.slug.current}`}
                className={`block px-4 py-2.5 text-sm transition-colors ${
                  s.slug.current === currentSlug
                    ? "text-gold bg-navy/5 font-semibold"
                    : "text-navy/80 hover:text-gold hover:bg-navy/5"
                }`}
              >
                {s.title}
              </Link>
            ))}
          </div>
        )}
      </div>
      <ChevronRight className="w-3 h-3" />
      <span className="text-gold">{currentTitle}</span>
    </nav>
  );
}

/* ── Fade-in on scroll ── */
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Section Heading ── */
function SectionHeading({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 bg-gold/10 rounded-sm flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-navy font-bold text-lg font-serif">{title}</h3>
    </div>
  );
}

/* ── Alert Box ── */
function AlertBox({ section }: { section: any }) {
  if (!section.alertType) return null;
  const alertConfig = {
    warning: { bg: "bg-amber-50", border: "border-amber-200", icon: AlertTriangle, text: "text-amber-900" },
    info: { bg: "bg-blue-50", border: "border-blue-200", icon: Info, text: "text-blue-900" },
    tip: { bg: "bg-emerald-50", border: "border-emerald-200", icon: Lightbulb, text: "text-emerald-900" },
  };
  const config = alertConfig[section.alertType as keyof typeof alertConfig] || alertConfig.info;
  const AlertIcon = config.icon;
  return (
    <div>
      <SectionHeading title={section.alertTitle} icon={<AlertIcon className="w-5 h-5 text-gold" />} />
      <div className={`${config.bg} border ${config.border} rounded-sm p-5 lg:p-6`}>
        <p className={`text-sm leading-relaxed whitespace-pre-line ${config.text}`}>{section.alertContent}</p>
      </div>
    </div>
  );
}

/* ── Data Table ── */
function DataTable({ section }: { section: any }) {
  if (!section.headers || !section.rows) return null;
  return (
    <div>
      <SectionHeading title={section.sectionTitle} icon={<Table2 className="w-5 h-5 text-gold" />} />
      <div className="overflow-x-auto border border-border rounded-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy">
              {section.headers.map((h: string, i: number) => (
                <th key={i} className="px-4 py-3 text-left font-semibold text-white text-sm whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row: any, i: number) => (
              <tr key={i} className={`border-t border-border ${i % 2 === 0 ? "bg-white" : "bg-warm-gray"}`}>
                {row.cells.map((cell: string, j: number) => (
                  <td key={j} className="px-4 py-3 text-foreground/80 text-sm align-top whitespace-pre-line">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {section.footnote && (
        <p className="mt-3 text-xs text-foreground/50 leading-relaxed whitespace-pre-line">{section.footnote}</p>
      )}
    </div>
  );
}

/* ── Checklist ── */
function ChecklistBox({ section }: { section: any }) {
  if (!section.items) return null;
  return (
    <div>
      <SectionHeading title={section.checklistTitle} icon={<CheckSquare className="w-5 h-5 text-gold" />} />
      <div className="bg-warm-gray rounded-sm p-5 lg:p-6">
        <ul className="space-y-3">
          {section.items.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-1" />
              <span className="text-sm text-foreground/80 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Image Section ── */
function ImageSection({ section }: { section: any }) {
  if (!section.image) return null;
  return (
    <div>
      <SectionHeading title={section.sectionTitle} icon={<ImageIcon className="w-5 h-5 text-gold" />} />
      <figure className="bg-white border border-border rounded-sm overflow-hidden">
        <div className="p-2 lg:p-4 bg-warm-gray">
          <img
            src={sanityImageUrl(section.image.asset._ref)}
            alt={section.caption || section.sectionTitle}
            className="w-full h-auto rounded-sm"
            loading="lazy"
          />
        </div>
        {section.caption && (
          <figcaption className="px-4 py-3 text-xs text-foreground/50 border-t border-border bg-white leading-relaxed">
            {section.caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

/* ── Text Block ── */
function TextBlock({ section }: { section: any }) {
  if (!section.content) return null;
  return (
    <div>
      <SectionHeading title={section.sectionTitle} icon={<BookOpen className="w-5 h-5 text-gold" />} />
      <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
        {section.content}
      </div>
    </div>
  );
}

/* ── Mid-page CTA ── */
function MidPageCTA() {
  return (
    <div className="my-10 lg:my-14 py-8 px-6 lg:px-10 bg-gradient-to-r from-navy to-navy-light rounded-sm text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />
      <p className="text-white/70 text-sm mb-2">복잡한 인허가, 혼자 고민하지 마세요</p>
      <h3 className="text-white text-xl lg:text-2xl font-bold font-serif mb-5">
        전문가와 빠른 해결
      </h3>
      <Link href="/contact">
        <Button className="bg-gold hover:bg-gold-dark text-navy font-bold px-8 py-3 text-base rounded-sm shadow-lg hover:shadow-xl transition-all">
          무료 상담 신청하기
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}

/* ── Section router ── */
function RenderSection({ section }: { section: any }) {
  const sectionType = section._type;
  switch (sectionType) {
    case "alertSection":
      return <AlertBox section={section} />;
    case "tableSection":
      return <DataTable section={section} />;
    case "checklistSection":
      return <ChecklistBox section={section} />;
    case "imageSection":
      return <ImageSection section={section} />;
    case "textSection":
      return <TextBlock section={section} />;
    default:
      return null;
  }
}

/* ══════════════════════════════════════════════
 * Main Component
 * ══════════════════════════════════════════════ */
export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<SanityService | null>(null);
  const [services, setServices] = useState<SanityService[]>([]);
  const [companyInfo, setCompanyInfo] = useState<SanityCompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [serviceData, servicesData, companyData] = await Promise.all([
          sanityClient.fetch(SERVICE_BY_SLUG_QUERY, { slug }),
          sanityClient.fetch(SERVICES_QUERY),
          sanityClient.fetch(COMPANY_INFO_QUERY),
        ]);
        setService(serviceData);
        setServices(servicesData);
        setCompanyInfo(companyData);
      } catch (err) {
        console.error("Failed to fetch service data:", err);
        setError("서비스 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-foreground/60">로딩 중...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service || !companyInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-foreground/60">{error || "서비스를 찾을 수 없습니다."}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const serviceIndex = services.findIndex((s) => s._id === service._id);
  const prevService = serviceIndex > 0 ? services[serviceIndex - 1] : null;
  const nextService = serviceIndex < services.length - 1 ? services[serviceIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* ── Hero Section ── */}
      <section className="relative min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: service.cardImage
              ? `url(${sanityImageUrl(service.cardImage.asset._ref)})`
              : "linear-gradient(135deg, #001a4d 0%, #1a3a52 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/55 to-[#000000]/25" />

        <div className="relative container py-16 sm:py-20 lg:py-24">
          <FadeIn>
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3 font-sans">
              {service.law} {service.lawArticle}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6 max-w-3xl">
              {service.title}
            </h1>
            <div className="w-16 h-1 bg-gold mb-6" />
            <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed">
              {service.overview}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="flex-1 bg-white">
        <div className="container py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* ── Main column ── */}
            <div className="lg:col-span-2 space-y-10">
              <FadeIn>
                <BreadcrumbNav currentSlug={slug} currentTitle={service.title} services={services} />
              </FadeIn>

              {/* Penalty */}
              {service.penalty && (
                <FadeIn delay={100}>
                  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-sm">
                    <p className="text-sm text-red-900 leading-relaxed">
                      <span className="font-bold">⚠️ 미이행 시 벌칙:</span> {service.penalty}
                    </p>
                  </div>
                </FadeIn>
              )}

              {/* Tasks */}
              {service.tasks && service.tasks.length > 0 && (
                <FadeIn delay={150}>
                  <div>
                    <SectionHeading title="주요 업무 범위" icon={<ClipboardList className="w-5 h-5 text-gold" />} />
                    <ul className="space-y-3">
                      {service.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-1" />
                          <span className="text-sm text-foreground/80">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              )}

              {/* Procedure */}
              {service.procedure && service.procedure.length > 0 && (
                <FadeIn delay={200}>
                  <div>
                    <SectionHeading title="진행 절차" icon={<FileText className="w-5 h-5 text-gold" />} />
                    <div className="space-y-4">
                      {service.procedure.map((step, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {i + 1}
                            </div>
                            {i < service.procedure.length - 1 && <div className="w-0.5 h-12 bg-gold/30 mt-2" />}
                          </div>
                          <div className="pb-4">
                            <h4 className="font-semibold text-navy mb-1">{step.step}</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed">{step.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Mid-page CTA */}
              <MidPageCTA />

              {/* Dynamic Sections */}
              {service.sections && service.sections.length > 0 && (
                <FadeIn delay={300}>
                  <div className="space-y-10">
                    {service.sections.map((section, i) => (
                      <div key={section.sectionId || i}>
                        <RenderSection section={section} />
                      </div>
                    ))}
                  </div>
                </FadeIn>
              )}

              {/* Documents */}
              {service.documents && service.documents.length > 0 && (
                <FadeIn delay={400}>
                  <div>
                    <SectionHeading title="필요 서류" icon={<FileText className="w-5 h-5 text-gold" />} />
                    <ul className="space-y-2">
                      {service.documents.map((doc, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <FileText className="w-4 h-4 text-gold shrink-0 mt-1" />
                          <span className="text-sm text-foreground/80">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              )}

              {/* CTA Section */}
              <FadeIn delay={500}>
                <div className="py-8 px-6 lg:px-10 bg-gradient-to-r from-navy to-navy-light rounded-sm text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />
                  <p className="text-white/70 text-sm mb-2">
                    {service.shortTitle} 관련 궁금한 점이 있으신가요?
                  </p>
                  <h3 className="text-white text-xl lg:text-2xl font-bold font-serif mb-5">
                    20년 경력 전문가에게 무료 상담받으세요
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/contact">
                      <Button className="bg-gold hover:bg-gold-dark text-navy font-bold px-8 py-3 text-base rounded-sm shadow-lg hover:shadow-xl transition-all">
                        무료 상담 신청하기
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <a
                      href={`tel:${companyInfo.phone}`}
                      className="inline-flex items-center gap-2 text-white/80 hover:text-gold transition-colors text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      {companyInfo.phone}
                    </a>
                  </div>
                </div>
              </FadeIn>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-8 border-t border-border">
                {prevService ? (
                  <Link
                    href={`/service/${prevService.slug.current}`}
                    className="flex items-center gap-2 text-sm text-navy hover:text-gold transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {prevService.shortTitle}
                  </Link>
                ) : (
                  <div />
                )}
                {nextService ? (
                  <Link
                    href={`/service/${nextService.slug.current}`}
                    className="flex items-center gap-2 text-sm text-navy hover:text-gold transition-colors"
                  >
                    {nextService.shortTitle}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                <ContactForm variant="compact" />

                {/* Other Services */}
                <div className="bg-white border border-border rounded-sm p-6">
                  <h3 className="text-navy font-bold text-sm mb-4 font-serif">
                    다른 서비스
                  </h3>
                  <ul className="space-y-2">
                    {services
                      .filter((s) => s._id !== service._id)
                      .map((s) => (
                        <li key={s._id}>
                          <Link
                            href={`/service/${s.slug.current}`}
                            className="flex items-center gap-3 p-3 rounded-sm hover:bg-warm-gray transition-colors group"
                          >
                            <Target className="w-4 h-4 text-steel group-hover:text-gold transition-colors" />
                            <span className="text-sm text-foreground/80 group-hover:text-navy transition-colors">
                              {s.shortTitle}
                            </span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Quick Contact */}
                <a
                  href={`tel:${companyInfo.phone}`}
                  className="block bg-navy text-white p-6 rounded-sm hover:bg-navy-light transition-colors"
                >
                  <Phone className="w-6 h-6 text-gold mb-3" />
                  <p className="text-sm text-white/70 mb-1">전화 상담</p>
                  <p className="font-bold text-lg">{companyInfo.phone}</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <StickyPhone phone={companyInfo.phone} />
    </div>
  );
}
