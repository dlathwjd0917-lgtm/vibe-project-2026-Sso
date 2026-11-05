/**
 * @file cartService.js
 * @description 장바구니 LocalStorage 관리 서비스
 * - 상품 추가, 수량 변경, 삭제, 총 합계 계산
 * - 전역 장바구니 변경 이벤트 (vlast_cart_updated) 발행
 */

const CART_STORAGE_KEY = 'vlast_cart_items';
const FREE_SHIPPING_THRESHOLD = 50000; // 5만원 이상 무료배송
const DEFAULT_SHIPPING_FEE = 3000;

export const cartService = {
  /**
   * 장바구니 전체 목록 조회
   * @returns {Array<Object>}
   */
  getCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('장바구니 로드 실패:', e);
      return [];
    }
  },

  /**
   * 장바구니 저장 및 변경 이벤트 알림
   * @param {Array<Object>} items
   */
  saveCart(items) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('장바구니 저장 실패:', e);
    }
    this._notify();
  },

  /**
   * 장바구니에 상품 추가
   * @param {Object} product - { id, name, price, priceDisplay, imageUrl }
   * @param {number} quantity - 추가할 수량 (기본 1)
   * @param {string} option - 선택 옵션 텍스트
   * @returns {Array<Object>} 업데이트된 장바구니
   */
  addToCart(product, quantity = 1, option = '기본') {
    const items = this.getCart();
    const cleanQty = Math.max(1, parseInt(quantity, 10) || 1);
    const existingIndex = items.findIndex(
      item => String(item.id) === String(product.id) && item.option === option
    );

    if (existingIndex > -1) {
      items[existingIndex].quantity += cleanQty;
    } else {
      const numPrice = Number(product.price) || 0;
      items.push({
        id: String(product.id),
        name: product.name,
        price: numPrice,
        priceDisplay: product.priceDisplay || product.price_formatted || `${numPrice.toLocaleString('ko-KR')}원`,
        imageUrl: product.imageUrl || product.image_url || '',
        quantity: cleanQty,
        option: option || '기본',
        selected: true,
        addedAt: new Date().toISOString()
      });
    }

    this.saveCart(items);
    return items;
  },

  /**
   * 상품 수량 변경
   * @param {string|number} id
   * @param {number} quantity
   * @param {string} option
   */
  updateQuantity(id, quantity, option = null) {
    const items = this.getCart();
    const cleanQty = Math.max(1, parseInt(quantity, 10) || 1);
    const target = items.find(
      item => String(item.id) === String(id) && (option === null || item.option === option)
    );

    if (target) {
      target.quantity = cleanQty;
      this.saveCart(items);
    }
  },

  /**
   * 상품 선택 여부 토글
   * @param {string|number} id
   * @param {boolean} selected
   */
  setItemSelected(id, selected) {
    const items = this.getCart();
    const target = items.find(item => String(item.id) === String(id));
    if (target) {
      target.selected = Boolean(selected);
      this.saveCart(items);
    }
  },

  /**
   * 전체 상품 선택 여부 일괄 토글
   * @param {boolean} selected
   */
  setAllSelected(selected) {
    const items = this.getCart();
    items.forEach(item => {
      item.selected = Boolean(selected);
    });
    this.saveCart(items);
  },

  /**
   * 장바구니에서 특정 상품 삭제
   * @param {string|number} id
   * @param {string} option
   */
  removeFromCart(id, option = null) {
    let items = this.getCart();
    items = items.filter(
      item => !(String(item.id) === String(id) && (option === null || item.option === option))
    );
    this.saveCart(items);
  },

  /**
   * 선택된 상품 일괄 삭제
   */
  removeSelected() {
    let items = this.getCart();
    items = items.filter(item => !item.selected);
    this.saveCart(items);
  },

  /**
   * 장바구니 비우기
   */
  clearCart() {
    this.saveCart([]);
  },

  /**
   * 장바구니 총 담긴 수량(개수 합산) 조회
   * @returns {number}
   */
  getCartCount() {
    const items = this.getCart();
    return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  },

  /**
   * 장바구니 금액 합계 및 배송비 계산
   * @returns {{ itemsCount: number, selectedCount: number, subtotal: number, shippingFee: number, total: number }}
   */
  getCartSummary() {
    const items = this.getCart();
    const selectedItems = items.filter(item => item.selected !== false);

    const subtotal = selectedItems.reduce((sum, item) => {
      return sum + (Number(item.price) || 0) * (item.quantity || 1);
    }, 0);

    const shippingFee = (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) ? 0 : DEFAULT_SHIPPING_FEE;
    const total = subtotal + shippingFee;

    return {
      itemsCount: items.length,
      selectedCount: selectedItems.length,
      subtotal,
      shippingFee,
      total
    };
  },

  /**
   * 이벤트 알림 전파
   * @private
   */
  _notify() {
    window.dispatchEvent(new CustomEvent('vlast_cart_updated', {
      detail: {
        count: this.getCartCount(),
        summary: this.getCartSummary()
      }
    }));
  }
};

