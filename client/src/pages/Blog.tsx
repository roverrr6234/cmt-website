/*
 * Design: "Authoritative Counsel" — Blog listing page
 * Placeholder blog posts related to chemical safety
 */
import { Link } from "wouter";
import { ChevronRight, Calendar, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyPhone from "@/components/StickyPhone";
import { images } from "@/lib/images";

const blogPosts = [
  {
    id: 1,
    title: "2026년 화학물질관리법 주요 개정사항 안내",
    excerpt:
      "2026년 시행되는 화학물질관리법 개정안의 핵심 변경사항을 정리했습니다. 사업장에서 반드시 확인해야 할 사항들을 알려드립니다.",
    date: "2026.04.10",
    category: "법규 동향",
    image: images.serviceConsulting,
  },
  {
    id: 2,
    title: "화학사고예방관리계획서 작성 시 자주 하는 실수 5가지",
    excerpt:
      "화학사고예방관리계획서 심사에서 부적합 판정을 받는 주요 원인과 이를 예방하기 위한 체크리스트를 공유합니다.",
    date: "2026.03.25",
    category: "실무 가이드",
    image: images.serviceInspection,
  },
  {
    id: 3,
    title: "유해화학물질 설치검사 준비 가이드",
    excerpt:
      "설치검사를 앞둔 사업장을 위한 준비 가이드입니다. 검사 항목별 체크포인트와 자주 지적되는 부적합 사항을 정리했습니다.",
    date: "2026.03.15",
    category: "실무 가이드",
    image: images.aboutTeam,
  },
  {
    id: 4,
    title: "PSM 이행상태 평가 등급 관리 전략",
    excerpt:
      "공정안전보고서(PSM) 이행상태 평가에서 우수(P) 등급을 유지하기 위한 관리 전략과 실무 팁을 소개합니다.",
    date: "2026.02.28",
    category: "PSM",
    image: images.serviceConsulting,
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-gold transition-colors">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold">블로그</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            블로그
          </h1>
          <p className="text-white/60 text-base max-w-xl">
            화학안전 법규 동향, 실무 가이드, 컨설팅 사례를 공유합니다.
          </p>
          <div className="gold-line mt-6" />
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding bg-warm-gray">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-sm border border-border/50 overflow-hidden hover:shadow-xl hover:border-gold/30 transition-all duration-300 group"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-medium text-gold bg-gold/10 px-2.5 py-1 rounded-sm">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                  </div>
                  <h2 className="text-navy font-bold text-lg mb-3 font-serif group-hover:text-gold transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-foreground/70 text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <span className="flex items-center gap-1 text-sm text-gold font-medium group-hover:translate-x-1 transition-transform">
                    자세히 보기
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground text-sm">
              더 많은 콘텐츠가 곧 업데이트됩니다.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <StickyPhone />
    </div>
  );
}
