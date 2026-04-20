/**
 * RSS 피드 동적 생성 페이지
 * /rss 또는 /rss.xml 경로에서 접근 가능
 */

import { useEffect } from "react";
import { sanityClient, NOTICES_QUERY, type SanityNotice } from "@/lib/sanity";
import { createRSSFeed, generateRSSXML } from "@/lib/rss-generator";

export default function RSSFeed() {
  useEffect(() => {
    const generateAndServeRSS = async () => {
      try {
        // Sanity에서 공지사항 데이터 가져오기
        const notices = await sanityClient.fetch<SanityNotice[]>(NOTICES_QUERY);

        if (notices && notices.length > 0) {
          // RSS 피드 생성
          const feed = createRSSFeed(notices);
          const rssXML = generateRSSXML(feed);

          // 브라우저에 RSS XML 표시
          const blob = new Blob([rssXML], { type: "application/rss+xml" });
          const url = URL.createObjectURL(blob);
          window.location.href = url;
        } else {
          // 폴백: 정적 RSS 파일로 리다이렉트
          window.location.href = "/rss.xml";
        }
      } catch (error) {
        console.error("RSS 생성 오류:", error);
        // 오류 발생 시 정적 RSS 파일로 리다이렉트
        window.location.href = "/rss.xml";
      }
    };

    generateAndServeRSS();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <p>RSS 피드를 생성 중입니다...</p>
    </div>
  );
}
