import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

/* 라우트 레벨 코드 분할 — 각 페이지를 필요할 때만 로드 */
const Home = lazy(() => import("./pages/Home"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Notices = lazy(() => import("./pages/Notices"));
const NoticeDetail = lazy(() => import("./pages/NoticeDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TestSanity = lazy(() => import("./pages/TestSanity"));

function Router() {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/service/:slug" component={ServiceDetail} />
        <Route path="/contact" component={Contact} />
        <Route path="/notices" component={Notices} />
        <Route path="/notices/:id" component={NoticeDetail} />
        {/* /rss.xml 은 vercel.json rewrite → api/rss.ts (서버 생성) */}
        {/* 개발 환경 전용 진단 페이지 — 운영 빌드에서는 라우트 비활성 */}
        {import.meta.env.DEV && (
          <Route path="/test-sanity" component={TestSanity} />
        )}
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
            {/* Vercel Web Analytics — Vercel 대시보드 > Analytics 에서 Enable 해야 수집 시작 */}
            <Analytics />
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
