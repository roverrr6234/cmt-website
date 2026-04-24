/**
 * 알림마당 (공지사항) 페이지
 * Design: Deep Navy & White 테마 유지
 * Features: Sanity CMS 연동, 리스트형 게시판, 상단 고정(Pin), Portable Text 본문, 페이지네이션
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PortableText } from "@portabletext/react";
import DOMPurify from "dompurify";
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
    publishedAt: "2026-04-20T00:00:00Z",
    excerpt: "환경부에서 화학물질관리법 시행규칙 일부개정령(안)을 입법예고합니다.",
    body: [
      {
        _type: "block",
        _key: "key1",
        style: "normal",
        text: "자세한 내용은 환경부 공식 홈페이지를 참고해 주세요.",
        marks: [],
      },
    ],
  },
  {
    _id: "fallback-2",
    title: "2026년 상반기 화학물질 안전관리 교육 개최",
    category: "공지사항",
    isPinned: false,
    publishedAt: "2026-04-18T00:00:00Z",
    excerpt: "화학물질 안전관리에 대한 전문 교육을 개최합니다.",
    body: [
      {
        _type: "block",
        _key: "key2",
        style: "normal",
        text: "참가 신청은 선착순으로 진행됩니다.",
        marks: [],
      },
    ],
  },
];

const categories = ["전체", "법령개정", "공지사항", "업계동향"];

export default function Notices() {
  const [notices, setNotices] = useState<SanityNotice[]>(FALLBACK_NOTICES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sanityClient.fetch(NOTICES_QUERY);
      setNotices(data || FALLBACK_NOTICES);
      setUseFallback(false);
    } catch (err: any) {
      // 프로덕션 환경에서는 에러 로깅 미수행
      if (process.env.NODE_ENV !== 'production') {
        console.error("Sanity fetch error:", err);
      }
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
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}

        {/* Notices List */}
        {!loading && allDisplayed.length > 0 && (
          <div className="space-y-3">
            {allDisplayed.map((notice) => (
              <div
                key={notice._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === notice._id ? null : notice._id)
                  }
                  className="w-full px-6 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      {notice.isPinned && (
                        <Pin className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded border ${
                          categoryColors[notice.category]
                        }`}
                      >
                        {notice.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[#0a1628] text-left">
                      {DOMPurify.sanitize(notice.title, { ALLOWED_TAGS: [] })}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(notice.publishedAt)}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                      expandedId === notice._id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Expanded Content */}
                {expandedId === notice._id && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm text-gray-700 mb-4">{DOMPurify.sanitize(notice.excerpt, { ALLOWED_TAGS: [] })}</p>

                    {notice.body && (
                      <div className="prose prose-sm max-w-none mb-4">
                        <PortableText
                          value={notice.body}
                          components={portableTextComponents}
                        />
                      </div>
                    )}

                    {notice.attachments && notice.attachments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          첨부파일
                        </p>
                        <div className="space-y-2">
                          {notice.attachments.map((att) => (
                            <a
                              key={att._key}
                              href={sanityFileUrl(att.asset._ref)}
                              download
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                              <Download className="w-4 h-4" />
                              {att.description || "파일 다운로드"}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && allDisplayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <FileText className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500">공지사항이 없습니다.</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-[#0a1628] text-white"
                      : "bg-white border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
