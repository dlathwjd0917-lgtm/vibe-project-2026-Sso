/**
 * @file siteLayout.js
 * @description 사이트 공통 상단(헤더) 및 하단(모바일바텀바, 플로팅UI, 푸터) 통합 제어 모듈
 * - 각 페이지에 중복 하드코딩되던 상·하단 마크업을 단일 모듈로 통합
 * - 단 한 곳(siteLayout.js)에서 모든 페이지의 상단/하단 메뉴, 로고, 인증 링크, 푸터 정보를 중앙 제어
 * - 자동 연동:
 *   1) initAuthHeader() : 로그인 상태 및 환영 문구 실시간 반영
 *   2) initCartBadge()  : 장바구니 담긴 개수 실시간 뱃지 연동
 *   3) 플로팅 탑 버튼 스무스 스크롤
 *   4) 현재 활성 페이지 GNB 메뉴 하이라이트
 */

import { initAuthHeader } from './authHeader.js';
import { initCartBadge } from './cartBadge.js';

/**
 * 현재 페이지 식별자 가져오기
 * @returns {'home' | 'notice' | 'cart' | 'detail' | 'login' | 'signup'}
 */
export function getCurrentPage() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('community')) return 'community';
  if (path.includes('notice')) return 'notice';
  if (path.includes('cart')) return 'cart';
  if (path.includes('detail')) return 'detail';
  if (path.includes('signup')) return 'signup';
  if (path.includes('login')) return 'login';
  return 'home';
}

/**
 * 사이트 공통 상단 헤더 HTML 템플릿 생성
 * @param {string} activePage
 * @returns {string}
 */
export function getHeaderTemplate(activePage = getCurrentPage()) {
  const isHome = activePage === 'home';
  const homeUrl = isHome ? '#main' : 'index.html';
  const searchUrl = isHome ? '#search-view' : 'index.html#search-view';
  const categoryUrl = isHome ? '#category' : 'index.html#category';
  const newArrivalsUrl = isHome ? '#new-arrivals' : 'index.html#new-arrivals';
  const isNotice = activePage === 'notice';
  const isCommunity = activePage === 'community';

  return `
    <div class="inner-box">
      <!-- 1. 유틸리티 바 (언어 선택, 회원 메뉴) -->
      <div class="header__part header__part--utility">
        <a class="header__language" href="index.html" aria-label="언어 선택, 현재 한국어">
          한국어 <span aria-hidden="true">⌄</span>
        </a>
        <nav class="header__utility-links" aria-label="회원 메뉴">
          <a href="signup.html" ${activePage === 'signup' ? 'aria-current="page"' : ''}>회원가입</a>
          <a href="login.html" ${activePage === 'login' ? 'aria-current="page"' : ''}>로그인</a>
          <a href="index.html#site-footer">주문조회</a>
          <a href="${newArrivalsUrl}">최근본상품</a>
        </nav>
      </div>

      <!-- 2. 메인 헤더 바 (로고, 쇼핑 아이콘) -->
      <div class="header__part header__part--main">
        <a class="header__logo" href="${homeUrl}" aria-label="VLAST Shop 홈">
          <span>VLAST</span><span class="header__logo-shop">Shop</span>
        </a>
        <nav class="header__icons" aria-label="쇼핑 메뉴">
          <a class="icon-link" href="${searchUrl}" aria-label="상품 검색" ${isHome ? 'data-search-open aria-controls="search-view" aria-expanded="false"' : ''}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8"></circle>
              <path d="m16 16 4.5 4.5"></path>
            </svg>
          </a>
          <a class="icon-link" href="login.html" aria-label="로그인" ${activePage === 'login' ? 'aria-current="page"' : ''}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="7.5" r="4"></circle>
              <path d="M4.5 20c.5-4 3.1-6 7.5-6s7 2 7.5 6z"></path>
            </svg>
          </a>
          <a class="icon-link cart-icon-wrap" href="cart.html" aria-label="장바구니" data-cart-link ${activePage === 'cart' ? 'aria-current="page"' : ''}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 8h14l1.2 12H3.8z"></path>
              <path d="M9 9V6a3 3 0 0 1 6 0v3"></path>
            </svg>
          </a>
        </nav>
      </div>

      <!-- 3. GNB 내비게이션 바 (카테고리 메뉴) -->
      <nav class="header__part header__part--navigation gnb" id="category" aria-label="카테고리 메뉴">
        <a class="header__mobile-menu icon-link" href="${categoryUrl}" aria-label="전체 메뉴 열기" ${isHome ? 'data-drawer-open aria-controls="mobile-drawer" aria-expanded="false"' : ''}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </a>
        <ul class="gnb__list">
          <li class="gnb__mobile-logo-item">
            <a class="gnb__mobile-logo" href="${homeUrl}" aria-label="VLAST Shop 홈"><span>VLAST</span><span>Shop</span></a>
          </li>
          <li class="gnb__category-item"><a href="${newArrivalsUrl}" data-catalog-parent="ALBUM">ALBUM</a></li>
          <li class="gnb__category-item"><a href="${newArrivalsUrl}" data-catalog-parent="MERCH">MERCH</a></li>
          <li class="gnb__category-item"><a href="${newArrivalsUrl}" data-catalog-parent="TOUR">TOUR</a></li>
          <li class="gnb__category-item"><a href="${newArrivalsUrl}" data-catalog-parent="SEASONAL">SEASONAL</a></li>
          <li class="gnb__category-item"><a href="${newArrivalsUrl}" data-catalog-parent="ASTERUM 433-10">ASTERUM 433-10</a></li>
          <li class="gnb__category-item">
            <a href="notice.html" ${isNotice ? 'aria-current="page" style="color: #e0245e; font-weight: 700;"' : ''}>NOTICE</a>
          </li>
          <li class="gnb__category-item">
            <a href="community.html" ${isCommunity ? 'aria-current="page" style="color: #e0245e; font-weight: 700;"' : ''}>COMMUNITY</a>
          </li>
        </ul>
        <a class="header__mobile-search icon-link" href="${searchUrl}" aria-label="상품 검색" ${isHome ? 'data-search-open aria-controls="search-view" aria-expanded="false"' : ''}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8"></circle>
            <path d="m16 16 4.5 4.5"></path>
          </svg>
        </a>
      </nav>
    </div>
  `;
}

/**
 * 모바일 하단 내비게이션 HTML 템플릿
 * @param {string} activePage
 * @returns {string}
 */
export function getBottomNavTemplate(activePage = getCurrentPage()) {
  const isHome = activePage === 'home';
  const homeUrl = isHome ? '#main' : 'index.html';
  const searchUrl = isHome ? '#search-view' : 'index.html#search-view';
  const categoryUrl = isHome ? '#category' : 'index.html#category';

  return `
    <ul class="bottom-nav__list">
      <li>
        <a class="bottom-nav__link" href="${categoryUrl}" aria-label="카테고리 전체 메뉴">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <span class="sr-only">카테고리</span>
        </a>
      </li>
      <li>
        <a class="bottom-nav__link" href="${searchUrl}" aria-label="상품 검색">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7"></circle>
            <path d="m16.5 16.5 4 4"></path>
          </svg>
          <span class="sr-only">검색</span>
        </a>
      </li>
      <li>
        <a class="bottom-nav__link ${isHome ? 'is-active' : ''}" href="${homeUrl}" aria-label="홈" ${isHome ? 'aria-current="page"' : ''}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m3 10 9-7 9 7v10H3z"></path>
            <path d="M9 20v-6h6v6"></path>
          </svg>
          <span class="sr-only">홈</span>
        </a>
      </li>
      <li>
        <a class="bottom-nav__link cart-icon-wrap ${activePage === 'cart' ? 'is-active' : ''}" href="cart.html" aria-label="장바구니" data-cart-link ${activePage === 'cart' ? 'aria-current="page"' : ''}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 8h14l1.2 12H3.8z"></path>
            <path d="M9 9V6a3 3 0 0 1 6 0v3"></path>
          </svg>
          <span class="sr-only">장바구니</span>
        </a>
      </li>
      <li>
        <a class="bottom-nav__link ${activePage === 'login' || activePage === 'signup' ? 'is-active' : ''}" href="login.html" aria-label="마이페이지" ${activePage === 'login' ? 'aria-current="page"' : ''}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="7.5" r="4"></circle>
            <path d="M4.5 20c.5-4 3.1-6 7.5-6s7 2 7.5 6z"></path>
          </svg>
          <span class="sr-only">마이</span>
        </a>
      </li>
    </ul>
  `;
}

/**
 * 플로팅 바로가기 UI HTML 템플릿
 * @returns {string}
 */
export function getFloatingUITemplate() {
  return `
    <a class="floating-ui__button floating-ui__button--top" href="#main" aria-label="맨 위로">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5M6 11l6-6 6 6"></path>
      </svg>
    </a>
    <a class="floating-ui__button floating-ui__button--pink" href="#site-footer" aria-label="고객센터">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5.5h16v11H9l-5 3z"></path>
        <path d="M8 10h8M8 13h5"></path>
      </svg>
    </a>
  `;
}

/**
 * 사이트 공통 푸터 HTML 템플릿
 * @returns {string}
 */
export function getFooterTemplate() {
  return `
    <div class="inner-box">
      <div class="footer__top">
        <div class="footer__main-info">
          <a class="footer__logo" href="index.html" aria-label="VLAST Shop 홈으로 이동">
            <span class="footer__logo-main">VLAST</span>
            <span class="footer__logo-sub">Shop</span>
          </a>

          <nav class="footer__links" aria-label="푸터 정책 링크">
            <a href="#site-footer">회사소개</a>
            <a href="#site-footer">이용약관</a>
            <a class="is-strong" href="#site-footer">개인정보처리방침</a>
            <a href="#site-footer">이용안내</a>
          </nav>

          <div class="footer__company-info">
            <div class="footer__info-row">
              <span class="footer__info-item"><strong>상호명</strong> (주)로운컴퍼니씨앤씨</span>
              <span class="footer__info-item"><strong>대표자명</strong> 최윤석</span>
            </div>
            <div class="footer__info-row">
              <span class="footer__info-item"><strong>사업장 주소</strong> 03926 서울특별시 마포구 상암산로 76 (상암동) YTN 뉴스퀘어 18층 로운컴퍼니씨앤씨</span>
            </div>
            <div class="footer__info-row">
              <span class="footer__info-item"><strong>대표전화</strong> 1566-7216</span>
              <span class="footer__info-item"><strong>이메일</strong> support@vlastshop.com</span>
              <span class="footer__info-item"><strong>사업자 등록번호</strong> 128-87-04926</span>
            </div>
            <div class="footer__info-row">
              <span class="footer__info-item"><strong>통신판매업 신고번호</strong> 제 2022-서울마포-1985호 <a class="footer__info-link" href="#site-footer">[사업자정보확인]</a></span>
              <span class="footer__info-item"><strong>개인정보보호책임자</strong> 최윤석</span>
            </div>
          </div>

          <div class="footer__badges">
            <div class="badge-circle-chart" aria-label="CIRCLE CHART 인증">
              <span class="badge-circle-chart__icon" aria-hidden="true"></span>
              <span>CIRCLE CHART</span>
            </div>
            <div class="badge-hanteo" aria-label="2024 한터 패밀리 인증">
              <div class="badge-hanteo__box" aria-hidden="true">
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                  <rect x="2" y="2" width="2" height="8" rx="1" fill="#e0245e"/>
                  <rect x="6" y="0" width="2" height="12" rx="1" fill="#111111"/>
                  <rect x="10" y="2" width="2" height="8" rx="1" fill="#e0245e"/>
                  <rect x="14" y="4" width="2" height="4" rx="1" fill="#111111"/>
                </svg>
                <span class="badge-hanteo__logo-text">HANTEO</span>
              </div>
              <div class="badge-hanteo__text">
                <strong>2024<br>한터 패밀리</strong>
                <span>NO. HF0082ROW001</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer__customer-center">
          <span>Customer Center</span>
        </div>
      </div>

      <hr class="footer__divider" aria-hidden="true">

      <p class="footer__copyright">
        Copyright (C) VLAST Co., Ltd. WARNING : All Rights Reserved. Unauthorized Duplication &amp; Rent is Prohibited.
      </p>

      <div class="footer__escrow">
        <div class="footer__escrow-brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#3273dc" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#3273dc"/>
            <path d="M8 12l3 3 5-5" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
          <span>payments 구매안전서비스</span>
        </div>
        <div class="footer__escrow-desc">
          <span>매매 보호 서비스 에스크로를 이용할 수 있어요.</span>
          <span>결제대금예치업 등록번호 02-006-00059</span>
        </div>
        <a class="footer__escrow-button" href="#site-footer" target="_blank" rel="noopener noreferrer">가입 사실 확인하기</a>
      </div>
    </div>
  `;
}

/**
 * 사이트 공통 레이아웃 초기화
 * @param {Object} options
 * @param {string} [options.activePage] - 수동 지정 시 페이지 식별자
 */
export function initSiteLayout(options = {}) {
  const activePage = options.activePage || getCurrentPage();

  // 1. 헤더 렌더링
  const headerEl = document.querySelector('.site-header') || document.getElementById('site-header');
  if (headerEl) {
    headerEl.innerHTML = getHeaderTemplate(activePage);
  }

  // 2. 모바일 하단바 렌더링
  const bottomNavEl = document.querySelector('.bottom-nav') || document.getElementById('bottom-nav');
  if (bottomNavEl) {
    bottomNavEl.innerHTML = getBottomNavTemplate(activePage);
  }

  // 3. 플로팅 바로가기 UI 렌더링
  const floatingEl = document.querySelector('.floating-ui') || document.getElementById('floating-ui');
  if (floatingEl) {
    floatingEl.innerHTML = getFloatingUITemplate();

    // 맨 위로 이동 버튼 스무스 스크롤 바인딩
    const topBtn = floatingEl.querySelector('.floating-ui__button--top');
    if (topBtn) {
      topBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // 4. 푸터 렌더링
  const footerEl = document.querySelector('.site-footer') || document.getElementById('site-footer');
  if (footerEl) {
    footerEl.innerHTML = getFooterTemplate();
  }

  // 5. 헤더 인증 상태 동기화
  initAuthHeader();

  // 6. 장바구니 뱃지 카운트 동기화
  initCartBadge();
}

