/**
 * 알림마당 (공지사항) 페이지
 * Design: Deep Navy & White 테마 유지
 * Features: Sanity CMS 연동, 리스트형 게시판, 상단 고정(Pin), Portable Text 본문, 페이지네이션
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import {
  FileText,
  Pin,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  Paperclip,
} from "lucide-react";
import { sanityClient, NOTICES_QUERY, type SanityNotice } from "@/lib/sanity";
import { categoryColor, formatNoticeDate, noticePath } from "@/lib/notice-ui";

const ITEMS_PER_PAGE = 10;

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

/** 기본 카테고리 순서 — 데이터에 존재하는 카테고리는 자동으로 추가된다 */
const BASE_CATEGORIES = ["공지사항", "법규 안내", "업무 안내", "법령개정", "업계동향", "기타"];

export default function Notices() {
  const [notices, setNotices] = useState<SanityNotice[]>(FALLBACK_NOTICES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);

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

  const categories = useMemo(() => {
    const present = new Set(notices.map((n) => n.category).filter(Boolean));
    const ordered = BASE_CATEGORIES.filter((c) => present.has(c));
    const extra = Array.from(present).filter((c) => !BASE_CATEGORIES.includes(c));
    return ["전체", ...ordered, ...extra];
  }, [notices]);

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>알림마당 | 화학물질관리기술(CMT)</title>
        <meta name="description" content="법령 개정, 공지사항, 업계 동향 등 화학물질 관리에 필요한 최신 정보를 안내합니다." />
        <link rel="canonical" href="https://www.cmtbusan.kr/notices" />
        <meta property="og:url" content="https://www.cmtbusan.kr/notices" />
        <meta property="og:title" content="알림마당 | 화학물질관리기술(CMT)" />
        <meta property="og:description" content="법령 개정, 공지사항, 업계 동향 등 화학물질 관리에 필요한 최신 정보를 안내합니다." />
      </Helmet>
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
              <Link
                key={notice._id}
                href={noticePath(notice._id)}
                className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-gray-300 transition-all"
              >
                <div className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {notice.isPinned && (
                        <Pin className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded border ${categoryColor(notice.category)}`}
                      >
                        {notice.category || "공지사항"}
                      </span>
                      {notice.attachments && notice.attachments.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Paperclip className="w-3.5 h-3.5" />
                          첨부 {notice.attachments.length}
                        </span>
                      )}
                    </div>
                    <h2 className="font-semibold text-[#0a1628] text-base leading-snug">
                      {DOMPurify.sanitize(notice.title, { ALLOWED_TAGS: [] })}
                    </h2>
                    {notice.excerpt && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {DOMPurify.sanitize(notice.excerpt, { ALLOWED_TAGS: [] })}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      <time dateTime={notice.publishedAt?.slice(0, 10)}>
                        {formatNoticeDate(notice.publishedAt)}
                      </time>
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                </div>
              </Link>
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
