/*
 * 404 page — brand-consistent with navy/gold design
 */
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-warm-gray py-20">
        <div className="text-center px-4">
          <p className="text-gold text-8xl font-bold font-serif mb-4">404</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-navy mb-4 font-serif">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-muted-foreground text-base mb-8 max-w-md mx-auto leading-relaxed">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
          <Link href="/">
            <Button className="bg-navy hover:bg-navy-light text-white px-8 py-3 rounded-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
