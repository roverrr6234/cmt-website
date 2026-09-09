/**
 * 알림마당 글 상세 페이지 — /notices/:id
 *
 * 목적: 알림마당 글마다 고유 URL을 부여해 검색엔진이 개별 글을 색인할 수 있게 한다.
 * - Helmet: 글별 title / description / canonical / OG
 * - JSON-LD: Article + BreadcrumbList
 * - 크롤러용 정적 HTML은 scripts/prerender.mjs 가 별도로 생성한다.
 */

import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { PortableText } from "@portabletext/react";
import DOMPurify from "dompurify";
import {
  ArrowLeft,
  Calendar,
  Download,
  Loader2,
  Pin,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getNoticeById, sanityFileUrl } from "@/lib/sanity";
import {
  SITE_URL,
  categoryColor,
  formatNoticeDate,
  noticePath,
  noticePortableTextComponents,
  portableTextToPlain,
} from "@/lib/notice-ui";

type NoticeDoc = {
  _id: string;
  title: string;
  category?: string;
  excerpt?: string;
  content?: any;
  publishedAt: string;
  isPinned?: boolean;
  attachments?: any[];
};

export default function NoticeDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id ? decodeURIComponent(params.id) : "";

  const [notice, setNotice] = useState<NoticeDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setNotice(null);

    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    getNoticeById(id)
      .then((doc) => {
        if (cancelled) return;
        if (doc && doc.title) setNotice(doc as NoticeDoc);
        else setNotFound(true);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const safeTitle = notice
    ? DOMPurify.sanitize(notice.title, { ALLOWED_TAGS: [] })
    : "알림마당";
  const description =
    (notice?.excerpt && DOMPurify.sanitize(notice.excerpt, { ALLOWED_TAGS: [] })) ||
    (notice ? portableTextToPlain(notice.content) : "") ||
    "화학물질관리기술(CMT) 알림마당 — 법령 개정, 공지사항, 업계 동향 안내";
  const pageUrl = `${SITE_URL}${noticePath(id)}`;
  const pageTitle = `${safeTitle} | 알림마당 | 화학물질관리기술(CMT)`;

  const jsonLd = notice
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: safeTitle,
            description,
            datePublished: notice.publishedAt,
            dateModified: notice.publishedAt,
            mainEntityOfPage: pageUrl,
            articleSection: notice.category || "공지사항",
            author: { "@id": `${SITE_URL}/#organization` },
            publisher: { "@id": `${SITE_URL}/#organization` },
            inLanguage: "ko-KR",
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "알림마당", item: `${SITE_URL}/notices` },
              { "@type": "ListItem", position: 3, name: safeTitle, item: pageUrl },
            ],
          },
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        {notFound && <meta name="robots" content="noindex" />}
        {jsonLd && (
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        )}
      </Helmet>
      <Header />

      {/* Hero */}
      <section className="bg-[#0a1628] pt-28 pb-10 lg:pt-32 lg:pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav
            aria-label="breadcrumb"
            className="flex items-center gap-1 text-xs text-gray-400 mb-4 flex-wrap"
          >
            <Link href="/" className="hover:text-white">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/notices" className="hover:text-white">알림마당</Link>
            {notice && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-300 truncate max-w-[60vw]">{safeTitle}</span>
              </>
            )}
          </nav>
          {notice && (
            <div className="flex items-center gap-3 mb-3">
              {notice.isPinned && <Pin className="w-4 h-4 text-red-400" />}
              <span
                className={`text-xs px-2 py-1 rounded border ${categoryColor(notice.category)}`}
              >
                {notice.category || "공지사항"}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={notice.publishedAt?.slice(0, 10)}>
                  {formatNoticeDate(notice.publishedAt)}
                </time>
              </span>
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
            {loading ? "불러오는 중…" : notFound ? "글을 찾을 수 없습니다" : safeTitle}
          </h1>
        </div>
      </section>

      {/* Body */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}

        {!loading && notFound && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-6">
              요청하신 글이 삭제되었거나 주소가 올바르지 않습니다.
            </p>
            <Link
              href="/notices"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0a1628] text-white text-sm font-medium hover:bg-[#13233d]"
            >
              <ArrowLeft className="w-4 h-4" />
              알림마당 목록으로
            </Link>
          </div>
        )}

        {!loading && notice && (
          <article className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
            {notice.excerpt && (
              <p className="text-sm text-gray-700 mb-6 pb-6 border-b border-gray-200">
                {DOMPurify.sanitize(notice.excerpt, { ALLOWED_TAGS: [] })}
              </p>
            )}

            {notice.content && (
              <div className="prose prose-sm max-w-none">
                <PortableText
                  value={notice.content}
                  components={noticePortableTextComponents}
                />
              </div>
            )}

            {notice.attachments && notice.attachments.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">첨부파일</p>
                <div className="space-y-2">
                  {notice.attachments.map((att: any) =>
                    att?.asset?._ref ? (
                      <a
                        key={att._key}
                        href={sanityFileUrl(att.asset._ref)}
                        download
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Download className="w-4 h-4" />
                        {att.description || "파일 다운로드"}
                      </a>
                    ) : null,
                  )}
                </div>
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link
                href="/notices"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#0a1628]"
              >
                <ArrowLeft className="w-4 h-4" />
                알림마당 목록으로
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#0a1628] text-white text-sm font-medium hover:bg-[#13233d]"
              >
                이 내용 관련 무료 상담 신청
              </Link>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
