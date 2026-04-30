/*
 * Design: "Authoritative Counsel" — Dedicated contact page
 * Sanity-with-fallback: contactPage + companyInfo 도큐먼트 사용.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Phone, Mail, MapPin, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import StickyPhone from "@/components/StickyPhone";
import { companyInfo as fallbackCompanyInfo } from "@/lib/serviceData";
import { getCompanyInfo, getContactPage } from "@/lib/sanity";

function pick<T>(v: T | null | undefined | "", fallback: T): T {
  return v !== null && v !== undefined && v !== "" ? v : fallback;
}

export default function Contact() {
  const [page, setPage] = useState<any | null>(null);
  const [phone, setPhone] = useState<string>(fallbackCompanyInfo.phone);
  const [email, setEmail] = useState<string>(fallbackCompanyInfo.email);
  const [address, setAddress] = useState<string>(fallbackCompanyInfo.address);

  useEffect(() => {
    Promise.all([getContactPage(), getCompanyInfo()])
      .then(([p, info]) => {
        setPage(p);
        if (info?.phone) setPhone(info.phone);
        if (info?.email) setEmail(info.email);
        if (info?.address) setAddress(info.address);
      })
      .catch(() => {
        // fallback 유지
      });
  }, []);

  const heroTitle = pick(page?.heroTitle, "상담 신청");
  const heroDescription = pick(
    page?.heroDescription,
    "화학안전 인허가에 관한 궁금한 점이 있으시면 언제든지 문의해 주세요. 전문 컨설턴트가 빠르게 답변 드리겠습니다.",
  );
  const breadcrumbCurrent = pick(page?.breadcrumbCurrent, "상담 신청");
  const infoSectionTitle = pick(page?.infoSectionTitle, "연락처 정보");
  const phoneLabel = pick(page?.phoneLabel, "전화 상담");
  const emailLabel = pick(page?.emailLabel, "이메일");
  const addressLabel = pick(page?.addressLabel, "주소");
  const addressNote = pick(page?.addressNote, "부산, 울산, 경남 포함 전국 출장 서비스");
  const hoursLabel = pick(page?.hoursLabel, "상담 시간");
  const hoursValue = pick(page?.hoursValue, "평일 09:00 - 18:00");
  const hoursNote = pick(page?.hoursNote, "긴급 건은 전화로 문의해 주세요");
  const formSectionTitle = pick(page?.formSectionTitle, "상담 신청서");
  const formGuideTemplate = pick(
    page?.formGuideText,
    "아래 양식을 작성하시면 이메일({email})로 문의 내용이 전달됩니다. 빠른 시일 내에 전문 컨설턴트가 연락드리겠습니다.",
  );
  const formGuideText = formGuideTemplate.replace("{email}", email);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-gold transition-colors">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold">{breadcrumbCurrent}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            {heroTitle}
          </h1>
          <p className="text-white/60 text-base max-w-xl whitespace-pre-line">
            {heroDescription}
          </p>
          <div className="gold-line mt-6" />
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-navy mb-6 font-serif">
                {infoSectionTitle}
              </h2>
              <div className="gold-line mb-8" />

              <div className="space-y-6">
                <a
                  href={`tel:${phone}`}
                  className="flex items-start gap-4 p-5 bg-warm-gray rounded-sm hover:bg-navy hover:text-white transition-all group"
                >
                  <div className="w-12 h-12 bg-navy rounded-sm flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors">
                    <Phone className="w-5 h-5 text-gold group-hover:text-navy" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground group-hover:text-white/70 mb-1">
                      {phoneLabel}
                    </p>
                    <p className="font-bold text-navy group-hover:text-white text-lg">
                      {phone}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-4 p-5 bg-warm-gray rounded-sm hover:bg-navy hover:text-white transition-all group"
                >
                  <div className="w-12 h-12 bg-navy rounded-sm flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors">
                    <Mail className="w-5 h-5 text-gold group-hover:text-navy" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground group-hover:text-white/70 mb-1">
                      {emailLabel}
                    </p>
                    <p className="font-bold text-navy group-hover:text-white">
                      {email}
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 bg-warm-gray rounded-sm">
                  <div className="w-12 h-12 bg-navy rounded-sm flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{addressLabel}</p>
                    <p className="font-bold text-navy">{address}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {addressNote}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-warm-gray rounded-sm">
                  <div className="w-12 h-12 bg-navy rounded-sm flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{hoursLabel}</p>
                    <p className="font-bold text-navy">{hoursValue}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {hoursNote}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-navy mb-6 font-serif">
                {formSectionTitle}
              </h2>
              <div className="gold-line mb-8" />
              <p className="text-foreground/70 text-sm mb-8 leading-relaxed whitespace-pre-line">
                {formGuideText}
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <StickyPhone />
    </div>
  );
}
