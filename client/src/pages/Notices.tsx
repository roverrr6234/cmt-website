/**
 * 알림마당 (공지사항) 페이지
 * Design: Deep Navy & White 테마 유지
 * Features: 리스트형 게시판, 상단 고정(Pin) 게시물, 페이지네이션
 * Note: 정적 데모 데이터 사용 (추후 Sanity CMS 연동 가능)
 */

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, Pin, ChevronLeft, ChevronRight, Calendar, Eye } from "lucide-react";

interface NoticeItem {
  id: number;
  title: string;
  date: string;
  views: number;
  isPinned: boolean;
  category: "법령개정" | "공지사항" | "업계동향";
  excerpt: string;
}

const NOTICES: NoticeItem[] = [
  {
    id: 1,
    title: "화학물질관리법 시행규칙 일부개정령(안) 입법예고",
    date: "2026-04-15",
    views: 342,
    isPinned: true,
    category: "법령개정",
    excerpt: "환경부에서 화학물질관리법 시행규칙 일부개정령(안)을 입법예고하였습니다. 주요 개정 내용은 유해화학물질 취급시설의 검사기준 강화 및 안전진단 주기 조정입니다.",
  },
  {
    id: 2,
    title: "산업안전보건법 시행령 개정안 공포 (2026.3.1 시행)",
    date: "2026-03-28",
    views: 287,
    isPinned: true,
    category: "법령개정",
    excerpt: "공정안전보고서(PSM) 대상 물질 규정량 조정 및 이행상태 평가 기준 변경 사항이 포함된 산업안전보건법 시행령 개정안이 공포되었습니다.",
  },
  {
    id: 3,
    title: "2026년 상반기 무료 컨설팅 상담 안내",
    date: "2026-03-15",
    views: 456,
    isPinned: true,
    category: "공지사항",
    excerpt: "화학물질관리기술에서 2026년 상반기 무료 컨설팅 상담을 진행합니다. 화학사고예방관리계획서, 설치검사, PSM 등 전 분야 상담이 가능합니다.",
  },
  {
    id: 4,
    title: "유해화학물질 취급시설 정기검사 주기 변경 안내",
    date: "2026-03-10",
    views: 198,
    isPinned: false,
    category: "법령개정",
    excerpt: "2026년 4월부터 1군 '가' 위험도 사업장의 정기검사 주기가 변경됩니다. 해당 사업장은 사전에 검사 일정을 확인하시기 바랍니다.",
  },
  {
    id: 5,
    title: "화학사고예방관리계획서 온라인 제출 시스템 개편",
    date: "2026-02-28",
    views: 167,
    isPinned: false,
    category: "공지사항",
    excerpt: "화학물질안전원의 온라인 제출 시스템이 개편되었습니다. 새로운 시스템 사용법 및 주의사항을 안내드립니다.",
  },
  {
    id: 6,
    title: "PSM 이행상태 평가 등급 관리 강화 동향",
    date: "2026-02-20",
    views: 234,
    isPinned: false,
    category: "업계동향",
    excerpt: "고용노동부에서 PSM 이행상태 평가 등급 관리를 강화하는 방향으로 정책을 추진하고 있습니다. C등급 사업장에 대한 특별 관리 방안이 논의 중입니다.",
  },
  {
    id: 7,
    title: "유해위험방지계획서 심사 수수료 조정 안내",
    date: "2026-02-15",
    views: 145,
    isPinned: false,
    category: "공지사항",
    excerpt: "한국산업안전보건공단에서 유해위험방지계획서 심사 수수료를 조정하였습니다. 2026년 3월 1일부터 적용됩니다.",
  },
  {
    id: 8,
    title: "화학물질 영업허가 갱신 절차 간소화 추진",
    date: "2026-02-05",
    views: 189,
    isPinned: false,
    category: "업계동향",
    excerpt: "환경부에서 유해화학물질 영업허가 갱신 절차를 간소화하는 방안을 추진하고 있습니다. 서류 제출 항목 축소 및 온라인 처리 확대가 예상됩니다.",
  },
  {
    id: 9,
    title: "2025년 화학사고 통계 및 주요 사고 사례 분석",
    date: "2026-01-25",
    views: 312,
    isPinned: false,
    category: "업계동향",
    excerpt: "2025년 한 해 동안 발생한 화학사고 통계와 주요 사고 사례를 분석하였습니다. 사고 예방을 위한 시사점을 공유합니다.",
  },
  {
    id: 10,
    title: "설 연휴 기간 긴급 상담 안내",
    date: "2026-01-20",
    views: 98,
    isPinned: false,
    category: "공지사항",
    excerpt: "설 연휴 기간(1/27~1/30) 중 긴급 상담이 필요하신 경우 대표번호(051-412-7707)로 연락 주시기 바랍니다.",
  },
  {
    id: 11,
    title: "화학물질안전원 안전교육 일정 안내 (2026년 1분기)",
    date: "2026-01-10",
    views: 176,
    isPinned: false,
    category: "공지사항",
    excerpt: "화학물질안전원에서 실시하는 2026년 1분기 안전교육 일정을 안내드립니다. 유해화학물질 취급자 및 관리자 대상 교육입니다.",
  },
  {
    id: 12,
    title: "인화성 가스 규정량 개정 시행 (도시가스 관련)",
    date: "2025-12-28",
    views: 267,
    isPinned: false,
    category: "법령개정",
    excerpt: "인화성 가스 중 도시가스(메탄 중량 85% 이상)의 PSM 대상 규정량이 취급 5,000kg에서 50,000kg으로 개정 시행됩니다.",
  },
];

const ITEMS_PER_PAGE = 10;

const categoryColors: Record<string, string> = {
  "법령개정": "bg-red-100 text-red-800 border-red-200",
  "공지사항": "bg-blue-100 text-blue-800 border-blue-200",
  "업계동향": "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export default function Notices() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categories = ["전체", "법령개정", "공지사항", "업계동향"];

  const filteredNotices = useMemo(() => {
    if (selectedCategory === "전체") return NOTICES;
    return NOTICES.filter((n) => n.category === selectedCategory);
  }, [selectedCategory]);

  const pinnedNotices = useMemo(
    () => filteredNotices.filter((n) => n.isPinned),
    [filteredNotices]
  );
  const regularNotices = useMemo(
    () => filteredNotices.filter((n) => !n.isPinned),
    [filteredNotices]
  );

  const totalPages = Math.max(1, Math.ceil(regularNotices.length / ITEMS_PER_PAGE));
  const pagedRegular = regularNotices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const allDisplayed = [...pinnedNotices, ...pagedRegular];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero Banner */}
      <section className="bg-[#0a1628] pt-28 pb-14 lg:pt-32 lg:pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
            알림마당
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            법령 개정, 공지사항, 업계 동향 등 화학물질 관리에 필요한 최신 정보를 안내합니다.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
                setExpandedId(null);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                selectedCategory === cat
                  ? "bg-[#0a1628] text-white border-[#0a1628]"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-500">
            총 {filteredNotices.length}건
          </span>
        </div>

        {/* Notice List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_120px_80px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-500">
            <span>제목</span>
            <span className="text-center">등록일</span>
            <span className="text-center">조회</span>
          </div>

          {/* Pinned + Regular Items */}
          {allDisplayed.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>등록된 게시물이 없습니다.</p>
            </div>
          ) : (
            allDisplayed.map((notice) => (
              <div key={notice.id}>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === notice.id ? null : notice.id)
                  }
                  className={`w-full text-left grid grid-cols-1 md:grid-cols-[1fr_120px_80px] gap-1 md:gap-4 px-6 py-4 border-b border-gray-100 hover:bg-blue-50/40 transition-colors ${
                    notice.isPinned ? "bg-amber-50/60" : ""
                  }`}
                >
                  {/* Title */}
                  <div className="flex items-start gap-2">
                    {notice.isPinned && (
                      <Pin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0 fill-amber-500" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded border ${
                            categoryColors[notice.category] || ""
                          }`}
                        >
                          {notice.category}
                        </span>
                        <span
                          className={`text-sm md:text-base leading-snug ${
                            notice.isPinned
                              ? "font-bold text-[#0a1628]"
                              : "font-medium text-gray-800"
                          }`}
                        >
                          {notice.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-xs md:text-sm text-gray-400 md:justify-center mt-1 md:mt-0 ml-6 md:ml-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{notice.date}</span>
                  </div>

                  {/* Views */}
                  <div className="hidden md:flex items-center gap-1 text-sm text-gray-400 justify-center">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{notice.views}</span>
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedId === notice.id && (
                  <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {notice.excerpt}
                    </p>
                    <p className="text-xs text-gray-400 mt-3">
                      ※ 자세한 내용은 전화 상담(051-412-7707)을 통해 문의해 주세요.
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#0a1628] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
