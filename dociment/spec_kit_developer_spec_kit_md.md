# 💻 Developer Spec-Kit (Vanilla HTML/CSS/JS Project)

## 1. Project Directory Structure

순수 HTML, CSS, JS 기반 프론트엔드 프로젝트 표준 구조입니다.

```text
vlast-shop-vanilla/
├── index.html              # 메인 랜딩 페이지 (슬라이더, 베스트/신상품)
├── shop.html               # 상품 카탈로그 (필터링, 정렬)
├── product-detail.html     # 상품 상세 (옵션 선택, 수량 조절)
├── cart.html               # 장바구니 페이지
├── assets/
│   ├── css/
│   │   ├── style.css       # global 스타일 & CSS Variables
│   │   ├── components.css  # 버튼, 카드, 뱃지 등 공통 컴포넌트
│   │   └── pages/          # 페이지별 독립 스타일
│   ├── js/
│   │   ├── app.js          # 전역 초기화, 공통 Header/Drawer 인터랙션
│   │   ├── data.js         # Mock 상품 데이터 모듈
│   │   ├── cart.js         # LocalStorage 기반 장바구니 비즈니스 로직
│   │   └── pages/          # 페이지별 전용 스크립트 (shop.js, detail.js 등)
│   └── images/             # 정적 이미지 자원
└── README.md
```

---

## 2. Mock Data Schema (`assets/js/data.js`)

AI 에이전트가 렌더링 및 상태 테스트용으로 참조할 표준 데이터 스펙입니다.

```javascript
const PRODUCTS_DATA = [
  {
    id: "prod-001",
    title: "PLAVE 2nd Mini Album 'ASTERUM : 134-1'",
    category: "ALBUM",
    price: 17800,
    status: "PRE_ORDER", // "AVAILABLE" | "PRE_ORDER" | "SOLD_OUT"
    isBest: true,
    isNew: true,
    images: [
      "./assets/images/album_front.jpg",
      "./assets/images/album_back.jpg"
    ],
    options: [
      { id: "opt-01", name: "PMINI VER.", priceOffset: 0, stock: 100 },
      { id: "opt-02", name: "SET VER.", priceOffset: 15000, stock: 30 }
    ],
    description: "플레이브 미니 2집 앨범 예약 판매 공식 MD입니다."
  }
];
```

---

## 3. Standard State Management Pattern (LocalStorage + Event Bus)

프레임워크 없이 장바구니 상태 및 UI 변경을 동기화하기 위한 JS 모듈 패턴입니다.

### `assets/js/cart.js` (장바구니 모듈 스펙)
```javascript
const CART_STORAGE_KEY = 'vlast_cart_items';

export const CartManager = {
  getItems() {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  },

  addItem(productId, optionId, quantity = 1) {
    const items = this.getItems();
    const existingIndex = items.findIndex(
      item => item.productId === productId && item.optionId === optionId
    );

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({ productId, optionId, quantity });
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    this.notifyChange();
  },

  removeItem(productId, optionId) {
    let items = this.getItems();
    items = items.filter(
      item => !(item.productId === productId && item.optionId === optionId)
    );
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    this.notifyChange();
  },

  getTotalCount() {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  },

  notifyChange() {
    window.dispatchEvent(new CustomEvent('cart-updated', { 
      detail: { count: this.getTotalCount(), items: this.getItems() } 
    }));
  }
};
```

---

## 4. DOM Manipulation & Event Handling Guidelines for AI Agents

1. **Modular Components**:
   * HTML 카드는 JavaScript template string 및 `insertAdjacentHTML` / DOM 조작을 통해 동적으로 생성합니다.
   * Event Delegation Pattern(이벤트 위임)을 활용해 dynamically rendered 요소의 클릭 이벤트를 부모 요소에서 처리합니다.

2. **DOM Event Handler Convention**:
```javascript
// Example: 상품 카탈로그 동적 렌더링 및 이벤트 바인딩
document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.querySelector('#product-grid');
  
  if (productGrid) {
    renderProducts(PRODUCTS_DATA, productGrid);
    
    // Event Delegation
    productGrid.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.btn-add-cart');
      if (addBtn) {
        const productId = addBtn.dataset.id;
        CartManager.addItem(productId, null, 1);
      }
    });
  }
});
```

3. **CSS Class Toggling Policy**:
   * UI 상태 변경(모달 열림, 드로어 표시, 아코디언 확장) 시 인라인 스타일 조작 대신 `.is-active`, `.is-open`, `.is-hidden` 클래스 토글 방식을 사용합니다.