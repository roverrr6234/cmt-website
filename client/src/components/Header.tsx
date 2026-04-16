/*
 * Design: Single unified black header bar (#000000)
 * Left: Logo image + "Chemical Management Technology" text
 * Center-right: Phone number (051-412-7707)
 * Far right: Hamburger menu icon (always visible)
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { companyInfo, services } from "@/lib/serviceData";
import { images } from "@/lib/images";

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
      <header
        className={`sticky top-0 z-50 transition-all duration-300 bg-[#000000] ${
          isScrolled ? "shadow-xl" : "shadow-md"
        }`}
      >
        <div className="container flex items-center justify-between h-16 sm:h-[72px] lg:h-20">
          {/* Left: Logo + Business Name */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <img
              src={images.logo}
              alt="화학물질관리기술 로고"
              className="h-11 sm:h-[52px] lg:h-[60px] w-auto object-contain"
            />
            <div className="hidden sm:block leading-tight">
              <p className="text-white/90 text-xs lg:text-[13px] font-semibold tracking-wide">
                Chemical Management
              </p>
              <p className="text-white/90 text-xs lg:text-[13px] font-semibold tracking-wide">
                Technology
              </p>
            </div>
          </Link>

          {/* Center-Right: Phone Number */}
          <a
            href={`tel:${companyInfo.phone}`}
            className="flex items-center gap-2 sm:gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gold" />
            </div>
            <span className="text-white font-bold text-base sm:text-lg lg:text-xl tracking-wide font-sans">
              {companyInfo.phone}
            </span>
          </a>

          {/* Right: Hamburger Menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 sm:p-2.5 text-white hover:text-gold transition-colors ml-2 sm:ml-4"
            aria-label="메뉴"
          >
            {mobileOpen ? (
              <X className="w-6 h-6 sm:w-7 sm:h-7" />
            ) : (
              <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
            )}
          </button>
        </div>

        {/* Dropdown Menu */}
        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#0a0a0a] animate-in slide-in-from-top-2 duration-200">
            <div className="container py-4 space-y-1">
              <Link
                href="/"
                className={`block px-5 py-3 text-sm font-medium rounded-sm transition-colors ${
                  location === "/"
                    ? "text-gold bg-white/5"
                    : "text-white/80 hover:text-gold hover:bg-white/5"
                }`}
              >
                홈
              </Link>

              <div>
                <button
                  onClick={() => setServiceDropdown(!serviceDropdown)}
                  className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium rounded-sm transition-colors ${
                    location.startsWith("/service")
                      ? "text-gold bg-white/5"
                      : "text-white/80 hover:text-gold hover:bg-white/5"
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
                            ? "text-gold border-gold bg-white/5"
                            : "text-white/60 border-white/10 hover:text-gold hover:border-gold hover:bg-white/5"
                        }`}
                      >
                        {s.title}
                        <span className="block text-xs text-white/30 mt-0.5">
                          {s.law} {s.lawArticle}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/blog"
                className={`block px-5 py-3 text-sm font-medium rounded-sm transition-colors ${
                  location === "/blog"
                    ? "text-gold bg-white/5"
                    : "text-white/80 hover:text-gold hover:bg-white/5"
                }`}
              >
                블로그
              </Link>

              <Link
                href="/contact"
                className={`block px-5 py-3 text-sm font-medium rounded-sm transition-colors ${
                  location === "/contact"
                    ? "text-gold bg-white/5"
                    : "text-white/80 hover:text-gold hover:bg-white/5"
                }`}
              >
                상담 신청
              </Link>

              <div className="pt-3 mt-3 border-t border-white/10">
                <a
                  href={`tel:${companyInfo.phone}`}
                  className="flex items-center gap-3 px-5 py-3 text-gold font-bold text-lg"
                >
                  <Phone className="w-5 h-5" />
                  {companyInfo.phone}
                </a>
                <Link
                  href="/contact"
                  className="block mx-5 mt-2 px-6 py-3 bg-gold text-[#000000] text-sm font-bold rounded-sm text-center hover:bg-gold-light transition-colors"
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
