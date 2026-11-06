import { initSiteLayout } from "./components/siteLayout.js";
import { initCarousel } from "./modules/carousel.js";
import { initCatalog } from "./modules/catalog.js";

// 공통 상단/하단 레이아웃 초기화 (헤더, 바텀바, 플로팅UI, 푸터 및 인증/장바구니 상태 동기화)
initSiteLayout({ activePage: "home" });
initCarousel();
initCatalog();
