/**
 * @file authHeader.js
 * @description 전역 상단 헤더의 로그인/로그아웃 상태 및 사용자 환영 문구 실시간 동기화 컴포넌트
 * - 로그인 시: "뚝스 환영합니다 | 로그아웃 | 주문조회 | 최근본상품"
 * - 비로그인 시: "회원가입 | 로그인 | 주문조회 | 최근본상품"
 */

import { authService } from '../services/authService.js';

export function updateAuthHeader() {
  const utilityNavList = document.querySelectorAll('.header__utility-links');
  if (!utilityNavList || utilityNavList.length === 0) return;

  const user = authService.getCurrentUser();

  utilityNavList.forEach((nav) => {
    nav.replaceChildren();

    if (user) {
      // 1. 로그인 상태 렌더링
      const welcomeSpan = document.createElement('span');
      welcomeSpan.className = 'header__welcome-text';
      welcomeSpan.style.cssText = 'color: #e0245e; font-weight: 700;';
      const displayName = user.name || '플리';
      welcomeSpan.textContent = `${displayName} 환영합니다`;

      const logoutBtn = document.createElement('button');
      logoutBtn.type = 'button';
      logoutBtn.className = 'header__auth-btn';
      logoutBtn.textContent = '로그아웃';
      logoutBtn.setAttribute('aria-label', '로그아웃');
      logoutBtn.addEventListener('click', () => {
        if (confirm('로그아웃 하시겠습니까?')) {
          authService.logout();
          alert('로그아웃 되었습니다.');
          window.location.reload();
        }
      });

      const orderLink = document.createElement('a');
      orderLink.href = 'index.html#site-footer';
      orderLink.textContent = '주문조회';

      const recentLink = document.createElement('a');
      recentLink.href = 'index.html#new-arrivals';
      recentLink.textContent = '최근본상품';

      nav.append(welcomeSpan, logoutBtn, orderLink, recentLink);
    } else {
      // 2. 비로그인 상태 렌더링
      const signupLink = document.createElement('a');
      signupLink.href = 'signup.html';
      signupLink.textContent = '회원가입';

      const loginLink = document.createElement('a');
      loginLink.href = 'login.html';
      loginLink.textContent = '로그인';

      const orderLink = document.createElement('a');
      orderLink.href = 'index.html#site-footer';
      orderLink.textContent = '주문조회';

      const recentLink = document.createElement('a');
      recentLink.href = 'index.html#new-arrivals';
      recentLink.textContent = '최근본상품';

      nav.append(signupLink, loginLink, orderLink, recentLink);
    }
  });

  // 모바일 하단 내비게이션 마이페이지 링크 아이콘 연동
  const mobileMyLinks = document.querySelectorAll('.bottom-nav__link[href*="login.html"]');
  mobileMyLinks.forEach((link) => {
    const textEl = link.querySelector('span');
    if (textEl) {
      textEl.textContent = user ? 'MY' : '마이';
    }
  });
}

/**
 * 전역 헤더 인증 상태 초기화 및 실시간 리스너 등록
 */
export function initAuthHeader() {
  updateAuthHeader();

  // 커스텀 로그인 상태 변경 이벤트 감지
  window.addEventListener('vlast_auth_changed', () => {
    updateAuthHeader();
  });

  // 브라우저 탭 간 동기화
  window.addEventListener('storage', (event) => {
    if (event.key === 'vlast_auth_user') {
      updateAuthHeader();
    }
  });
}
