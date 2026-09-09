import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * index.html(및 프리렌더 HTML)의 페이지별 메타 태그는 크롤러(JS 미실행)용이다.
 * 앱이 뜨면 각 페이지가 같은 태그를 다시 선언하므로, 중복을 막기 위해
 * data-rh="true" 로 표시된 정적 태그를 먼저 제거한다.
 * (React 19는 <meta>/<link>를 head로 호이스팅하며 기존 태그를 교체하지 않는다.)
 */
document.head
  .querySelectorAll('[data-rh="true"]')
  .forEach((el) => el.parentNode?.removeChild(el));

createRoot(document.getElementById("root")!).render(<App />);
