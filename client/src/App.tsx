import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ServiceDetail from "./pages/ServiceDetail";
import Contact from "./pages/Contact";
import Notices from "./pages/Notices";
import RSSFeed from "./pages/RSSFeed";
import TestSanity from "./pages/TestSanity";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/service/:slug" component={ServiceDetail} />
      <Route path="/contact" component={Contact} />
      <Route path="/notices" component={Notices} />
      <Route path="/rss" component={RSSFeed} />
      <Route path="/rss.xml" component={RSSFeed} />
      {/* 개발 환경 전용 진단 페이지 — 운영 빌드에서는 라우트 비활성 */}
      {import.meta.env.DEV && (
        <Route path="/test-sanity" component={TestSanity} />
      )}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
