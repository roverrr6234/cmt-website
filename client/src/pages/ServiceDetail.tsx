/*
 * Design: "Authoritative Counsel" — Service detail page
 * Structure: Overview → Targets → Procedure diagram → Documents → Table → CTA
 * Each service page follows the same layout with data from serviceData.ts
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import StickyPhone from "@/components/StickyPhone";
import { services, companyInfo } from "@/lib/serviceData";
import { useEffect, useRef, useState } from "react";

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = services.find((s) => s.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!service) {
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
  const nextService = currentIndex < services.length - 1 ? services[currentIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Breadcrumb + Hero */}
      <section className="bg-navy py-16 lg:py-24">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-gold transition-colors">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <span>주요 업무</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold">{service.shortTitle}</span>
          </nav>
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gold/20 rounded-sm flex items-center justify-center shrink-0 hidden sm:flex">
              <Icon className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
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

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 py-12 lg:py-20">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12 lg:space-y-16">
            {/* Overview */}
            <FadeIn>
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-5 h-5 text-gold" />
                  <h2 className="text-xl lg:text-2xl font-bold text-navy font-serif">개요</h2>
                </div>
                <p className="text-foreground/80 text-base leading-relaxed">
                  {service.overview}
                </p>
                {service.penalty && (
                  <div className="mt-6 p-4 bg-destructive/5 border border-destructive/20 rounded-sm flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive mb-1">벌칙 규정</p>
                      <p className="text-sm text-foreground/70">{service.penalty}</p>
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
                  <h2 className="text-xl lg:text-2xl font-bold text-navy font-serif">업무 내용</h2>
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
                  <h2 className="text-xl lg:text-2xl font-bold text-navy font-serif">대상</h2>
                </div>
                <ul className="space-y-3">
                  {service.targets.map((target, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 border border-border/50 rounded-sm">
                      <div className="w-6 h-6 bg-navy rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs text-gold font-bold">{i + 1}</span>
                      </div>
                      <span className="text-sm text-foreground/80">{target}</span>
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
                  <h2 className="text-xl lg:text-2xl font-bold text-navy font-serif">제출 절차</h2>
                </div>
                <div className="relative">
                  {service.procedure.map((step, i) => (
                    <div key={i} className="flex gap-4 mb-0 last:mb-0">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white">
                          <span className="text-gold font-bold text-sm">{i + 1}</span>
                        </div>
                        {i < service.procedure.length - 1 && (
                          <div className="w-0.5 h-full bg-border min-h-[3rem]" />
                        )}
                      </div>
                      {/* Content */}
                      <div className="pb-8 last:pb-0">
                        <h4 className="text-navy font-bold text-base mb-1">{step.step}</h4>
                        <p className="text-foreground/70 text-sm">{step.detail}</p>
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
                  <h2 className="text-xl lg:text-2xl font-bold text-navy font-serif">필요 서류</h2>
                </div>
                <div className="bg-warm-gray p-6 rounded-sm">
                  <ul className="space-y-3">
                    {service.documents.map((doc, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full shrink-0 mt-2" />
                        <span className="text-sm text-foreground/80">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </FadeIn>

            {/* Table Data */}
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
                              <td key={j} className="px-4 py-3 text-foreground/80">
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
                      <div key={i} className="flex items-start gap-3 p-4 bg-navy/5 rounded-sm">
                        <span className="text-gold font-bold text-sm">※</span>
                        <span className="text-sm text-foreground/80">{info}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeIn>
            )}

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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Contact Form */}
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
