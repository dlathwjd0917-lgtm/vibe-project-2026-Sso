/**
 * @file detail.js
 * @description 상품 상세 페이지 동작 모듈
 * - URL 파라미터(?id=...)를 기반으로 data/products_detail.json에서 상품 정보 로드
 * - 이미지, 상품명, 가격 셋팅
 * - 수량 조절 및 총 금액 실시간 계산
 * - 장바구니(CART) 버튼 클릭 시 LocalStorage 저장 및 장바구니 이동 연계
 */

import { cartService } from '../services/cartService.js';
import { initCartBadge } from '../components/cartBadge.js';
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts.js';

let currentProduct = null;
let currentQuantity = 1;
let currentOption = '기본 옵션';

/**
 * 상품 데이터 로드 (data/products_detail.json 또는 폴백 데이터)
 * @param {string|number} id
 * @param {string} [parent]
 * @returns {Promise<Object|null>}
 */
async function loadProductDetail(id, parent) {
  let allProducts = [];
  try {
    const response = await fetch('data/products_detail.json');
    if (response.ok) {
      allProducts = await response.json();
    }
  } catch (err) {
    console.warn('JSON 파일 로드 실패, 로컬 폴백 데이터 사용:', err);
  }

  if (!allProducts || allProducts.length === 0) {
    allProducts = FALLBACK_PRODUCTS;
  }

  if (id) {
    if (parent) {
      const matchBoth = allProducts.find(item => String(item.id) === String(id) && item.parentCategory === parent);
      if (matchBoth) return matchBoth;
    }
    const found = allProducts.find(item => String(item.id) === String(id));
    if (found) return found;
  }

  // ID 미지정 또는 미일치 시 첫 번째 상품 반환
  return allProducts[0] || null;
}

/**
 * 총 금액 영역 갱신
 */
function updateTotalDisplay() {
  const totalValEl = document.getElementById('detail-total-val');
  if (!totalValEl || !currentProduct) return;

  const unitPrice = Number(currentProduct.price) || 0;
  const totalPrice = unitPrice * currentQuantity;

  totalValEl.innerHTML = `${totalPrice.toLocaleString('ko-KR')}원 <span>(${currentQuantity}개)</span>`;
}

/**
 * 장바구니 토스트 안내 팝업 노출
 */
function showCartToast(message = '장바구니에 상품을 담았습니다.') {
  const existing = document.querySelector('.cart-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <span>${message}</span>
    <a href="cart.html">장바구니 바로가기 &gt;</a>
  `;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

/**
 * 상세 페이지 초기화
 */
export async function initProductDetail() {
  initCartBadge();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const parentCategory = urlParams.get('parent');

  const product = await loadProductDetail(productId, parentCategory);
  if (!product) {
    document.getElementById('detail-app').innerHTML = `
      <div style="text-align: center; padding: 6rem 1rem;">
        <h2>상품 정보를 불러올 수 없습니다.</h2>
        <a href="index.html" style="color: #e0245e; text-decoration: underline; margin-top: 1rem; display: inline-block;">메인으로 돌아가기</a>
      </div>
    `;
    return;
  }

  currentProduct = product;
  currentQuantity = 1;

  // DOM 요소 바인딩
  const breadcrumbEl = document.getElementById('detail-breadcrumb');
  const imageEl = document.getElementById('detail-image');
  const thumbWrapEl = document.getElementById('detail-thumbs');
  const titleEl = document.getElementById('detail-title');
  const priceEl = document.getElementById('detail-price');
  const qtyInput = document.getElementById('detail-qty-input');
  const minusBtn = document.getElementById('detail-qty-minus');
  const plusBtn = document.getElementById('detail-qty-plus');
  const optionSelect = document.getElementById('detail-option-select');
  const cartBtn = document.getElementById('detail-btn-cart');
  const buyBtn = document.getElementById('detail-btn-buy');
  const wishBtn = document.getElementById('detail-btn-wish');

  // 1. 브레드크럼 셋팅
  if (breadcrumbEl) {
    breadcrumbEl.innerHTML = `
      <a href="index.html">홈</a>
      <span>/</span>
      <a href="index.html#category">${product.parentCategory || 'ALBUM'}</a>
      ${product.category ? `<span>/</span><strong aria-current="page">${product.category}</strong>` : ''}
    `;
  }

  // 2. 이미지 셋팅
  const imgSrc = product.image_url || product.imageUrl || '';
  if (imageEl) {
    imageEl.src = imgSrc;
    imageEl.alt = `${product.name} 상세 이미지`;
    imageEl.onerror = () => {
      imageEl.src = 'imges/used/icon-logo.svg';
    };
  }

  if (thumbWrapEl) {
    thumbWrapEl.innerHTML = `
      <button type="button" class="detail-visual__thumb is-active" aria-label="메인 썸네일">
        <img src="${imgSrc}" alt="" />
      </button>
    `;
  }

  // 3. 상품명 및 가격 셋팅
  if (titleEl) {
    titleEl.textContent = product.name;
    document.title = `${product.name} | VLAST Shop`;
  }

  if (priceEl) {
    const formattedPrice = product.price_formatted || product.priceDisplay || `${(Number(product.price) || 0).toLocaleString('ko-KR')}원`;
    priceEl.textContent = formattedPrice;
  }

  // 4. 수량 조절 이벤트
  if (qtyInput) {
    qtyInput.value = '1';

    qtyInput.addEventListener('change', () => {
      let val = parseInt(qtyInput.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      currentQuantity = val;
      qtyInput.value = String(currentQuantity);
      updateTotalDisplay();
    });
  }

  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        if (qtyInput) qtyInput.value = String(currentQuantity);
        updateTotalDisplay();
      }
    });
  }

  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      currentQuantity++;
      if (qtyInput) qtyInput.value = String(currentQuantity);
      updateTotalDisplay();
    });
  }

  if (optionSelect) {
    optionSelect.addEventListener('change', () => {
      currentOption = optionSelect.value || '기본 옵션';
    });
  }

  updateTotalDisplay();

  // 5. 버튼 상태 설정 (장바구니 버튼만 활성화)
  if (cartBtn) {
    cartBtn.removeAttribute('disabled');
    cartBtn.addEventListener('click', () => {
      // 장바구니에 담기
      cartService.addToCart(currentProduct, currentQuantity, currentOption);

      // 장바구니 이동 여부 확인
      const goToCart = confirm('장바구니에 상품이 정상적으로 담겼습니다.\n장바구니 페이지로 바로 이동하시겠습니까?');
      if (goToCart) {
        window.location.href = 'cart.html';
      } else {
        showCartToast(`장바구니에 '${currentProduct.name}' (${currentQuantity}개) 담김`);
      }
    });
  }

  if (buyBtn) {
    buyBtn.setAttribute('title', '현재 장바구니 담기만 지원됩니다.');
    buyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('현재 주문은 장바구니(CART) 페이지를 통해 이용하실 수 있습니다. 장바구니 버튼을 이용해 주세요.');
    });
  }

  if (wishBtn) {
    wishBtn.setAttribute('title', '현재 지원되지 않는 기능입니다.');
  }

  // 이미지 호버 WISH / ADD 액션 버튼 바인딩
  const hoverWishBtn = document.getElementById('detail-hover-wish-btn');
  const hoverAddBtn = document.getElementById('detail-hover-add-btn');

  if (hoverWishBtn) {
    hoverWishBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showCartToast(`'${currentProduct.name}'을(를) 관심상품(WISH)에 담았습니다.`);
    });
  }

  if (hoverAddBtn) {
    hoverAddBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cartService.addToCart(currentProduct, currentQuantity, currentOption);
      showCartToast(`'${currentProduct.name}' (${currentQuantity}개) 장바구니에 담김`);
    });
  }
}

