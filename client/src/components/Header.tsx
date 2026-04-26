/*
 * Design: White header bar (#FFFFFF) with black/navy text
 * Left: Logo image + "Chemical Management Technology" text
 * Center: Phone number (051-412-7707)
 * Center-Right: 알림마당 button
 * Far right: Hamburger menu icon (always visible)
 * Below header: 5-service GNB navigation bar (fixed, standard names)
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Phone, Menu, X, ChevronDown, Bell } from "lucide-react";
import { companyInfo, services } from "@/lib/serviceData";
import { images } from "@/lib/images";

const BLOG_URL = "https://blog.naver.com/ckt9054";

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
      {/* ── Main Header Bar (White) ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 bg-white ${
          isScrolled ? "shadow-lg" : "shadow-sm"
        }`}
      >
        <div className="container flex items-center justify-between h-16 sm:h-[72px] lg:h-20">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <img
              src={images.logo}
              alt="화학물질관리기술 로고"
              className="h-11 sm:h-[52px] lg:h-[60px] w-auto object-contain"
            />
          </Link>

          {/* Center: Phone Number */}
          <a
            href={`tel:${companyInfo.phone}`}
            className="flex items-center gap-2 sm:gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gold" />
            </div>
            <span className="text-navy font-bold text-base sm:text-lg lg:text-xl tracking-wide font-sans">
              {companyInfo.phone}
            </span>
          </a>

          {/* Right group: 알림마당 + Hamburger */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* 알림마당 Button */}
            <Link
              href="/notices"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                location === "/notices" || location.startsWith("/notices")
                  ? "text-gold bg-navy/5"
                  : "text-navy/80 hover:text-gold hover:bg-navy/5"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>알림마당</span>
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 sm:p-2.5 text-navy hover:text-gold transition-colors"
              aria-label="메뉴"
            >
              {mobileOpen ? (
                <X className="w-6 h-6 sm:w-7 sm:h-7" />
              ) : (
                <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
              )}
            </button>
          </div>
        </div>

        {/* ── 5-Service GNB Bar (Standard Names) ── */}
        <div className="border-t border-gray-200 bg-white">
          <div className="container">
            <nav
              className="flex items-center gap-0 overflow-x-auto scrollbar-hide -mx-1"
              aria-label="5대 핵심 서비스"
            >
              {services.map((s, i) => {
                const isActive = location === `/service/${s.slug}`;
                return (
                  <Link
                    key={s.id}
                    href={`/service/${s.slug}`}
                    className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 lg:px-4 py-3 text-[11px] sm:text-[12px] lg:text-[13px] font-medium whitespace-nowrap transition-colors shrink-0 ${
                      isActive
                        ? "text-gold"
                        : "text-navy/70 hover:text-gold"
                    }`}
                  >
                    <span className="text-[9px] sm:text-[10px] font-bold text-gold/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{s.shortTitle}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ── Dropdown Menu (Hamburger) ── */}
        {mobileOpen && (
          <div className="border-t border-gray-200 bg-white animate-in slide-in-from-top-2 duration-200 shadow-xl">
            <div className="container py-4 space-y-1">
              <Link
                href="/"
                className={`block px-5 py-3 text-sm font-medium rounded-sm transition-colors ${
                  location === "/"
                    ? "text-gold bg-navy/5"
                    : "text-navy/80 hover:text-gold hover:bg-navy/5"
                }`}
              >
                홈
              </Link>

              <div>
                <button
                  onClick={() => setServiceDropdown(!serviceDropdown)}
                  className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium rounded-sm transition-colors ${
                    location.startsWith("/service")
                      ? "text-gold bg-navy/5"
                      : "text-navy/80 hover:text-gold hover:bg-navy/5"
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
                  <div className="ml-4 space-y-0.5 mt-1">
                    {services.map((s) => (
                      <Link
                        key={s.id}
                        href={`/service/${s.slug}`}
                        className={`block px-5 py-2.5 text-sm rounded-sm border-l-2 transition-colors ${
                          location === `/service/${s.slug}`
                            ? "text-gold border-gold bg-navy/5"
                            : "text-navy/60 border-gray-200 hover:text-gold hover:border-gold hover:bg-navy/5"
                        }`}
                      >
                        {s.shortTitle}
                        <span className="block text-xs text-navy/30 mt-0.5">
                          {s.law} {s.lawArticle}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/notices"
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-sm transition-colors ${
                  location.startsWith("/notices")
                    ? "text-gold bg-navy/5"
                    : "text-navy/80 hover:text-gold hover:bg-navy/5"
                }`}
              >
                <Bell className="w-4 h-4" />
                알림마당
              </Link>

              <a
                href={BLOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-5 py-3 text-sm font-medium rounded-sm transition-colors text-navy/80 hover:text-gold hover:bg-navy/5"
              >
                블로그
              </a>

              <Link
                href="/contact"
                className={`block px-5 py-3 text-sm font-medium rounded-sm transition-colors ${
                  location === "/contact"
                    ? "text-gold bg-navy/5"
                    : "text-navy/80 hover:text-gold hover:bg-navy/5"
                }`}
              >
                상담 신청
              </Link>

              <div className="pt-3 mt-3 border-t border-gray-200">
                <a
                  href={`tel:${companyInfo.phone}`}
                  className="flex items-center gap-3 px-5 py-3 text-gold font-bold text-lg"
                >
                  <Phone className="w-5 h-5" />
                  {companyInfo.phone}
                </a>
                <Link
                  href="/contact"
                  className="block mx-5 mt-2 px-6 py-3 bg-gold text-navy text-sm font-bold rounded-sm text-center hover:bg-gold-light transition-colors"
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
