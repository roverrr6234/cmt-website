/*
 * Design: "Authoritative Counsel" — Dedicated contact page
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Phone, Mail, MapPin, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import StickyPhone from "@/components/StickyPhone";
import { Helmet } from "react-helmet-async";
import { getCompanyInfo } from "@/lib/sanity";

export default function Contact() {
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    getCompanyInfo()
      .then((info) => {
        if (info?.phone) setPhone(info.phone);
        if (info?.email) setEmail(info.email);
        if (info?.address) setAddress(info.address);
      })
      .catch(() => {
        setPhone("051-412-7707");
        setEmail("ckt9054@naver.com");
        setAddress("부산광역시 영도구 꿈나무길 261 (2층)");
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>무료 상담 신청 | 화학물질관리기술(CMT)</title>
        <meta name="description" content="화학안전 인허가 전문 컨설턴트에게 무료 상담을 신청하세요. 화학사고예방관리계획서, 설치검사, 영업허가, PSM 등 빠른 답변을 드립니다." />
        <link rel="canonical" href="https://www.cmtbusan.kr/contact" />
        <meta property="og:url" content="https://www.cmtbusan.kr/contact" />
        <meta property="og:title" content="무료 상담 신청 | 화학물질관리기술(CMT)" />
        <meta property="og:description" content="화학안전 인허가 전문 컨설턴트에게 무료 상담을 신청하세요." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "url": "https://www.cmtbusan.kr/contact",
          "name": "화학물질관리기술(CMT) 상담 신청",
          "mainEntity": {
            "@id": "https://www.cmtbusan.kr/#localbusiness"
          }
        })}</script>
      </Helmet>
      <Header />

      {/* Hero */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-gold transition-colors">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold">상담 신청</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            상담 신청
          </h1>
          <p className="text-white/60 text-base max-w-xl">
            화학안전 인허가에 관한 궁금한 점이 있으시면 언제든지 문의해 주세요.
            전문 컨설턴트가 빠르게 답변 드리겠습니다.
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
                연락처 정보
              </h2>
              <div className="gold-line mb-8" />

              <div className="space-y-6">
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-start gap-4 p-5 bg-warm-gray rounded-sm hover:bg-navy hover:text-white transition-all group"
                  >
                    <div className="w-12 h-12 bg-navy rounded-sm flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors">
                      <Phone className="w-5 h-5 text-gold group-hover:text-navy" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground group-hover:text-white/70 mb-1">
                        전화 상담
                      </p>
                      <p className="font-bold text-navy group-hover:text-white text-lg">
                        {phone}
                      </p>
                    </div>
                  </a>
                )}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-start gap-4 p-5 bg-warm-gray rounded-sm hover:bg-navy hover:text-white transition-all group"
                  >
                    <div className="w-12 h-12 bg-navy rounded-sm flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors">
                      <Mail className="w-5 h-5 text-gold group-hover:text-navy" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground group-hover:text-white/70 mb-1">
                        이메일
                      </p>
                      <p className="font-bold text-navy group-hover:text-white">
                        {email}
                      </p>
                    </div>
                  </a>
                )}

                <div className="flex items-start gap-4 p-5 bg-warm-gray rounded-sm">
                  <div className="w-12 h-12 bg-navy rounded-sm flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">주소</p>
                    <p className="font-bold text-navy">{address}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      부산, 울산, 경남 포함 전국 출장 서비스
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-warm-gray rounded-sm">
                  <div className="w-12 h-12 bg-navy rounded-sm flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">상담 시간</p>
                    <p className="font-bold text-navy">평일 09:00 - 18:00</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      긴급 건은 전화로 문의해 주세요
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-navy mb-6 font-serif">
                상담 신청서
              </h2>
              <div className="gold-line mb-8" />
              <p className="text-foreground/70 text-sm mb-8 leading-relaxed">
                아래 양식을 작성하시면{email && ` 이메일(${email})로`} 문의 내용이 전달됩니다.
                빠른 시일 내에 전문 컨설턴트가 연락드리겠습니다.
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
