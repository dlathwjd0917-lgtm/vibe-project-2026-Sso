/**
 * @file cartBadge.js
 * @description 모든 페이지 상단 장바구니 아이콘 우측 상단 뱃지(검은색 원 + 흰색 숫자) 컴포넌트
 */

import { cartService } from '../services/cartService.js';

/**
 * 페이지 내 모든 장바구니 아이콘에 뱃지 요소를 주입하고 상태 동기화
 */
export function initCartBadge() {
  // 장바구니 링크 탐색 (데스크톱 상단 헤더 및 모바일 하단 메뉴)
  const cartSelectors = [
    'a[data-cart-link]',
    'a[href*="cart.html"]',
    'a.icon-link[aria-label="장바구니"]',
    'a.bottom-nav__link[aria-label="장바구니"]',
    'a[href*="#site-footer"][aria-label="장바구니"]'
  ];

  const cartLinks = document.querySelectorAll(cartSelectors.join(', '));

  cartLinks.forEach((link) => {
    // 1. 링크 대상을 cart.html로 보정
    link.href = 'cart.html';
    link.classList.add('cart-icon-wrap');

    // 2. 뱃지 요소가 없으면 생성
    let badge = link.querySelector('.cart-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge is-hidden';
      badge.setAttribute('aria-label', '장바구니 담긴 상품 수');
      link.appendChild(badge);
    }
  });

  // 3. 뱃지 숫자 갱신 함수
  function updateBadges() {
    const count = cartService.getCartCount();
    const currentLinks = document.querySelectorAll('.cart-icon-wrap, a[href*="cart.html"]');

    currentLinks.forEach((link) => {
      let badge = link.querySelector('.cart-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'cart-badge';
        link.appendChild(badge);
      }

      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : String(count);
        badge.classList.remove('is-hidden');
        badge.style.display = 'inline-flex';
      } else {
        badge.textContent = '0';
        badge.classList.add('is-hidden');
        badge.style.display = 'none';
      }
    });
  }

  // 4. 초기 상태 반영
  updateBadges();

  // 5. 전역 장바구니 변경 및 다른 탭 스토리지 변경 시 실시간 반영
  window.addEventListener('vlast_cart_updated', updateBadges);
  window.addEventListener('storage', (event) => {
    if (event.key === 'vlast_cart_items') {
      updateBadges();
    }
  });
}

