# Designer Spec-Kit --- AI 협업형 웹사이트 디자인 시스템

> **문서 목적**: AI 디자인·프론트엔드 에이전트가 프로젝트의 시각적
> 기준과 UI 동작을 일관되게 해석하도록 돕는 실행 가능한 디자인 명세\
> **적용 범위**: Vanilla HTML / CSS / JavaScript 기반 웹사이트를
> 기본으로 하되, 특정 프레임워크에 종속되지 않음\
> **우선순위**: 사용자 요구사항 및 승인된 디자인 레퍼런스 → 프로젝트별
> 명세 → 본 공통 가이드

------------------------------------------------------------------------

## 0. AI 에이전트 작업 원칙

### 0.1 디자인 기준의 우선순위

디자인 구현 시 다음 우선순위를 반드시 지킨다.

1.  사용자가 명시한 요구사항 및 수정 지시
2.  사용자가 제공한 Figma, 이미지, URL, 기존 구현 화면 등 승인된
    레퍼런스
3.  프로젝트별 디자인 토큰 및 페이지 명세
4.  본 공통 디자인 가이드
5.  에이전트의 일반적인 디자인 관행

상위 기준과 하위 기준이 충돌하면 상위 기준을 따른다. 충돌이 결과에
중대한 영향을 주는 경우 임의로 결정하지 말고 질문하거나, 합리적인 가정을
명시한 뒤 진행한다.

### 0.2 레퍼런스 우선 구현

-   레퍼런스가 제공되면 색상, 글꼴, 크기, 간격, 정렬, 비율, 이미지 크롭,
    레이어, 인터랙션을 먼저 분석한다.
-   레퍼런스에 없는 디자인 요소를 임의로 추가하거나 과도하게 재해석하지
    않는다.
-   스크린샷은 특정 뷰포트의 결과물이다. 해당 화면의 픽셀값을 모든 화면
    크기에 고정 적용하지 말고 반응형 동작을 함께 추론한다.
-   이미지 자산이 제공되면 파일명과 실제 이미지를 확인하고, 의미가 맞는
    자산을 우선 사용한다. 유사 이미지를 임의로 대체하지 않는다.
-   정확한 폰트, 이미지, 아이콘 자산이 없으면 임의의 외부 자산을
    도입하지 말고 대체 가정을 보고한다.

### 0.3 디자인 변경 범위

-   요청된 페이지·섹션·컴포넌트만 수정한다.
-   요청과 무관한 기존 디자인, 카피, DOM 구조, 인터랙션은 보존한다.
-   전역 토큰 변경이 여러 페이지에 미치는 영향을 확인한 뒤 적용한다.
-   시각적 완성도를 이유로 정보 구조나 콘텐츠를 임의로 삭제·축약하지
    않는다.

------------------------------------------------------------------------

## 1. 디자인 토큰 및 CSS 변수 체계

모든 공통 디자인 값은 CSS Custom Properties로 관리한다. 토큰은 Primitive
→ Semantic → Component 순서로 구성한다. 아래 값은 시작 템플릿이며, 실제
프로젝트의 브랜드 가이드와 레퍼런스에 맞춰 확정한다.

### 1.1 토큰 설계 원칙

-   **Primitive**: 색상 팔레트, 간격, 글자 크기 등 원시 값
-   **Semantic**: 배경, 텍스트, 테두리, 인터랙션 등 의미 중심 값
-   **Component**: 특정 컴포넌트에서만 사용하는 값
-   컴포넌트 CSS에서 반복되는 임의의 색상·간격 값을 직접 사용하지 말고
    적절한 토큰을 참조한다.
-   모든 토큰을 무조건 사용하도록 강제하지 않는다. 실제 디자인에 필요한
    토큰만 정의하고 중복·미사용 토큰은 정리한다.

### 1.2 기본 토큰 예시

``` css
:root {
  /* Primitive: Neutral palette */
  --palette-white: #ffffff;
  --palette-black: #000000;
  --palette-gray-50: #fafafa;
  --palette-gray-100: #f4f4f5;
  --palette-gray-200: #e4e4e7;
  --palette-gray-300: #d4d4d8;
  --palette-gray-400: #a1a1aa;
  --palette-gray-500: #71717a;
  --palette-gray-600: #52525b;
  --palette-gray-700: #3f3f46;
  --palette-gray-800: #27272a;
  --palette-gray-900: #18181b;

  /* Primitive: Brand - 프로젝트 브랜드에 맞게 변경 */
  --palette-brand-500: #8b5cf6;
  --palette-brand-600: #7c3aed;
  --palette-brand-700: #6d28d9;

  /* Semantic colors */
  --color-bg: var(--palette-white);
  --color-bg-subtle: var(--palette-gray-50);
  --color-surface: var(--palette-white);
  --color-text: var(--palette-gray-900);
  --color-text-muted: var(--palette-gray-600);
  --color-text-disabled: var(--palette-gray-400);
  --color-border: var(--palette-gray-200);
  --color-border-strong: var(--palette-gray-400);
  --color-primary: var(--palette-brand-600);
  --color-primary-hover: var(--palette-brand-700);
  --color-focus: var(--palette-brand-600);
  --color-danger: #dc2626;
  --color-success: #15803d;
  --color-warning: #b45309;

  /* Typography */
  --font-family-base: Pretendard, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  --font-family-mono: "SFMono-Regular", Consolas, monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  --font-size-4xl: clamp(2.25rem, 4vw, 3.5rem);

  --line-height-tight: 1.2;
  --line-height-heading: 1.3;
  --line-height-body: 1.6;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing: 4px base scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;

  /* Layout */
  --container-max: 1200px;
  --container-gutter: clamp(1rem, 4vw, 2rem);
  --content-reading-max: 72ch;

  /* Shape */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* Elevation */
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 6%);
  --shadow-md: 0 4px 12px rgb(0 0 0 / 10%);
  --shadow-lg: 0 12px 32px rgb(0 0 0 / 14%);

  /* Motion */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);

  /* Layer: 프로젝트 전체에서 일관되게 관리 */
  --z-base: 0;
  --z-sticky: 100;
  --z-dropdown: 200;
  --z-backdrop: 300;
  --z-drawer: 400;
  --z-modal: 500;
  --z-toast: 600;
}
```

위 브랜드 색상은 예시일 뿐이다. 실제 프로젝트의 브랜드 컬러가 제공되면
반드시 교체한다. 색상 이름만 보고 대비가 충분하다고 가정하지 말고 실제
조합을 검증한다.

------------------------------------------------------------------------

## 2. 레이아웃 및 반응형 규칙

### 2.1 기본 원칙

-   고정된 디바이스 폭에만 맞추지 말고 콘텐츠가 자연스럽게 재배치되도록
    설계한다.
-   `px` 고정값은 테두리, 아이콘 등 필요한 곳에 제한적으로 사용한다.
    레이아웃 너비와 타이포그래피는 `%`, `rem`, `clamp()`, `minmax()`
    등을 우선 검토한다.
-   콘텐츠 컨테이너는 일반적으로
    `width: min(100% - 2 * gutter, max-width)` 패턴을 사용한다.
-   가로 스크롤은 디자인상 의도된 캐러셀 등을 제외하고 발생하지 않도록
    한다.
-   텍스트 줄바꿈, 긴 단어, 번역 길이 증가를 고려한다.

### 2.2 권장 반응형 기준

아래 브레이크포인트는 시작점이며, 실제 레이아웃이 무너지기 시작하는
지점에 맞춰 조정한다.

  구분                권장 범위 기본 가이드
  -------------- -------------- --------------------------------
  Small mobile         0--479px 단일 열, 핵심 콘텐츠 우선
  Mobile             480--767px 1--2열, 터치 조작 고려
  Tablet            768--1023px 콘텐츠에 따라 2--3열
  Desktop          1024--1439px 다단 레이아웃, 최대 너비 적용
  Wide desktop      1440px 이상 최대 콘텐츠 폭 유지, 여백 확장

``` css
.container {
  width: min(100% - 2 * var(--container-gutter), var(--container-max));
  margin-inline: auto;
}

@media (max-width: 767px) {
  /* 모바일에서 필요한 구조 변경만 선언 */
}

@media (min-width: 768px) and (max-width: 1023px) {
  /* 태블릿 레이아웃 */
}

@media (min-width: 1024px) {
  /* 데스크톱 레이아웃 */
}
```

### 2.3 반응형 검수 뷰포트

최소한 다음 폭에서 확인한다.

-   360px, 390px, 430px
-   768px, 820px
-   1024px, 1280px, 1440px
-   필요 시 1920px

특정 기기 프리셋에만 의존하지 말고 중간 폭에서도 레이아웃이 자연스러운지
확인한다.

------------------------------------------------------------------------

## 3. UI 컴포넌트 명세

컴포넌트는 실제 프로젝트에 존재하는 것만 정의한다. 아래는 전자상거래
화면을 예로 든 패턴이며, 다른 유형의 사이트에서는 해당 프로젝트에 필요한
컴포넌트로 대체한다.

### 3.1 공통 컴포넌트

각 컴포넌트는 다음 항목을 정의한다.

-   목적 및 사용 위치
-   구조와 콘텐츠 계층
-   크기 및 반응형 동작
-   Default / Hover / Focus / Active / Disabled / Loading / Error 상태
-   키보드 및 접근성 동작
-   모바일 터치 동작

### 3.2 카드형 콘텐츠

-   이미지 비율은 콘텐츠 특성에 맞춰 명시한다. 상품은 정사각형일 수
    있지만 기사·프로젝트·배너 이미지는 원본 비율을 따를 수 있다.
-   이미지가 잘리는 경우 `object-fit`과 `object-position`을 레퍼런스에
    맞춘다.
-   제목 말줄임은 정보 손실을 고려해 적용한다. 전체 제목을 확인할 수
    있는 접근 가능한 대안도 검토한다.
-   가격·수치에는 `font-variant-numeric: tabular-nums`를 사용할 수 있다.
-   Hover 효과는 포인터 환경에서만 제공하고, 핵심 정보나 기능을
    Hover에만 숨기지 않는다.
-   모바일에서는 Hover 대신 명확한 터치 상태를 제공한다.

### 3.3 헤더 및 내비게이션

-   헤더 높이, 고정 여부, 배경, 그림자, 스크롤 동작은 레퍼런스 또는
    페이지 명세에 따른다.
-   스크롤 방향에 따라 헤더를 숨기는 동작은 필수 규칙이 아니다. 사용성이
    확인된 경우에만 적용한다.
-   모바일 메뉴는 열기·닫기 버튼, 메뉴 열림 상태, 포커스 이동, Escape
    닫기, 배경 스크롤 처리 기준을 정의한다.
-   현재 페이지 또는 현재 메뉴는 시각적 표시와 `aria-current` 등 의미
    정보를 함께 제공한다.

### 3.4 Drawer / Modal

-   열림·닫힘 상태와 배경 오버레이를 명확히 구분한다.
-   열릴 때 적절한 요소로 포커스를 이동하고, 닫힐 때 호출한 요소로
    포커스를 복귀한다.
-   모달은 내부 포커스가 바깥으로 이동하지 않도록 관리한다.
-   Escape 닫기, 닫기 버튼, 배경 클릭 허용 여부를 명세한다.
-   열려 있는 동안 배경 콘텐츠가 키보드로 조작되지 않도록 한다.
-   모바일에서는 화면 높이, 안전 영역, 스크롤 영역을 고려한다.

------------------------------------------------------------------------

## 4. 인터랙션 및 상태 설계

모든 인터랙션은 시각적 표현과 실제 기능이 일치해야 한다.

  상태               디자인 기준
  ------------------ ----------------------------------------
  Default            기본 상태
  Hover              포인터 환경에서만 제공하는 보조 피드백
  Focus-visible      키보드 탐색 시 식별 가능한 포커스 표시
  Active / Pressed   누르는 동안의 피드백
  Disabled           조작 불가 상태와 이유가 명확해야 함
  Loading            중복 실행 방지 및 진행 상태 전달
  Empty              데이터가 없을 때의 안내 및 다음 행동
  Error              문제 설명과 복구 가능한 행동 제공
  Success            작업 완료 여부를 명확하게 전달

-   Disabled 상태를 단순히 투명도만 낮춰 표현하지 않는다. 텍스트 대비와
    상태 인식 가능성을 유지한다.
-   로딩 중에는 레이아웃이 갑자기 변하지 않도록 한다.
-   Skeleton은 실제 콘텐츠의 형태와 가까운 경우에만 사용한다.
-   애니메이션은 목적이 있을 때만 사용하고 과도한 움직임을 피한다.

------------------------------------------------------------------------

## 5. 접근성 기준

기본 목표는 WCAG 2.2 AA 수준을 지향한다. 법적·인증상 준수 여부를
보장하는 표현은 실제 평가를 거친 경우에만 사용한다.

1.  일반 텍스트 대비는 최소 4.5:1, 큰 텍스트는 최소 3:1을 목표로 한다.
2.  의미 있는 UI 경계와 그래픽 요소는 주변 색상과 충분히 구분한다.
3.  모든 기능은 키보드로 접근·조작할 수 있어야 한다.
4.  포커스 표시를 제거하지 않는다.
5.  입력 요소에는 시각적 레이블과 프로그램적으로 연결된 이름을 제공한다.
6.  이미지 대체 텍스트는 정보 이미지에 제공하고 장식 이미지는 빈
    `alt=""`를 사용한다.
7.  색상만으로 오류·성공·선택 상태를 전달하지 않는다.
8.  터치 대상은 가능한 한 44×44 CSS px 이상을 목표로 한다. 불가피한
    예외는 주변 간격을 확보한다.
9.  `prefers-reduced-motion: reduce`를 지원한다.
10. 제목 계층, 랜드마크, 링크·버튼의 의미를 올바르게 사용한다.

``` css
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

------------------------------------------------------------------------

## 6. 이미지 및 미디어 가이드

-   제공된 원본 자산을 우선 사용하고 임의로 유사 이미지로 교체하지
    않는다.
-   이미지의 목적에 따라 `cover` / `contain`을 선택한다.
-   이미지 비율 또는 `width`·`height`를 지정해 레이아웃 이동을 줄인다.
-   첫 화면의 핵심 이미지에는 무조건 lazy loading을 적용하지 않는다.
    화면 아래 이미지에 `loading="lazy"`를 적용한다.
-   장식 이미지와 정보 이미지의 대체 텍스트 정책을 구분한다.
-   영상·애니메이션은 대체 콘텐츠, 자동 재생 여부, 음소거, 사용자 제어를
    고려한다.

------------------------------------------------------------------------

## 7. 디자인 QA 체크리스트

구현 완료 전 다음 항목을 확인한다.

-   [ ] 승인된 레퍼런스의 레이아웃·색상·타이포그래피·이미지 비율을
    반영했는가?
-   [ ] 디자인 토큰과 컴포넌트 스타일이 일관적인가?
-   [ ] 지정한 주요 뷰포트와 중간 폭에서 레이아웃이 깨지지 않는가?
-   [ ] 가로 스크롤, 텍스트 잘림, 겹침, 이미지 왜곡이 없는가?
-   [ ] Hover / Focus / Active / Disabled / Loading / Error 상태가
    적절한가?
-   [ ] 키보드 탐색과 포커스 표시가 정상 동작하는가?
-   [ ] 색상 대비와 대체 텍스트를 확인했는가?
-   [ ] 모션 감소 설정을 존중하는가?
-   [ ] 기존 페이지의 비요청 영역을 불필요하게 변경하지 않았는가?

## 8. 완료 보고 형식

AI 에이전트는 작업 후 다음 내용을 간단히 보고한다.

1.  수정한 페이지·컴포넌트
2.  주요 디자인 변경 사항
3.  적용한 반응형 기준
4.  접근성 및 시각 QA 결과
5.  미검증 항목과 남은 이슈
6.  디자인 레퍼런스와 다르게 처리한 부분 및 그 이유
