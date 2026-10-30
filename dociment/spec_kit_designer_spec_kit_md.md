# 🎨 Designer Spec-Kit (Vanilla HTML/CSS/JS Project)

## 1. Design Tokens & CSS Variables (`style.css` 정의용)

AI 에이전트가 `style.css` 상단 `:root`에 적용할 표준 디자인 토큰 규격입니다.

```css
:root {
  /* Color Palette - High-Contrast Dark & Light Minimal */
  --color-primary: #0a0a0a;
  --color-primary-hover: #27272a;
  --color-secondary: #f4f4f5;
  --color-accent: #6d28d9;
  --color-accent-hover: #5b21b6;
  --color-background: #ffffff;
  --color-surface: #fafafa;
  --color-text-main: #18181b;
  --color-text-muted: #71717a;
  --color-border: #e4e4e7;
  --color-badge-preorder: #3b82f6;
  --color-badge-soldout: #ef4444;

  /* Typography */
  --font-family-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 2rem;      /* 32px */

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadow & Transition */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --transition-fast: all 0.15s ease;
  --transition-normal: all 0.25s ease;
}
```

---

## 2. Layout & Responsive Breakpoints

* **Mobile-First Layout Grid**:
  * Breakpoints:
    * Mobile: `< 768px` (1~2 컬럼 상품 그리드)
    * Tablet: `768px ~ 1024px` (3 컬럼 상품 그리드)
    * Desktop: `> 1024px` (4 컬럼 상품 그리드, 최대 너비 1200px 중앙 정렬)

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}
```

---

## 3. Core UI Component Specifications

### 3.1 Product Card Spec
* **Aspect Ratio**: 이미지 영역 `1:1` 정방향 비율 (`aspect-ratio: 1 / 1`)
* **Hover Interaction**:
  * 호버 시 이미지 `scale(1.03)` 확대 효과 (`transition: transform var(--transition-normal)`)
  * 이미지 2장 보유 시 호버할 때 서브 이미지로 Fade/Crossfade 전환
* **Badges**:
  * Card 좌측 상단에 `absolute` 위치 지정
  * Standard Size: Font-size `12px`, Padding `4px 8px`, Radius `4px`

### 3.2 Header & Navigation Spec
* **Sticky Positioning**: `position: sticky; top: 0; z-index: 100;`
* **Glassmorphism Style**: `background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(8px); border-bottom: 1px solid var(--color-border);`
* **Cart Badge**: 장바구니 아이콘 우측 상단에 아이템 개수를 나타내는 원형 뱃지 배치 (`var(--color-accent)`)

### 3.3 Slide Drawer (Cart Drawer) Spec
* 화면 우측에서 슬라이드하여 나타나는 모달 드로어
* Background Overlay: `rgba(0, 0, 0, 0.5)`
* Slide Animation: `transform: translateX(100%)` -> `transform: translateX(0)`