# 🚀 VLAST SHOP 벤치마킹 프론트엔드 개발 마스터 문서 (Vibe Coding 통합 가이드)

본 문서는 **VLAST SHOP(vlastshop.com)**을 벤치마킹하여 프론트엔드 서비스를 바이브코딩(Vibe Coding) 방식으로 신속하고 일관성 있게 구현하기 위한 **통합 PRD 및 AI Agent 실행 가이드라인**입니다.

---

## 📌 목차
1. [전체 PRD (Total PRD)](#1-전체-prd-total-prd)
2. [프론트엔드 개발용 PRD (Frontend PRD)](#2-프론트엔드-개발용-prd-frontend-prd)
3. [실행용 PRD 요약 문서 (Execution Summary)](#3-실행용-prd-요약-문서-execution-summary)
4. [개발용 AI Agent 가이드라인 (Dev AI Agent)](#4-개발용-ai-agent-가이드라인-dev-ai-agent)
5. [디자이너 에이전트 가이드라인 (Designer Agent)](#5-디자이너-에이전트-가이드라인-designer-agent)
6. [개발자용 에이전트 가이드라인 (Developer Agent)](#6-개발자용-에이전트-가이드라인-developer-agent)

---

## 1. 전체 PRD (Total PRD)

### 1.1 서비스 개요
- **서비스명**: VLAST SHOP 벤치마킹 글로벌 팬덤 이커머스
- **목적**: 버추얼 아이돌 공식 MD, 앨범, 생일 키트(Birthday Kit), 팬클럽 한정 상품 등의 판매 및 예약 주문을 지원하는 최적화된 이커머스 플랫폼 구축.
- **주요 타겟**: 글로벌 K-POP 및 버추얼 팬덤 유저 (모바일 사용 비중 80% 이상).
- **핵심 가치**:
  - 높은 대역폭과 트래픽 대응을 고려한 빠른 로딩 스피드.
  - 한정판 및 예약 판매 상품에 대한 명확한 옵션/상태 표시.
  - 글로벌 유저 대응 (다국어/다통화 확장성 고려 UI).

### 1.2 비즈니스 프로세스 & 유저 플로우
1. **메인 탐색**: 메인 배너 슬라이더 -> 카테고리별/신상품/베스트셀러 그리드 확인.
2. **상품 탐색**: 카테고리 필터링 -> 정렬(신상품순, 인기순, 가격순).
3. **상품 상세**: 이미지 갤러리 확인 -> 버전/옵션 선택 -> 수량 설정 -> [장바구니] 또는 [바로 구매].
4. **장바구니/주문**: 선택 상품 확인 -> 결제 정보 입력 -> 주문 완료.
5. **마이페이지**: 주문 내역 조회 및 배송 상태 추적.

---

## 2. 프론트엔드 개발용 PRD (Frontend PRD)

### 2.1 기술 스택 (Tech Stack)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **State Management**: Zustand (전역 상태 및 장바구니), TanStack Query v5 (서버 데이터 페칭)
- **UI Components**: Radix UI / shadcn/ui 기반 커스텀

### 2.2 페이지 라우팅 및 컴포넌트 명세

| 경로 (Path) | 페이지 명 | 핵심 컴포넌트 및 기능 |
| :--- | :--- | :--- |
| `/` | 메인 홈 | `MainHeroBanner`, `CategoryNav`, `ProductGrid`, `BannerSection` |
| `/shop` | 상품 카탈로그 | `CategoryFilter`, `SortDropdown`, `ProductCard`, `Pagination` |
| `/shop/[id]` | 상품 상세 | `ImageGallery`, `ProductOptionsSelector`, `QuantityPicker`, `TabInfo` |
| `/cart` | 장바구니 | `CartItemList`, `CartSummary`, `CheckoutButton` |
| `/checkout` | 주문/결제 | `ShippingForm`, `PaymentMethodSelector`, `OrderSummary` |
| `/mypage` | 마이페이지 | `UserProfile`, `OrderHistoryList`, `WishlistGrid` |

### 2.3 핵심 프론트엔드 인터랙션 요구사항
- **Sticky Header**: 스크롤 시 상단 고정, 로고, 검색, 장바구니 카운터 배지 표시.
- **Option Selector**: 앨범 버전 선택 시 해당 이미지 동적 변경 및 단가 반영.
- **Cart Drawer / Modal**: 상품을 장바구니에 담을 때 즉시 사이드 슬라이드 뷰로 장바구니 요약 표시.
- **Skeleton Loading**: 데이터 페칭 중 상품 카드 및 상세 페이지 스켈레톤 적용.

---

## 3. 실행용 PRD 요약 문서 (Execution Summary)

### 3.1 개발 순서 및 마일스톤 (MVP 기준)

```
[Phase 1] Layout & Base System (1-2일)
  ├── 공통 Header / Footer 컴포넌트 구축
  └── Tailwind design system (컬러, 폰트) 정의

[Phase 2] Main & Product Catalog (2-3일)
  ├── 메인 페이지 캐러셀 및 상품 목록 그리드 구현
  └── 카테고리 필터 및 정렬 인터랙션 완성

[Phase 3] Product Detail & State Management (2-3일)
  ├── 상품 상세 옵션 선택기 및 수량 제어 logic
  └── Zustand 기반 장바구니 전역 상태 연동

[Phase 4] Cart & Responsive Polish (1-2일)
  ├── 장바구니 페이지 및 사이드 드로어 UI
  └── 모바일/태블릿 반응형 브레이크포인트 검증 및 최종 다듬기
```

### 3.2 MVP 핵심 체크리스트
- [ ] 반응형 헤더 (모바일 햄버거 메뉴, 데스크톱 풀 메뉴)
- [ ] 메인 슬라이드 배너 (Auto-play 및 Swiper/Framer Motion 적용)
- [ ] 상품 목록 카드의 호버 이미지 전환 효과
- [ ] 상품 상세 옵션 셀렉터 (품절 상태 UI 분기 포함)
- [ ] 장바구니 담기, 수량 변경, 삭제 및 총 금액 자동 계산

---

## 4. 개발용 AI Agent 가이드라인 (Dev AI Agent)

### 4.1 AI Agent Prompt Context Rules
> **Role**: 당신은 Next.js 및 Tailwind CSS 전문 프론트엔드 리드 엔지니어입니다.  
> **Goal**: VLAST SHOP 스타일의 미니멀하고 세련된 팬덤 이커머스를 구축합니다.

### 4.2 실행 및 코드 작성 수칙
1. **Type Safety**: 모든 컴포넌트와 Props는 엄격하게 TypeScript interface/type을 지정한다. (`any` 사용 금지)
2. **Client vs Server Components**:
   - 상태 변경, 이벤트를 다루는 요소(`useState`, `onClick` 등)는 파일 상단에 `'use client';`를 명시한다.
   - 레이아웃 및 단순 데이터 표시 컴포넌트는 Server Component를 기본으로 한다.
3. **Tailwind First**: 인라인 스타일 대신 Tailwind CSS 클래스를 사용하며, 가독성을 위해 복잡한 조건부 클래스는 `cn()` (clsx + tailwind-merge) 패턴을 활용한다.
4. **Clean Code**: 함수는 단일 책임을 가지며, 컴포넌트당 150줄을 넘지 않도록 적절히 분리한다.

---

## 5. 디자이너 에이전트 가이드라인 (Designer Agent)

### 5.1 브랜드 디자인 토큰 (Design Tokens)

```json
{
  "colors": {
    "primary": "#0A0A0A",
    "primary-foreground": "#FFFFFF",
    "accent": "#6D28D9",
    "accent-light": "#8B5CF6",
    "background": "#FFFFFF",
    "surface": "#F4F4F5",
    "muted": "#71717A",
    "border": "#E4E4E7"
  },
  "fonts": {
    "sans": ["Pretendard", "Inter", "sans-serif"]
  },
  "borderRadius": {
    "card": "8px",
    "button": "6px",
    "badge": "9999px"
  }
}
```

### 5.2 UI/UX 디자인 가이드
- **레이아웃 비주얼**: 고화질 그래픽과 앨범 커버가 돋보이도록 배경은 깔끔한 White/Off-White를 유지하고, Text는 High-Contrast Black을 사용.
- **버튼 스타일**:
  - Primary Button: Full Black background + White text (`hover:bg-zinc-800`).
  - Secondary Button: Outline border (`border-zinc-300 hover:bg-zinc-100`).
- **상품 카드 (Product Card)**:
  - 1:1 정방향 상품 이미지 스퀘어 비율 유지.
  - 뱃지 태그 (`[BEST]`, `[PRE-ORDER]`, `[SOLD OUT]`)는 좌측 상단 배치.

---

## 6. 개발자용 에이전트 가이드라인 (Developer Agent)

### 6.1 표준 프로젝트 디렉토리 구조

```text
src/
├── app/
│   ├── layout.tsx             # Root Layout (Header, Footer, Providers)
│   ├── page.tsx               # Main Home Page
│   ├── shop/
│   │   ├── page.tsx           # Product Catalog Page
│   │   └── [id]/page.tsx      # Product Detail Page
│   └── cart/page.tsx          # Cart Page
├── components/
│   ├── common/                # Header, Footer, Modal, Button 등
│   ├── main/                  # HeroBanner, CategorySection
│   └── product/               # ProductCard, OptionSelector, QuantityPicker
├── hooks/                     # useCart, useProductFilter 등
├── store/                     # useCartStore.ts (Zustand)
├── types/                     # product.ts, cart.ts
└── lib/                       # utils.ts (cn, formatPrice 등)
```

### 6.2 데이터 구조 및 타입 정의예시 (TypeScript)

```typescript
// types/product.ts
export type ProductStatus = 'AVAILABLE' | 'PRE_ORDER' | 'SOLD_OUT';

export interface ProductOption {
  id: string;
  name: string; // 예: "VER 1. BLUE", "VER 2. RED"
  priceOffset: number;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'ALBUM' | 'OFFICIAL_MD' | 'BIRTHDAY_KIT';
  status: ProductStatus;
  images: string[];
  options?: ProductOption[];
  isBest?: boolean;
  isNew?: boolean;
}

// store/useCartStore.ts (Zustand)
import { create } from 'zustand';

interface CartItem {
  product: Product;
  selectedOption?: ProductOption;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, option?: ProductOption, quantity?: number) => void;
  removeFromCart: (productId: string, optionId?: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (product, option, quantity = 1) =>
    set((state) => {
      // 장바구니 추가 로직 구현
      return { items: [...state.items, { product, selectedOption: option, quantity }] };
    }),
  removeFromCart: (productId, optionId) =>
    set((state) => ({
      items: state.items.filter(
        (item) => !(item.product.id === productId && item.selectedOption?.id === optionId)
      ),
    })),
  clearCart: () => set({ items: [] }),
}));
```

### 6.3 AI 프롬프트 지시어 패턴 (Vibe Coding 명령어)
AI 개발 도구 사용 시 아래 패턴으로 요청을 실행합니다:

> **[Prompt Template]**  
> "위 PRD의 **[특정 컴포넌트/페이지]**를 작성해 줘. `@types/product.ts` 및 `@store/useCartStore.ts` 구조를 참조하고, Tailwind CSS로 스타일링해 줘. 모바일 대응을 위한 반응형 클래스도 포함해 줘."