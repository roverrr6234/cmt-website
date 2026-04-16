/*
 * Design: "Authoritative Counsel" — Authoritative law firm / engineering office aesthetic
 * Deep Navy + Gold accents, Noto Serif KR headings, generous whitespace
 * Hero: concise slogan + 5 service text links inside hero
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Shield,
  Award,
  Users,
  CheckCircle2,
  Phone,
  Zap,
  MapPin,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import StickyPhone from "@/components/StickyPhone";
import { companyInfo, services } from "@/lib/serviceData";
import { images } from "@/lib/images";

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-5xl lg:text-6xl font-bold text-gold font-serif tabular-nums">
      {count}
      <span className="text-3xl lg:text-4xl">{suffix}</span>
    </div>
  );
}

function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

const whyChooseData = [
  {
    title: "20년 이상 전문 경력",
    desc: "화학물질관리법과 산업안전보건법 분야에서 축적된 깊은 전문성으로 최적의 솔루션을 제공합니다.",
    icon: Shield,
  },
  {
    title: "원스톱 서비스",
    desc: "예방관리계획서부터 영업허가까지, 화학안전 인허가의 모든 과정을 한 곳에서 해결할 수 있습니다.",
    icon: Award,
  },
  {
    title: "높은 적합 판정률",
    desc: "철저한 사전 검토와 현장 점검으로 한 번에 적합 판정을 받을 수 있도록 지원합니다.",
    icon: Target,
  },
  {
    title: "맞춤형 컨설팅",
    desc: "사업장 규모와 취급 물질에 따른 맞춤형 컨설팅으로 불필요한 비용을 절감합니다.",
    icon: Users,
  },
  {
    title: "신속한 대응",
    desc: "법규 개정 및 긴급 상황에 신속하게 대응하여 사업 운영에 차질이 없도록 합니다.",
    icon: Zap,
  },
  {
    title: "전국 서비스",
    desc: "부산, 울산, 경남을 중심으로 전국 어디서나 현장 방문 컨설팅을 제공합니다.",
    icon: MapPin,
  },
];

/* 5대 서비스 텍스트 링크용 데이터 (히어로 내 배치) */
const heroServiceLabels = [
  { slug: "prevention-plan", label: "화학사고 예방관리 계획서" },
  { slug: "installation-inspection", label: "취급시설 설치검사" },
  { slug: "business-license", label: "영업허가" },
  { slug: "psm", label: "공정안전보고서(PSM)" },
  { slug: "hazard-prevention", label: "유해위험방지계획서" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[580px] sm:min-h-[620px] lg:min-h-[700px] flex items-end overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.hero})` }}
        />
        {/* Gradient overlay — stronger at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/50 to-[#000000]/20" />

        <div className="relative container pb-12 sm:pb-14 lg:pb-16 pt-36 sm:pt-40 lg:pt-48">
          {/* Slogan */}
          <h1 className="text-[1.65rem] sm:text-3xl lg:text-[2.6rem] xl:text-5xl font-bold text-white leading-snug mb-5 lg:mb-6 max-w-2xl drop-shadow-lg">
            화학사고 예방을 최선으로,
            <br />
            <span className="text-gold">내 회사처럼</span> 일하는 파트너
          </h1>

          {/* Thin gold divider */}
          <div className="w-16 h-[2px] bg-gold mb-6 lg:mb-7" />

          {/* 5 Service text links — styled as a horizontal nav with separators */}
          <nav
            className="flex flex-wrap items-center gap-y-2.5 mb-8 lg:mb-10"
            aria-label="5대 핵심 서비스"
          >
            {heroServiceLabels.map((svc, i) => (
              <span key={svc.slug} className="flex items-center">
                <Link
                  href={`/service/${svc.slug}`}
                  className="group inline-flex items-center gap-1.5 text-white/90 hover:text-gold transition-colors text-[13px] sm:text-sm lg:text-[15px] font-medium"
                >
                  <span className="text-gold text-[11px] sm:text-xs font-bold opacity-70 group-hover:opacity-100">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="border-b border-transparent group-hover:border-gold pb-0.5 transition-all">
                    {svc.label}
                  </span>
                </Link>
                {i < heroServiceLabels.length - 1 && (
                  <span className="mx-2 sm:mx-3 text-white/20 text-xs select-none">|</span>
                )}
              </span>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href="/contact">
              <Button className="bg-gold hover:bg-gold-dark text-[#000000] font-bold px-7 py-3 rounded-sm text-sm sm:text-base">
                무료 상담 신청
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href={`tel:${companyInfo.phone}`}>
              <Button
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-7 py-3 rounded-sm text-sm sm:text-base bg-transparent"
              >
                <Phone className="w-4 h-4 mr-2" />
                {companyInfo.phone}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* About / Experience Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <FadeInSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-4 font-sans">
                  About Us
                </p>
                <h2 className="text-2xl lg:text-4xl font-bold text-navy mb-6 leading-tight">
                  20년 이상의 EHS 전문 경력,
                  <br />
                  신뢰할 수 있는 파트너
                </h2>
                <div className="gold-line mb-8" />
                <p className="text-foreground/80 text-base leading-relaxed mb-6">
                  화학물질관리기술은 화학물질관리법과 산업안전보건법에 근거한 각종
                  인허가 및 안전 컨설팅을 전문으로 수행하는 기업입니다. 신규 화학물질
                  취급 공장 설립부터 기존 사업장의 설비 변경까지, 기업이 필요로 하는
                  모든 화학안전 서비스를 제공합니다.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "화학사고예방관리계획서 작성 및 제출 대행",
                    "취급시설 설치·정기·수시검사 수검 지원",
                    "유해화학물질 영업허가 취득 전 과정 대행",
                    "공정안전보고서(PSM) 작성 및 심사 대응",
                    "유해위험방지계획서 작성 및 현장 확인 대응",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact">
                  <Button className="bg-navy hover:bg-navy-light text-white px-8 py-3 rounded-sm">
                    상담 문의하기
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <img
                  src={images.aboutTeam}
                  alt="화학물질관리기술 전문 팀"
                  className="rounded-sm shadow-2xl w-full object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-6 -left-6 bg-navy text-white p-6 rounded-sm shadow-xl hidden lg:block">
                  <p className="text-gold text-4xl font-bold font-serif">20+</p>
                  <p className="text-white/80 text-sm mt-1">년 전문 경력</p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { end: 20, suffix: "+", label: "년 전문 경력" },
              { end: 500, suffix: "+", label: "건 프로젝트 수행" },
              { end: 300, suffix: "+", label: "개 고객사" },
              { end: 99, suffix: "%", label: "고객 만족도" },
            ].map((stat, i) => (
              <FadeInSection key={i} delay={i * 150}>
                <div className="text-center">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                  <p className="text-white/70 text-sm mt-2">{stat.label}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-warm-gray">
        <div className="container">
          <FadeInSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-4 font-sans">
                Our Services
              </p>
              <h2 className="text-2xl lg:text-4xl font-bold text-navy mb-6">
                5대 핵심 서비스
              </h2>
              <div className="gold-line mx-auto mb-6" />
              <p className="text-foreground/70 text-base leading-relaxed">
                화학물질관리법과 산업안전보건법에 근거한 전문 컨설팅으로
                귀사의 법적 의무 이행을 완벽하게 지원합니다.
              </p>
            </div>
          </FadeInSection>

          <div className="space-y-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <FadeInSection key={s.id} delay={i * 100}>
                  <Link href={`/service/${s.slug}`}>
                    <div className="bg-white rounded-sm border border-border/50 hover:border-gold/30 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-20 bg-navy/5 group-hover:bg-gold/10 transition-colors flex items-center justify-center p-4 sm:p-0">
                          <Icon className="w-8 h-8 text-gold" />
                        </div>
                        <div className="flex-1 p-6 lg:p-8">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-navy font-bold text-lg lg:text-xl font-serif">
                                  {s.title}
                                </h3>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-sm">
                                  {s.law} {s.lawArticle}
                                </span>
                              </div>
                              <p className="text-foreground/70 text-sm leading-relaxed max-w-2xl">
                                {s.overview.substring(0, 120)}...
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-gold font-medium text-sm shrink-0 group-hover:translate-x-1 transition-transform">
                              자세히 보기
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container">
          <FadeInSection>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-4 font-sans">
                Why Choose Us
              </p>
              <h2 className="text-2xl lg:text-4xl font-bold text-navy mb-6">
                화학물질관리기술을 선택하는 이유
              </h2>
              <div className="gold-line mx-auto" />
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseData.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeInSection key={i} delay={i * 100}>
                  <div className="p-8 border border-border/50 rounded-sm hover:border-gold/30 hover:shadow-lg transition-all duration-300 group h-full">
                    <div className="w-14 h-14 bg-navy/5 rounded-sm flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
                      <Icon className="w-7 h-7 text-navy group-hover:text-gold transition-colors" />
                    </div>
                    <h3 className="text-navy font-bold text-lg mb-3 font-serif">
                      {item.title}
                    </h3>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.ctaBackground})` }}
        />
        <div className="absolute inset-0 bg-navy/85" />
        <div className="relative container text-center">
          <FadeInSection>
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-6">
              화학안전 인허가, 전문가에게 맡기세요
            </h2>
            <p className="text-white/70 text-base lg:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              복잡한 법규와 절차, 화학물질관리기술이 함께합니다.
              <br />
              무료 상담을 통해 귀사에 필요한 서비스를 확인하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-gold hover:bg-gold-dark text-navy font-bold px-10 py-3.5 rounded-sm text-base">
                  무료 상담 신청
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href={`tel:${companyInfo.phone}`}>
                <Button
                  variant="outline"
                  className="border-2 border-white/40 text-white hover:bg-white/10 px-10 py-3.5 rounded-sm text-base bg-transparent"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {companyInfo.phone}
                </Button>
              </a>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white" id="contact">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              <FadeInSection>
                <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-4 font-sans">
                  Contact Us
                </p>
                <h2 className="text-2xl lg:text-3xl font-bold text-navy mb-6">
                  상담 신청
                </h2>
                <div className="gold-line mb-8" />
                <p className="text-foreground/70 text-base leading-relaxed mb-8">
                  화학안전 인허가에 관한 궁금한 점이 있으시면 언제든지 문의해 주세요.
                  전문 컨설턴트가 빠르게 답변 드리겠습니다.
                </p>
                <div className="space-y-4">
                  <a
                    href={`tel:${companyInfo.phone}`}
                    className="flex items-center gap-4 p-4 bg-warm-gray rounded-sm hover:bg-navy hover:text-white transition-all group"
                  >
                    <div className="w-12 h-12 bg-navy rounded-sm flex items-center justify-center group-hover:bg-gold transition-colors">
                      <Phone className="w-5 h-5 text-gold group-hover:text-navy" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground group-hover:text-white/70">
                        전화 상담
                      </p>
                      <p className="font-bold text-navy group-hover:text-white">
                        {companyInfo.phone}
                      </p>
                    </div>
                  </a>
                </div>
              </FadeInSection>
            </div>
            <div className="lg:col-span-3">
              <FadeInSection delay={200}>
                <ContactForm />
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <StickyPhone />
    </div>
  );
}
