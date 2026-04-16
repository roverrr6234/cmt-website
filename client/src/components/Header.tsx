/*
 * Design: "Authoritative Counsel" — Deep Navy top bar with gold accents
 * Sticky header with phone number prominently displayed
 * Mobile hamburger menu with dropdown for 5 services
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { companyInfo, services } from "@/lib/serviceData";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serviceDropdown, setServiceDropdown] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServiceDropdown(false);
  }, [location]);

  return (
    <>
      {/* Top bar - Phone */}
      <div className="bg-navy text-white">
        <div className="container flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <span>부산, 울산, 경남 포함 전국 화학안전 컨설팅</span>
          </div>
          <a
            href={`tel:${companyInfo.phone}`}
            className="flex items-center gap-2 font-bold text-gold text-lg tracking-wide hover:text-gold-light transition-colors"
          >
            <Phone className="w-4 h-4" />
            {companyInfo.phone}
          </a>
        </div>
      </div>

      {/* Main nav */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="container flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-navy rounded-sm flex items-center justify-center">
              <span className="text-gold font-bold text-lg lg:text-xl font-serif">
                CKT
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-navy font-bold text-base lg:text-lg leading-tight font-serif">
                화학물질관리기술
              </p>
              <p className="text-steel text-xs">Chemical Management Technology</p>
            </div>
          </Link>

          {/* Desktop phone - large */}
          <a
            href={`tel:${companyInfo.phone}`}
            className="hidden lg:flex items-center gap-2 text-navy font-bold text-xl mr-8 hover:text-gold transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center">
              <Phone className="w-5 h-5 text-gold" />
            </div>
            {companyInfo.phone}
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium transition-colors hover:text-gold ${
                location === "/" ? "text-gold" : "text-navy"
              }`}
            >
              홈
            </Link>

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServiceDropdown(true)}
              onMouseLeave={() => setServiceDropdown(false)}
            >
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors hover:text-gold flex items-center gap-1 ${
                  location.startsWith("/service") ? "text-gold" : "text-navy"
                }`}
              >
                주요 업무
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    serviceDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {serviceDropdown && (
                <div className="absolute top-full left-0 w-72 bg-white border border-border rounded-sm shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {services.map((s) => (
                    <Link
                      key={s.id}
                      href={`/service/${s.slug}`}
                      className="block px-5 py-3 text-sm text-foreground hover:bg-warm-gray hover:text-navy transition-colors border-l-2 border-transparent hover:border-gold"
                    >
                      <span className="font-medium">{s.title}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {s.law} {s.lawArticle}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className={`px-4 py-2 text-sm font-medium transition-colors hover:text-gold ${
                location === "/blog" ? "text-gold" : "text-navy"
              }`}
            >
              블로그
            </Link>

            <Link
              href="/contact"
              className="ml-4 px-6 py-2.5 bg-navy text-white text-sm font-medium rounded-sm hover:bg-navy-light transition-colors"
            >
              상담 신청
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-navy"
            aria-label="메뉴"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-white animate-in slide-in-from-top-2 duration-200">
            <div className="container py-4 space-y-1">
              <Link
                href="/"
                className="block px-4 py-3 text-sm font-medium text-navy hover:bg-warm-gray rounded-sm"
              >
                홈
              </Link>

              <div>
                <button
                  onClick={() => setServiceDropdown(!serviceDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-navy hover:bg-warm-gray rounded-sm"
                >
                  주요 업무
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      serviceDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {serviceDropdown && (
                  <div className="ml-4 space-y-1 mt-1">
                    {services.map((s) => (
                      <Link
                        key={s.id}
                        href={`/service/${s.slug}`}
                        className="block px-4 py-2.5 text-sm text-foreground hover:bg-warm-gray rounded-sm border-l-2 border-gold/30 hover:border-gold"
                      >
                        {s.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/blog"
                className="block px-4 py-3 text-sm font-medium text-navy hover:bg-warm-gray rounded-sm"
              >
                블로그
              </Link>

              <div className="pt-3 border-t border-border mt-3">
                <a
                  href={`tel:${companyInfo.phone}`}
                  className="flex items-center gap-3 px-4 py-3 text-navy font-bold text-lg"
                >
                  <Phone className="w-5 h-5 text-gold" />
                  {companyInfo.phone}
                </a>
                <Link
                  href="/contact"
                  className="block mx-4 mt-2 px-6 py-3 bg-navy text-white text-sm font-medium rounded-sm text-center"
                >
                  무료 상담 신청
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
