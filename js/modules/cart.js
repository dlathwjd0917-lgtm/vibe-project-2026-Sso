/**
 * @file cart.js
 * @description 장바구니 페이지 UI 및 상호작용 모듈
 * - 시안 2(media_1793864448366_68c91d34.png) 1:1 매칭
 * - LocalStorage 연동 실시간 목록/수량변경/선택/삭제
 * - 상품이 없을 경우 '선택한 상품이 없습니다' 노출
 * - 우측 합계 박스 (총 상품금액, 총 배송비, 결제예정금액) 실시간 계산
 */

import { cartService } from '../services/cartService.js';
import { initCartBadge } from '../components/cartBadge.js';

/**
 * 특수문자 HTML 이스케이프
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 장바구니 화면 전체 렌더링
 */
export function renderCartView() {
  const container = document.getElementById('cart-app');
  if (!container) return;

  const items = cartService.getCart();
  const summary = cartService.getCartSummary();
  const isAllSelected = items.length > 0 && items.every(item => item.selected !== false);

  // 1. 장바구니가 비어있는 경우
  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart-layout">
        <section class="cart-main">
          <div class="cart-main__header">
            <h1 class="cart-main__title">장바구니 상품</h1>
            <span class="cart-main__toggle-icon" aria-hidden="true">∧</span>
          </div>

          <div class="cart-tab-bar">
            <span class="cart-tab-bar__label">일반상품 (0)</span>
          </div>

          <div class="cart-empty-box">
            <p class="cart-empty-text">선택한 상품이 없습니다</p>
            <a class="cart-empty-btn" href="index.html#new-arrivals">계속 쇼핑하기</a>
          </div>
        </section>

        <!-- 우측 주문 합계 요약 박스 (0원 상태) -->
        <aside class="cart-sidebar" aria-label="주문 금액 요약">
          <div class="cart-summary-box">
            <div class="cart-summary-row">
              <span>총 상품금액</span>
              <strong>0원</strong>
            </div>
            <div class="cart-summary-row">
              <span>총 배송비</span>
              <strong>0원</strong>
            </div>
            <div class="cart-summary-divider"></div>
            <div class="cart-summary-row cart-summary-row--total">
              <span>결제예정금액</span>
              <strong>0원</strong>
            </div>
          </div>

          <button type="button" class="cart-order-btn cart-order-btn--all" disabled style="opacity: 0.5; cursor: not-allowed;">
            전체상품주문
          </button>
          <button type="button" class="cart-order-btn cart-order-btn--selected" disabled style="opacity: 0.5; cursor: not-allowed;">
            선택상품주문
          </button>

          <p class="cart-sidebar__notice">! 할인 적용 금액은 주문서작성의 결제예정금액에서 확인 가능합니다.</p>
        </aside>
      </div>
    `;
    return;
  }

  // 2. 상품이 담겨 있는 경우 목록 렌더링
  const itemsHtml = items.map((item, index) => {
    const isSelected = item.selected !== false;
    const unitPrice = Number(item.price) || 0;
    const itemSubtotal = unitPrice * (item.quantity || 1);

    return `
      <li class="cart-item" data-cart-id="${escapeHtml(item.id)}" data-cart-option="${escapeHtml(item.option)}">
        <div class="cart-item__top">
          <input
            type="checkbox"
            class="cart-item__check"
            data-action="toggle-select"
            ${isSelected ? 'checked' : ''}
            aria-label="${escapeHtml(item.name)} 선택"
          >
          <div class="cart-item__thumb">
            <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)} 상품 이미지" onerror="this.src='imges/used/icon-logo.svg'">
          </div>
          <div class="cart-item__info">
            <span class="cart-item__name">${escapeHtml(item.name)}</span>
            <div class="cart-item__prices">
              <span class="cart-item__price">${unitPrice.toLocaleString('ko-KR')}원</span>
            </div>
            <span class="cart-item__shipping-tag">배송 : 3,000원 [조건] / 기본배송</span>
          </div>
          <button type="button" class="cart-item__delete" data-action="delete-item" aria-label="${escapeHtml(item.name)} 삭제" title="삭제">
            ✕
          </button>
        </div>

        <div class="cart-item__option-box">
          [옵션: 상품 구매에 관한 이용약관 및 교환/반품에 관한 기준을 모두 확인하고 동의합니다. / ${escapeHtml(item.option || '기본')}]
        </div>

        <div class="cart-item__middle">
          <div class="cart-item__qty-wrap">
            <span>수량</span>
            <div class="cart-item__qty-ctrl">
              <button type="button" class="cart-item__qty-btn" data-action="qty-minus" aria-label="수량 1 감소">-</button>
              <input type="text" class="cart-item__qty-input" data-action="qty-input" value="${item.quantity || 1}" aria-label="수량 입력">
              <button type="button" class="cart-item__qty-btn" data-action="qty-plus" aria-label="수량 1 증가">+</button>
            </div>
            <button type="button" class="cart-item__change-btn" data-action="qty-apply">변경</button>
          </div>

          <div class="cart-item__subtotal">
            <span>주문금액</span>
            <strong>${itemSubtotal.toLocaleString('ko-KR')}원</strong>
          </div>
        </div>

        <div class="cart-item__actions">
          <button type="button" class="cart-item__btn" data-action="wish">관심상품</button>
          <button type="button" class="cart-item__btn" data-action="order-one">주문하기</button>
        </div>
      </li>
    `;
  }).join('');

  container.innerHTML = `
    <div class="cart-layout">
      <!-- 좌측 장바구니 상품 목록 -->
      <section class="cart-main">
        <div class="cart-main__header">
          <h1 class="cart-main__title">장바구니 상품</h1>
          <span class="cart-main__toggle-icon" aria-hidden="true">∧</span>
        </div>

        <div class="cart-tab-bar">
          <label class="cart-tab-bar__label">
            <input type="checkbox" class="cart-tab-bar__check" id="cart-select-all" ${isAllSelected ? 'checked' : ''}>
            <span>일반상품 (${items.length})</span>
          </label>
        </div>

        <ul class="cart-list" id="cart-items-list">
          ${itemsHtml}
        </ul>

        <!-- 배송비 및 총 합계 안내 영역 -->
        <div class="cart-delivery-summary">
          <span>[기본배송]</span>
          <span>상품구매금액 <strong>${summary.subtotal.toLocaleString('ko-KR')}</strong> + 배송비 <strong>${summary.shippingFee.toLocaleString('ko-KR')}</strong></span>
          <span>합계 : <strong>${summary.total.toLocaleString('ko-KR')}원</strong></span>
        </div>
      </section>

      <!-- 우측 고정 결제 금액 요약 박스 -->
      <aside class="cart-sidebar" aria-label="주문 금액 요약">
        <div class="cart-summary-box">
          <div class="cart-summary-row">
            <span>총 상품금액</span>
            <strong>${summary.subtotal.toLocaleString('ko-KR')}원</strong>
          </div>
          <div class="cart-summary-row">
            <span>총 배송비</span>
            <strong>${summary.shippingFee.toLocaleString('ko-KR')}원</strong>
          </div>
          <div class="cart-summary-divider"></div>
          <div class="cart-summary-row cart-summary-row--total">
            <span>결제예정금액</span>
            <strong>${summary.total.toLocaleString('ko-KR')}원</strong>
          </div>
        </div>

        <button type="button" class="cart-order-btn cart-order-btn--all" id="btn-order-all">
          전체상품주문
        </button>
        <button type="button" class="cart-order-btn cart-order-btn--selected" id="btn-order-selected">
          선택상품주문
        </button>

        <p class="cart-sidebar__notice">! 할인 적용 금액은 주문서작성의 결제예정금액에서 확인 가능합니다.</p>
      </aside>
    </div>
  `;

  // 이벤트 바인딩
  bindCartEvents(container);
}

/**
 * 장바구니 요소별 이벤트 리스너 바인딩
 * @param {HTMLElement} container
 */
function bindCartEvents(container) {
  // 1. 전체 선택 체크박스
  const selectAll = container.querySelector('#cart-select-all');
  if (selectAll) {
    selectAll.addEventListener('change', () => {
      cartService.setAllSelected(selectAll.checked);
      renderCartView();
    });
  }

  // 2. 목록 내 개별 액션 (이벤트 위임)
  const listEl = container.querySelector('#cart-items-list');
  if (listEl) {
    listEl.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.cart-item');
      if (!itemEl) return;

      const id = itemEl.dataset.cartId;
      const option = itemEl.dataset.cartOption;
      const action = e.target.dataset.action;

      if (action === 'delete-item') {
        if (confirm('해당 상품을 장바구니에서 삭제하시겠습니까?')) {
          cartService.removeFromCart(id, option);
          renderCartView();
        }
      } else if (action === 'qty-minus') {
        const input = itemEl.querySelector('[data-action="qty-input"]');
        let qty = parseInt(input.value, 10) || 1;
        if (qty > 1) {
          qty--;
          input.value = String(qty);
          cartService.updateQuantity(id, qty, option);
          renderCartView();
        }
      } else if (action === 'qty-plus') {
        const input = itemEl.querySelector('[data-action="qty-input"]');
        let qty = parseInt(input.value, 10) || 1;
        qty++;
        input.value = String(qty);
        cartService.updateQuantity(id, qty, option);
        renderCartView();
      } else if (action === 'qty-apply') {
        const input = itemEl.querySelector('[data-action="qty-input"]');
        let qty = Math.max(1, parseInt(input.value, 10) || 1);
        cartService.updateQuantity(id, qty, option);
        renderCartView();
      } else if (action === 'wish') {
        alert('관심상품에 등록되었습니다.');
      } else if (action === 'order-one') {
        const unit = cartService.getCart().find(x => String(x.id) === String(id));
        if (unit) {
          const totalAmt = (Number(unit.price) || 0) * (unit.quantity || 1) + 3000;
          alert(`[단일 상품 주문]\n상품명: ${unit.name}\n수량: ${unit.quantity}개\n결제예정금액: ${totalAmt.toLocaleString('ko-KR')}원\n\n주문서 작성 페이지로 이동합니다.`);
        }
      }
    });

    listEl.addEventListener('change', (e) => {
      const itemEl = e.target.closest('.cart-item');
      if (!itemEl) return;

      const id = itemEl.dataset.cartId;
      if (e.target.dataset.action === 'toggle-select') {
        cartService.setItemSelected(id, e.target.checked);
        renderCartView();
      }
    });
  }

  // 3. 주문 버튼
  container.querySelector('#btn-order-all')?.addEventListener('click', () => {
    const summary = cartService.getCartSummary();
    if (summary.itemsCount === 0) {
      alert('장바구니에 담긴 상품이 없습니다.');
      return;
    }
    alert(`[전체 상품 주문]\n총 상품 종류: ${summary.itemsCount}종\n결제예정금액: ${summary.total.toLocaleString('ko-KR')}원\n\n주문서 페이지로 이동합니다.`);
  });

  container.querySelector('#btn-order-selected')?.addEventListener('click', () => {
    const summary = cartService.getCartSummary();
    if (summary.selectedCount === 0) {
      alert('선택된 주문 상품이 없습니다. 주문하실 상품을 선택해 주세요.');
      return;
    }
    alert(`[선택 상품 주문]\n선택된 상품: ${summary.selectedCount}종\n결제예정금액: ${summary.total.toLocaleString('ko-KR')}원\n\n주문서 페이지로 이동합니다.`);
  });
}

/**
 * 장바구니 페이지 초기화
 */
export function initCartPage() {
  initCartBadge();
  renderCartView();

  // 다른 탭에서 장바구니 변경 시 자동 갱신
  window.addEventListener('storage', (e) => {
    if (e.key === 'vlast_cart_items') {
      renderCartView();
    }
  });
}

