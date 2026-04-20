/**
 * 알림마당 (공지사항) 페이지
 * Design: Deep Navy & White 테마 유지
 * Features: Sanity CMS 연동, 리스트형 게시판, 상단 고정(Pin), Portable Text 본문, 페이지네이션
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PortableText } from "@portabletext/react";
import {
  FileText,
  Pin,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2,
  AlertCircle,
  Download,
  RefreshCw,
  ChevronDown,
  Rss,
} from "lucide-react";
import {
  sanityClient,
  sanityImageUrl,
  sanityFileUrl,
  NOTICES_QUERY,
  type SanityNotice,
} from "@/lib/sanity";

const ITEMS_PER_PAGE = 10;

const categoryColors: Record<string, string> = {
  법령개정: "bg-red-100 text-red-800 border-red-200",
  공지사항: "bg-blue-100 text-blue-800 border-blue-200",
  업계동향: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

/** Portable Text 커스텀 컴포넌트 */
const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      const url = sanityImageUrl(value.asset._ref, 800);
      return (
        <figure className="my-4">
          <img
            src={url}
            alt={value.alt || ""}
            className="rounded-lg max-w-full h-auto border border-gray-200"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="text-xs text-gray-500 mt-2 text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-lg font-bold text-[#0a1628] mt-5 mb-2">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-base font-semibold text-[#0a1628] mt-4 mb-2">{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[#0a1628] pl-4 py-2 my-3 bg-gray-50 text-gray-700 italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p className="text-sm text-gray-700 leading-relaxed mb-2">{children}</p>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        {children}
      </a>
    ),
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    underline: ({ children }: any) => <span className="underline">{children}</span>,
  },
};

/** 정적 폴백 데이터 (Sanity 연결 실패 시) */
const FALLBACK_NOTICES: SanityNotice[] = [
  {
    _id: "fallback-1",
    title: "화학물질관리법 시행규칙 일부개정령(안) 입법예고",
    category: "법령개정",
    isPinned: true,
    publishedAt: "2026-04-15T00:00:00Z",
    excerpt:
      "환경부에서 화학물질관리법 시행규칙 일부개정령(안)을 입법예고하였습니다. 주요 개정 내용은 유해화학물질 취급시설의 검사기준 강화 및 안전진단 주기 조정입니다.",
  },
  {
    _id: "fallback-2",
    title: "산업안전보건법 시행령 개정안 공포 (2026.3.1 시행)",
    category: "법령개정",
    isPinned: true,
    publishedAt: "2026-03-28T00:00:00Z",
    excerpt:
      "공정안전보고서(PSM) 대상 물질 규정량 조정 및 이행상태 평가 기준 변경 사항이 포함된 산업안전보건법 시행령 개정안이 공포되었습니다.",
  },
  {
    _id: "fallback-3",
    title: "2026년 상반기 무료 컨설팅 상담 안내",
    category: "공지사항",
    isPinned: true,
    publishedAt: "2026-03-15T00:00:00Z",
    excerpt:
      "화학물질관리기술에서 2026년 상반기 무료 컨설팅 상담을 진행합니다. 화학사고예방관리계획서, 설치검사, PSM 등 전 분야 상담이 가능합니다.",
  },
];

export default function Notices() {
  const [notices, setNotices] = useState<SanityNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ["전체", "법령개정", "공지사항", "업계동향"];

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUseFallback(false);
    try {
      const data = await sanityClient.fetch<SanityNotice[]>(NOTICES_QUERY);
      if (data && data.length > 0) {
        setNotices(data);
      } else {
        // Sanity에 데이터가 없으면 폴백
        setNotices(FALLBACK_NOTICES);
        setUseFallback(true);
      }
    } catch (err: any) {
      console.error("Sanity fetch error:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      setNotices(FALLBACK_NOTICES);
      setUseFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const filteredNotices = useMemo(() => {
    if (selectedCategory === "전체") return notices;
    return notices.filter((n) => n.category === selectedCategory);
  }, [selectedCategory, notices]);

  const pinnedNotices = useMemo(
    () => filteredNotices.filter((n) => n.isPinned),
    [filteredNotices]
  );
  const regularNotices = useMemo(
    () => filteredNotices.filter((n) => !n.isPinned),
    [filteredNotices]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(regularNotices.length / ITEMS_PER_PAGE)
  );
  const pagedRegular = regularNotices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const allDisplayed = [...pinnedNotices, ...pagedRegular];

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

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
            법령 개정, 공지사항, 업계 동향 등 화학물질 관리에 필요한 최신 정보를
            안내합니다.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        {/* Error Banner */}
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error} (캐시된 데이터를 표시합니다)</span>
            <button
              onClick={fetchNotices}
              className="ml-auto flex items-center gap-1 text-amber-700 hover:text-amber-900 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              재시도
            </button>
          </div>
        )}

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
          <span className="ml-auto text-sm text-gray-500 flex items-center gap-3">
            <span>
              총 {filteredNotices.length}건
              {useFallback && (
                <span className="text-amber-600 ml-1">(오프라인)</span>
              )}
            </span>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium transition-colors"
              title="RSS 피드 구독"
            >
              <Rss className="w-4 h-4" />
              <span className="text-xs">RSS</span>
            </a>
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#0a1628] animate-spin mb-3" />
            <p className="text-gray-500 text-sm">게시물을 불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* Notice List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-[1fr_120px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-500">
                <span>제목</span>
                <span className="text-center">등록일</span>
              </div>

              {/* Pinned + Regular Items */}
              {allDisplayed.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>등록된 게시물이 없습니다.</p>
                </div>
              ) : (
                allDisplayed.map((notice) => (
                  <div key={notice._id}>
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === notice._id ? null : notice._id
                        )
                      }
                      className={`w-full text-left grid grid-cols-1 md:grid-cols-[1fr_120px] gap-1 md:gap-4 px-6 py-4 border-b border-gray-100 hover:bg-blue-50/40 transition-colors ${
                        notice.isPinned ? "bg-amber-50/60" : ""
                      }`}
                    >
                      {/* Title */}
                      <div className="flex items-start gap-2">
                        {notice.isPinned && (
                          <Pin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0 fill-amber-500" />
                        )}
                        <div className="min-w-0 flex-1">
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
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${
                            expandedId === notice._id ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-1 text-xs md:text-sm text-gray-400 md:justify-center mt-1 md:mt-0 ml-6 md:ml-0">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(notice.publishedAt)}</span>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {expandedId === notice._id && (
                      <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
                        {/* Portable Text 본문 (있으면 표시) */}
                        {notice.body && notice.body.length > 0 ? (
                          <div className="prose prose-sm max-w-none">
                            <PortableText
                              value={notice.body}
                              components={portableTextComponents}
                            />
                          </div>
                        ) : (
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {notice.excerpt}
                          </p>
                        )}

                        {/* 첨부파일 */}
                        {notice.attachments &&
                          notice.attachments.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-gray-200">
                              <p className="text-xs font-semibold text-gray-500 mb-2">
                                첨부파일
                              </p>
                              <div className="flex flex-col gap-1">
                                {notice.attachments.map((file) => (
                                  <a
                                    key={file._key}
                                    href={sanityFileUrl(file.asset._ref)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    {file.description || "첨부파일 다운로드"}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                        <p className="text-xs text-gray-400 mt-3">
                          ※ 자세한 내용은 전화 상담(051-412-7707)을 통해 문의해
                          주세요.
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Sanity Studio 관리자 안내 (개발 모드에서만 표시) */}
        {import.meta.env.DEV && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p className="font-semibold mb-1">관리자 안내</p>
            <p>
              게시물 작성/수정/삭제는{" "}
              <a
                href="https://ckt-notices.sanity.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                Sanity Studio (ckt-notices.sanity.studio)
              </a>
              에서 관리할 수 있습니다.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
