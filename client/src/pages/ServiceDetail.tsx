/*
 * Design: "Authoritative Counsel" — Service detail page
 * Renders all section types: alert, table, checklist, procedure-image, text, comparison-table
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
import { services, companyInfo } from "@/lib/serviceData";
import type { ServiceSection, ServiceData } from "@/lib/serviceData";
import { useEffect, useRef, useState, useCallback } from "react";
import { diagramComponents } from "@/components/diagrams";
import { getServiceBySlug } from "@/lib/sanity";
import { convertSanityService } from "@/lib/sanityToService";

/* ── Breadcrumb with hover dropdown ── */
function BreadcrumbNav({ currentSlug, currentTitle }: { currentSlug: string; currentTitle: string }) {
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
                key={s.id}
                href={`/service/${s.slug}`}
                className={`block px-4 py-2.5 text-sm transition-colors ${
                  s.slug === currentSlug
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
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.08 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════
 * Section Renderers
 * ══════════════════════════════════════════════ */

function SectionHeading({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      {icon || <Table2 className="w-5 h-5 text-gold" />}
      <h3 className="text-lg lg:text-xl font-bold text-navy font-serif">{title}</h3>
    </div>
  );
}

function AlertBox({ section }: { section: ServiceSection }) {
  if (!section.alert) return null;
  const a = section.alert;
  const styles: Record<string, { bg: string; icon: React.ReactNode; titleColor: string; textColor: string }> = {
    warning: {
      bg: "bg-amber-50 border-amber-400",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
      titleColor: "text-amber-800",
      textColor: "text-amber-700",
    },
    info: {
      bg: "bg-sky-50 border-sky-400",
      icon: <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />,
      titleColor: "text-sky-800",
      textColor: "text-sky-700",
    },
    tip: {
      bg: "bg-emerald-50 border-emerald-400",
      icon: <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
      titleColor: "text-emerald-800",
      textColor: "text-emerald-700",
    },
    danger: {
      bg: "bg-red-50 border-red-400",
      icon: <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />,
      titleColor: "text-red-800",
      textColor: "text-red-700",
    },
  };
  const s = styles[a.type] || styles.info;
  return (
    <div className={`p-5 border-l-4 rounded-sm ${s.bg}`}>
      <div className="flex items-start gap-3">
        {s.icon}
        <div>
          <p className={`font-bold text-sm mb-1 ${s.titleColor}`}>{a.title}</p>
          <p className={`text-sm leading-relaxed ${s.textColor}`}>{a.content}</p>
        </div>
      </div>
    </div>
  );
}

function DataTable({ section }: { section: ServiceSection }) {
  if (!section.table) return null;
  const t = section.table;
  return (
    <div>
      <SectionHeading title={section.title} icon={<Table2 className="w-5 h-5 text-gold" />} />
      <div className="overflow-x-auto border border-border rounded-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy">
              {t.headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-left font-semibold text-white text-sm whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((row, i) => (
              <tr key={i} className={`border-t border-border ${i % 2 === 0 ? "bg-white" : "bg-warm-gray"}`}>
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-foreground/80 text-sm align-top whitespace-pre-line">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {t.footnote && (
        <p className="mt-3 text-xs text-foreground/50 leading-relaxed whitespace-pre-line">{t.footnote}</p>
      )}
    </div>
  );
}

function ComparisonTable({ section }: { section: ServiceSection }) {
  if (!section.comparisonTable) return null;
  const ct = section.comparisonTable;
  return (
    <div>
      <SectionHeading title={section.title} icon={<Table2 className="w-5 h-5 text-gold" />} />
      <div className="overflow-x-auto border border-border rounded-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy">
              {ct.headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-left font-semibold text-white text-sm whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ct.rows.map((row, i) => {
              const isMainCategory = !row.label.startsWith("  ");
              return (
                <tr
                  key={i}
                  className={`border-t border-border ${isMainCategory ? "bg-navy/5" : i % 2 === 0 ? "bg-white" : "bg-warm-gray"}`}
                >
                  <td className={`px-4 py-3 text-foreground/90 text-sm ${isMainCategory ? "font-bold text-navy" : "pl-8"}`}>
                    {row.label.trim()}
                  </td>
                  {row.values.map((v, j) => (
                    <td key={j} className="px-4 py-3 text-center text-sm">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          v === "O"
                            ? "bg-emerald-100 text-emerald-700"
                            : v === "X"
                              ? "bg-gray-100 text-gray-400"
                              : "text-foreground/70"
                        }`}
                      >
                        {v}
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {ct.footnote && (
        <p className="mt-3 text-xs text-foreground/50">{ct.footnote}</p>
      )}
    </div>
  );
}

function ChecklistBox({ section }: { section: ServiceSection }) {
  if (!section.checklist) return null;
  const cl = section.checklist;
  return (
    <div>
      <SectionHeading title={section.title} icon={<CheckSquare className="w-5 h-5 text-gold" />} />
      <div className="bg-warm-gray rounded-sm p-5 lg:p-6">
        <p className="text-sm font-semibold text-navy mb-4">{cl.title}</p>
        <ul className="space-y-3">
          {cl.items.map((item, i) => (
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

function ProcedureImage({ section }: { section: ServiceSection }) {
  // Check if a diagram component exists for this section id
  const DiagramComponent = diagramComponents[section.id];
  if (DiagramComponent) {
    return (
      <div className="bg-white border border-border rounded-sm p-4 lg:p-6 overflow-hidden">
        <DiagramComponent />
      </div>
    );
  }
  // Fallback to image if no diagram component
  if (!section.image) return null;
  const img = section.image;
  return (
    <div>
      <SectionHeading title={section.title} icon={<ImageIcon className="w-5 h-5 text-gold" />} />
      <figure className="bg-white border border-border rounded-sm overflow-hidden">
        <div className="p-2 lg:p-4 bg-warm-gray">
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-auto rounded-sm"
            loading="lazy"
          />
        </div>
        {img.caption && (
          <figcaption className="px-4 py-3 text-xs text-foreground/50 border-t border-border bg-white leading-relaxed">
            {img.caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

function RawSvgBlock({ section }: { section: ServiceSection }) {
  if (!section.rawSvg?.svg) return null;
  // 관리자 입력이지만 최소 sanitize: <script> 블록과 on* 이벤트 속성 제거.
  const sanitized = section.rawSvg.svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "");
  return (
    <div>
      <SectionHeading title={section.title} icon={<ImageIcon className="w-5 h-5 text-gold" />} />
      <figure className="bg-white border border-border rounded-sm overflow-hidden">
        <div
          className="p-4 lg:p-6 bg-warm-gray flex items-center justify-center [&_svg]:max-w-full [&_svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
        {section.rawSvg.caption && (
          <figcaption className="px-4 py-3 text-xs text-foreground/50 border-t border-border bg-white leading-relaxed">
            {section.rawSvg.caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

function TextBlock({ section }: { section: ServiceSection }) {
  if (!section.content) return null;
  return (
    <div>
      <SectionHeading title={section.title} icon={<BookOpen className="w-5 h-5 text-gold" />} />
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
function RenderSection({ section }: { section: ServiceSection }) {
  switch (section.type) {
    case "alert":
      return <AlertBox section={section} />;
    case "table":
      return <DataTable section={section} />;
    case "comparison-table":
      return <ComparisonTable section={section} />;
    case "checklist":
      return <ChecklistBox section={section} />;
    case "procedure-image":
      return <ProcedureImage section={section} />;
    case "raw-svg":
      return <RawSvgBlock section={section} />;
    case "text":
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

  /**
   * 데이터 조회 전략 (디자인 불변, fallback-first):
   * 1. 즉시: 코드 안의 5대 서비스(serviceData.ts) 에서 동기적으로 찾는다 — 첫 렌더부터 깜빡임 없음.
   * 2. 비동기: Sanity 에서 같은 slug 로 다시 조회. 있으면 그 데이터로 교체 (아버님 수정 반영).
   * 3. 둘 다 없으면 404.
   * 4. 새로 추가된 Sanity-only 서비스도 잠깐의 로딩 후 동일 디자인으로 렌더.
   */
  const fallback = services.find((s) => s.slug === slug);
  const [service, setService] = useState<ServiceData | null | undefined>(
    fallback ?? undefined,
  );

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!slug) {
      setService(null);
      return;
    }

    let cancelled = false;
    setService(fallback ?? undefined);

    getServiceBySlug(slug)
      .then((sanityDoc) => {
        if (cancelled) return;
        const converted = convertSanityService(sanityDoc);
        if (converted) {
          setService(converted);
        } else if (!fallback) {
          setService(null);
        }
      })
      .catch(() => {
        if (cancelled) return;
        if (!fallback) setService(null);
      });

    return () => {
      cancelled = true;
    };
    // fallback 은 slug 에서 파생되므로 slug 만 deps 로
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // 로딩 중 (Sanity 응답 대기, fallback 도 없음): 빈 화면 + 헤더만
  if (service === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1" />
        <Footer />
      </div>
    );
  }

  if (service === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-navy mb-4 font-serif">
              페이지를 찾을 수 없습니다
            </h1>
            <Link href="/">
              <Button className="bg-navy text-white">홈으로 돌아가기</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = service.icon;
  const currentIndex = services.findIndex((s) => s.slug === slug);
  const prevService = currentIndex > 0 ? services[currentIndex - 1] : null;
  const nextService =
    currentIndex < services.length - 1 ? services[currentIndex + 1] : null;

  // Calculate mid-point for CTA insertion
  const midIdx = Math.floor(service.sections.length / 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* ── Breadcrumb + Hero ── */}
      <section className="bg-navy py-16 lg:py-24">
        <div className="container">
          <BreadcrumbNav currentSlug={slug || ''} currentTitle={service.shortTitle} />
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gold/20 rounded-sm items-center justify-center shrink-0 hidden sm:flex">
              <Icon className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 font-serif leading-tight">
                {service.title}
              </h1>
              <p className="text-white/60 text-sm mb-2">
                {service.law} {service.lawArticle} | {service.description}
              </p>
              <div className="gold-line mt-6" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 py-12 lg:py-20">
          {/* ── Main Column ── */}
          <div className="lg:col-span-2 space-y-12 lg:space-y-16">
            {/* Overview */}
            <FadeIn>
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-5 h-5 text-gold" />
                  <h2 className="text-xl lg:text-2xl font-bold text-navy font-serif">
                    개요
                  </h2>
                </div>
                <p className="text-foreground/80 text-base leading-relaxed">
                  {service.overview}
                </p>
                {service.penalty && (
                  <div className="mt-6 p-4 bg-destructive/5 border-l-4 border-destructive/60 rounded-sm flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-destructive mb-1">
                        벌칙 규정
                      </p>
                      <p className="text-sm text-foreground/70">
                        {service.penalty}
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </FadeIn>

            {/* Tasks */}
            <FadeIn>
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <ClipboardList className="w-5 h-5 text-gold" />
                  <h2 className="text-xl lg:text-2xl font-bold text-navy font-serif">
                    업무 내용
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.tasks.map((task, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-warm-gray rounded-sm"
                    >
                      <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{task}</span>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>

            {/* Targets */}
            <FadeIn>
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-5 h-5 text-gold" />
                  <h2 className="text-xl lg:text-2xl font-bold text-navy font-serif">
                    대상
                  </h2>
                </div>
                <ul className="space-y-3">
                  {service.targets.map((target, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-4 border border-border/50 rounded-sm"
                    >
                      <div className="w-6 h-6 bg-navy rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs text-gold font-bold">
                          {i + 1}
                        </span>
                      </div>
                      <span className="text-sm text-foreground/80 leading-relaxed">
                        {target}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </FadeIn>

            {/* Procedure Diagram */}
            <FadeIn>
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-5 h-5 text-gold" />
                  <h2 className="text-xl lg:text-2xl font-bold text-navy font-serif">
                    제출 절차
                  </h2>
                </div>
                <div className="relative">
                  {service.procedure.map((step, i) => (
                    <div key={i} className="flex gap-4 mb-0 last:mb-0">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white">
                          <span className="text-gold font-bold text-sm">
                            {i + 1}
                          </span>
                        </div>
                        {i < service.procedure.length - 1 && (
                          <div className="w-0.5 h-full bg-border min-h-[3rem]" />
                        )}
                      </div>
                      <div className="pb-8 last:pb-0">
                        <h4 className="text-navy font-bold text-base mb-1">
                          {step.step}
                        </h4>
                        <p className="text-foreground/70 text-sm">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>

            {/* Documents */}
            <FadeIn>
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-5 h-5 text-gold" />
                  <h2 className="text-xl lg:text-2xl font-bold text-navy font-serif">
                    필요 서류
                  </h2>
                </div>
                <div className="bg-warm-gray p-6 rounded-sm">
                  <ul className="space-y-3">
                    {service.documents.map((doc, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full shrink-0 mt-2" />
                        <span className="text-sm text-foreground/80 leading-relaxed">
                          {doc}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </FadeIn>

            {/* ══ Sections from serviceData ══ */}
            {service.sections.length > 0 && (
              <div className="space-y-10 lg:space-y-14">
                <FadeIn>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="gold-line-wide" />
                    <h2 className="text-xl lg:text-2xl font-bold text-navy font-serif">
                      상세 정보
                    </h2>
                  </div>
                  <p className="text-sm text-foreground/50 mb-8">
                    법적 근거, 세부 기준 및 참고 자료를 확인하세요.
                  </p>
                </FadeIn>

                {service.sections.map((section, idx) => (
                  <div key={section.id}>
                    <FadeIn>
                      <RenderSection section={section} />
                    </FadeIn>

                    {/* Mid-page CTA after the middle section */}
                    {idx === midIdx && (
                      <FadeIn>
                        <MidPageCTA />
                      </FadeIn>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Table Data (legacy) */}
            {service.tableData && (
              <FadeIn>
                <section>
                  <h2 className="text-xl lg:text-2xl font-bold text-navy font-serif mb-6">
                    상세 정보
                  </h2>
                  <div className="overflow-x-auto border border-border rounded-sm">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-navy text-white">
                          {service.tableData.headers.map((h, i) => (
                            <th
                              key={i}
                              className="px-4 py-3 text-left font-medium text-sm"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {service.tableData.rows.map((row, i) => (
                          <tr
                            key={i}
                            className={`border-t border-border ${
                              i % 2 === 0 ? "bg-white" : "bg-warm-gray"
                            }`}
                          >
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                className="px-4 py-3 text-foreground/80"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </FadeIn>
            )}

            {/* Additional Info */}
            {service.additionalInfo && (
              <FadeIn>
                <section>
                  <h2 className="text-xl lg:text-2xl font-bold text-navy font-serif mb-6">
                    참고 사항
                  </h2>
                  <div className="space-y-3">
                    {service.additionalInfo.map((info, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 bg-navy/5 rounded-sm"
                      >
                        <span className="text-gold font-bold text-sm">※</span>
                        <span className="text-sm text-foreground/70 leading-relaxed">
                          {info}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeIn>
            )}

            {/* Bottom CTA */}
            <FadeIn>
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
                  href={`/service/${prevService.slug}`}
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
                  href={`/service/${nextService.slug}`}
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
                    .filter((s) => s.id !== service.id)
                    .map((s) => {
                      const SIcon = s.icon;
                      return (
                        <li key={s.id}>
                          <Link
                            href={`/service/${s.slug}`}
                            className="flex items-center gap-3 p-3 rounded-sm hover:bg-warm-gray transition-colors group"
                          >
                            <SIcon className="w-4 h-4 text-steel group-hover:text-gold transition-colors" />
                            <span className="text-sm text-foreground/80 group-hover:text-navy transition-colors">
                              {s.shortTitle}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
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

      <Footer />
      <StickyPhone />
    </div>
  );
}
