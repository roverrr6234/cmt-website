/**
 * Design: "Authoritative Counsel" — Authoritative law firm / engineering office aesthetic
 * Deep Navy + Gold accents, Noto Serif KR headings, generous whitespace
 * Hero: bold slogan + enlarged CTA buttons (no service links — moved to GNB)
 * About section: text-only (meeting photo removed)
 * DATA: All content loaded from Sanity CMS. Fallback to hardcoded defaults.
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
import { getCompanyInfo, getAllServices, getHomePage } from "@/lib/sanity";
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

const ICON_MAP: Record<string, React.ElementType> = {
  Shield, Award, Target, Users, Zap, MapPin,
};

const DEFAULT_WHY_CHOOSE = [
  { title: "20년 이상 전문 경력", desc: "화학물질관리법과 산업안전보건법 분야에서 축적된 깊은 전문성으로 최적의 솔루션을 제공합니다.", iconName: "Shield" },
  { title: "원스톱 서비스", desc: "예방관리계획서부터 영업허가까지, 화학안전 인허가의 모든 과정을 한 곳에서 해결할 수 있습니다.", iconName: "Award" },
  { title: "높은 적합 판정률", desc: "철저한 사전 검토와 현장 점검으로 한 번에 적합 판정을 받을 수 있도록 지원합니다.", iconName: "Target" },
  { title: "맞춤형 컨설팅", desc: "사업장 규모와 취급 물질에 따른 맞춤형 컨설팅으로 불필요한 비용을 절감합니다.", iconName: "Users" },
  { title: "신속한 대응", desc: "법규 개정 및 긴급 상황에 신속하게 대응하여 사업 운영에 차질이 없도록 합니다.", iconName: "Zap" },
  { title: "전국 서비스", desc: "부산, 울산, 경남을 중심으로 전국 어디서나 현장 방문 컨설팅을 제공합니다.", iconName: "MapPin" },
];

const DEFAULT_ABOUT_ITEMS = [
  "화학사고예방관리계획서 작성 및 제출 대행",
  "취급시설 설치·정기·수시검사 수검 지원",
  "유해화학물질 영업허가 취득 전 과정 대행",
  "공정안전보고서(PSM) 작성 및 심사 대응",
  "유해위험방지계획서 작성 및 현장 확인 대응",
];

const DEFAULT_STATS = [
  { end: 20, suffix: "+", label: "년 전문 경력" },
  { end: 500, suffix: "+", label: "건 프로젝트 수행" },
  { end: 300, suffix: "+", label: "개 고객사" },
  { end: 99, suffix: "%", label: "고객 만족도" },
];

export default function Home() {
  const [phone, setPhone] = useState("051-714-4100");
  const [allServices, setAllServices] = useState<any[]>([]);
  const [homePage, setHomePage] = useState<any>(null);

  useEffect(() => {
    getCompanyInfo().then((d: any) => { if (d?.phone) setPhone(d.phone); }).catch(() => {});
    getAllServices().then((d: any[]) => { if (d?.length) setAllServices(d); }).catch(() => {});
    getHomePage().then((d: any) => { if (d) setHomePage(d); }).catch(() => {});
  }, []);

  // Hero
  const heroSlogan = homePage?.heroSlogan || "화학사고 예방을 최선으로,";
  const heroSloganGold = homePage?.heroSloganGold || "내 회사처럼";
  const heroSloganSuffix = homePage?.heroSloganSuffix || " 일하는 파트너";
  const heroSubtitle = homePage?.heroSubtitle || "화학물질관리법 · 산업안전보건법 전문 컨설팅";
  const heroCta1 = homePage?.heroCta1 || "무료 상담 신청";
  const heroCta2 = homePage?.heroCta2 || phone;

  // About
  const aboutTitle = homePage?.aboutTitle || "20년 이상의 EHS 전문 경력,";
  const aboutTitleSub = homePage?.aboutTitleSub || "신뢰할 수 있는 파트너";
  const aboutBody = homePage?.aboutBody || "화학물질관리기술은 화학물질관리법과 산업안전보건법에 근거한 각종 인허가 및 안전 컨설팅을 전문으로 수행하는 기업입니다. 신규 화학물질 취급 공장 설립부터 기존 사업장의 설비 변경까지, 기업이 필요로 하는 모든 화학안전 서비스를 제공합니다.";
  const aboutItems: string[] = homePage?.aboutItems?.map((i: any) => i.text || i) || DEFAULT_ABOUT_ITEMS;
  const aboutCta = homePage?.aboutCta || "상담 문의하기";

  // Stats
  const stats = homePage?.stats?.length
    ? homePage.stats.map((s: any) => ({ end: s.end ?? s.value ?? 20, suffix: s.suffix ?? "+", label: s.label ?? "" }))
    : DEFAULT_STATS;

  // Services section
  const servicesSectionTitle = homePage?.servicesSectionTitle || "5대 핵심 서비스";
  const servicesSectionDesc = homePage?.servicesSectionDesc || "화학물질관리법과 산업안전보건법에 근거한 전문 컨설팅으로 귀사의 법적 의무 이행을 완벽하게 지원합니다.";

  // Why Choose Us
  const whyTitle = homePage?.whyTitle || "화학물질관리기술을 선택하는 이유";
  const whyChooseData = homePage?.whyChooseItems?.length
    ? homePage.whyChooseItems.map((i: any) => ({ title: i.title, desc: i.desc, iconName: i.iconName || "Shield" }))
    : DEFAULT_WHY_CHOOSE;

  // CTA
  const ctaTitle = homePage?.ctaTitle || "화학안전 인허가, 전문가에게 맡기세요";
  const ctaDesc = homePage?.ctaDesc || "복잡한 법규와 절차, 화학물질관리기술이 함께합니다.\n무료 상담을 통해 귀사에 필요한 서비스를 확인하세요.";
  const ctaCta1 = homePage?.ctaCta1 || "무료 상담 신청";

  // Contact
  const contactTitle = homePage?.contactTitle || "상담 신청";
  const contactDesc = homePage?.contactDesc || "화학안전 인허가에 관한 궁금한 점이 있으시면 언제든지 문의해 주세요. 전문 컨설턴트가 빠르게 답변 드리겠습니다.";

  // Services list (fallback to serviceData if Sanity empty)
  const displayServices = allServices.length > 0 ? allServices : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section — enlarged slogan + bigger CTA */}
      <section className="relative min-h-[540px] sm:min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.hero})` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/55 to-[#000000]/25" />

        <div className="relative container py-20 sm:py-24 lg:py-28">
          {/* Slogan — bigger, bolder */}
          <h1 className="text-[2rem] sm:text-4xl lg:text-[3.2rem] xl:text-[3.8rem] font-extrabold text-white leading-[1.2] mb-6 lg:mb-8 max-w-3xl drop-shadow-xl">
            {heroSlogan}
            <br />
            <span className="text-gold">{heroSloganGold}</span>{heroSloganSuffix}
          </h1>

          {/* Thin gold divider */}
          <div className="w-20 h-[3px] bg-gold mb-7 lg:mb-9" />

          <p className="text-white/70 text-base sm:text-lg lg:text-xl max-w-2xl mb-8 lg:mb-10 leading-relaxed">
            {heroSubtitle}
          </p>

          {/* CTA buttons — significantly enlarged */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
            <Link href="/contact">
              <Button className="bg-gold hover:bg-gold-dark text-[#000000] font-extrabold px-10 sm:px-12 py-4 sm:py-5 rounded-sm text-base sm:text-lg lg:text-xl shadow-xl hover:shadow-2xl transition-all">
                {heroCta1}
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-3" />
              </Button>
            </Link>
            <a href={`tel:${phone}`}>
              <Button
                variant="outline"
                className="border-2 border-white/40 text-white hover:bg-white/10 px-10 sm:px-12 py-4 sm:py-5 rounded-sm text-base sm:text-lg lg:text-xl bg-transparent font-bold shadow-lg"
              >
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                {phone}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* About / Experience Section — TEXT ONLY (meeting photo removed) */}
      <section className="section-padding bg-white">
        <div className="container">
          <FadeInSection>
            <div className="max-w-3xl">
              <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-4 font-sans">
                About Us
              </p>
              <h2 className="text-2xl lg:text-4xl font-bold text-navy mb-6 leading-tight">
                {aboutTitle}
                <br />
                {aboutTitleSub}
              </h2>
              <div className="gold-line mb-8" />
              <p className="text-foreground/80 text-base leading-relaxed mb-6">
                {aboutBody}
              </p>
              <ul className="space-y-3 mb-8">
                {aboutItems.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact">
                <Button className="bg-navy hover:bg-navy-light text-white px-8 py-3 rounded-sm">
                  {aboutCta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat: { end: number; suffix: string; label: string }, i: number) => (
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
                {servicesSectionTitle}
              </h2>
              <div className="gold-line mx-auto mb-6" />
              <p className="text-foreground/70 text-base leading-relaxed">
                {servicesSectionDesc}
              </p>
            </div>
          </FadeInSection>

          <div className="space-y-6">
            {displayServices.map((s: any, i: number) => {
              const Icon = ICON_MAP[s.iconName] || Shield;
              return (
                <FadeInSection key={s._id || s.id || i} delay={i * 100}>
                  <Link href={`/service/${s.slug?.current || s.slug}`}>
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
                                {(s.overview || "").substring(0, 120)}...
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
                {whyTitle}
              </h2>
              <div className="gold-line mx-auto" />
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseData.map((item: { title: string; desc: string; iconName: string }, i: number) => {
              const Icon = ICON_MAP[item.iconName] || Shield;
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

      {/* CTA Section — link goes to /contact (page top) */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.ctaBackground})` }}
        />
        <div className="absolute inset-0 bg-navy/85" />
        <div className="relative container text-center">
          <FadeInSection>
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-6">
              {ctaTitle}
            </h2>
            <p className="text-white/70 text-base lg:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              {ctaDesc.split("\n").map((line: string, i: number) => (
                <span key={i}>{line}{i < ctaDesc.split("\n").length - 1 && <br />}</span>
              ))}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-gold hover:bg-gold-dark text-navy font-bold px-10 py-4 rounded-sm text-base sm:text-lg shadow-xl">
                  {ctaCta1}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href={`tel:${phone}`}>
                <Button
                  variant="outline"
                  className="border-2 border-white/40 text-white hover:bg-white/10 px-10 py-4 rounded-sm text-base sm:text-lg bg-transparent"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {phone}
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
                  {contactTitle}
                </h2>
                <div className="gold-line mb-8" />
                <p className="text-foreground/70 text-base leading-relaxed mb-8">
                  {contactDesc}
                </p>
                <div className="space-y-4">
                  <a
                    href={`tel:${phone}`}
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
                        {phone}
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
