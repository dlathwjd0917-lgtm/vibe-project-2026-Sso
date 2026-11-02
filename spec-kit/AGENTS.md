# AGENTS.md — VLAST SHOP 웹 프로젝트 개발 규약

> **적용 대상**: HTML / CSS / Vanilla JS 기반 웹사이트 (빌드 도구·프레임워크 없음이 기본)
> **타겟 사이트**: https://vlastshop.com (디자인 동일 / 내부 레이아웃은 **Part S 규칙**으로 재구성)
> **규칙 우선순위**: **Part S(사이트 특화) > Part 1·2(일반)**
> **작성 기준**: 15년차 시니어 웹디자이너 · 시니어 웹개발자의 실무 표준
> **독자**: 이 프로젝트에서 코드를 작성하는 모든 AI 에이전트와 사람

---

## 0. 에이전트 필독 — 작업 원칙

규칙 표기: **MUST**(반드시) / **MUST NOT**(절대 금지) / **SHOULD**(특별한 이유 없으면 따름)

0. **레이아웃은 반드시 Part S.1** (겉박스 > `.inner-box` > 파티션 박스)을 따른다. 타겟 사이트의 마크업·클래스를 복사하지 않는다.
1. **작업 전**: 기존 파일을 먼저 읽고, 이미 있는 토큰·컴포넌트·유틸을 재사용한다. 새로 만들기 전에 검색한다.
2. **디자인 값은 하드코딩 금지**: 색상·간격·폰트 크기·그림자·반경은 반드시 `tokens.css`의 CSS 변수만 사용한다.
3. **요청 범위만 수정**: 요청하지 않은 파일의 리팩터링·포맷 변경·의존성 추가 금지.
4. **모르면 가정하지 말고 명시**: 불확실한 요구사항은 가정을 응답 첫머리에 한 줄로 적고 진행한다.
5. **완료 정의(DoD)**: 작업 종료 전 본 문서 [Part 3 체크리스트](#part-3-공통-체크리스트-definition-of-done)와 **Part S.7**을 통과해야 한다.
5-1. **PROVISIONAL / MEASURE 값**은 임의로 확정하지 않는다. Part S.0 참조.
6. **규칙 충돌 시 우선순위**: 접근성 > 보안 > 성능 > 디자인 일관성 > 개발 편의성.
7. **규칙 변경**: 규칙을 어겨야 하는 상황이면 임의로 어기지 말고, 이유를 주석(`/* RULE-EXCEPTION: 사유 */`)으로 남긴다.

---

# PART S. 사이트 특화 규약 — VLAST SHOP (vlastshop.com)

> **우선순위**: 이 파트(Part S)는 Part 1·2의 일반 규칙보다 **우선**한다. 충돌 시 Part S를 따른다.
> **구현 원칙**: 디자인(색·글자·박스 수치·컴포넌트 모양)은 타겟 사이트와 **동일**하게, 내부 레이아웃 구조는 **아래 S.1 규칙**으로 **새로 구성**한다.
> 타겟 사이트의 마크업·클래스명(Cafe24 스킨)은 **복사하지 않는다.** 보이는 결과(수치·색·글자)만 재현한다.
> **분석 근거**: 사이트 HTML + 폰트/슬라이더/팝업 CSS 소스 분석(v1.2). Cafe24 본 CSS는 미제공 → 해당 값은 ❓ MEASURE (S.0, 부록 S-A 참조).

## S.0 값의 신뢰 등급 (에이전트 필독)

이 문서의 수치는 아래 등급으로 표기한다. **등급이 없는 값은 확정값이다.**

| 표기 | 의미 | 에이전트 행동 |
|---|---|---|
| ✅ **CONFIRMED** | 프로젝트 규칙으로 확정되었거나, 타겟 사이트 **소스(HTML/CSS)에서 직접 확인**된 값 | 그대로 사용 |
| ⚠️ **PROVISIONAL** | 실측 전 임시값 | 사용은 하되 `tokens.css`에 `/* PROVISIONAL */` 주석 유지. 실측값이 제공되면 **즉시 교체** |
| ❓ **MEASURE** | 소스에 없어 실측 필요 | 임의로 만들지 말고 사용자에게 실측값 요청. 임시값을 쓰면 `/* MEASURE */` 주석 필수 |

**분석 입력 현황 (v1.2 기준)**

| 소스 | 상태 | 비고 |
|---|---|---|
| 메인 페이지 HTML (렌더링 후 저장본) | ✅ 분석 완료 | 구조·인라인 스타일·슬라이더 설정·상품 카드 마크업 |
| `SpoqaHanSansNeo.css` | ✅ 분석 완료 | 폰트 패밀리·굵기 |
| `jquery.bxslider.css` | ✅ 분석 완료 | 배너 슬라이더(페이저·화살표) 수치 |
| `smart-popup.slick.css` | ✅ 분석 완료 | 팝업 수치(반경·그림자·테두리) |
| **`optimizer.php`, `optimizer_user.php`, `front.css`** (Cafe24 테마 본 CSS) | ❌ **미제공** | 헤더·GNB·상품 그리드·푸터의 **패딩/마진/글자크기/색**이 여기에 있음 → **대부분 ❓ MEASURE 유지** |
| Google Fonts `css2` 3종 | ❌ 미제공 | 어떤 폰트인지 불명 (소스에 theme03/theme04 주석만 있음) |

- **MUST NOT** 임시값을 확정값처럼 다른 파일에 하드코딩 (모든 값은 `tokens.css` 경유).
- 미제공 CSS 파일(`optimizer.php` 등)이 전달되면 S.3~S.5의 ❓/⚠️ 항목을 확정값으로 갱신한다. (전달 방법은 부록 S-A)

## S.1 레이아웃 규약 (확정 ✅)

### S.1.1 박스 계층 — 3단계 단순 구조

```
겉박스 (Outer)         : header / main > section / footer      ← 페이지 전체 구조
 └ 속박스 (Inner)       : .inner-box                            ← 폭 제한 + 중앙 정렬
    └ 파티션 박스 (Partition) : flex 컨테이너                    ← 가로/세로 분할
       └ 내용 박스 (Content)  : 실제 콘텐츠 (필요 시 grid 허용)
```

| 단계 | 대상 | 역할 |
|---|---|---|
| **겉박스** | `header`, `main > section`, `footer` | 배경색/배경이미지, 섹션 단위 상하 패딩, 전체폭(100%) |
| **속박스** | `.inner-box` | `max-width` 적용 + 좌우 중앙 정렬 + 좌우 거터 |
| **파티션 박스** | `.inner-box`의 직계 자식 | 영역 분할 (`display:flex`) |
| **내용 박스** | 파티션의 자식 | 텍스트·이미지·카드 등 실제 콘텐츠 |

### S.1.2 겉박스 규칙

- **MUST** 페이지 전체 구조는 `header` + (`main` > `section`) + `footer` **만** 사용한다.
- `main`의 직계 자식은 **`section`만** 허용한다. (`div` 직접 삽입 금지)
- 겉박스는 **전체 폭(100%)**이며 `max-width`를 걸지 않는다. 폭 제한은 속박스 담당.
- 겉박스 하나당 속박스는 **정확히 1개**(`.inner-box`)를 직계 자식으로 둔다.
- 섹션 배경이 전체 폭으로 깔려야 하는 경우도 겉박스에 배경을 준다.

```html
<body>
  <header class="site-header">
    <div class="inner-box">…파티션 박스들…</div>
  </header>

  <main id="main">
    <section class="section-visual" aria-label="메인 배너">
      <div class="inner-box">…</div>
    </section>
    <section class="section-new" aria-labelledby="new-title">
      <div class="inner-box">…</div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="inner-box">…</div>
  </footer>
</body>
```

### S.1.3 속박스 규칙 — `.inner-box`

- **MUST** 이름은 **`.inner-box`로 일원화**한다. (`.container`, `.wrap`, `.inner`, `.wrapper` 등 변형명 **금지**)
- **MUST** `max-width` 적용 + 좌우 `margin-inline: auto` 중앙 정렬.
- **MUST** `max-width`는 `--inner-max` 토큰 사용. **사이트에서 실측값이 확인되지 않으면 `1920px`로 설정**한다. (현재 상태: 실측 전 → **1920px 적용**)
- 모든 `.inner-box`는 **동일한 max-width**를 쓴다. 섹션별로 다른 폭이 필요하면 **modifier 없이** 파티션 박스/내용 박스에서 해결한다. (예외 필요 시 `RULE-EXCEPTION` 주석)
- `.inner-box`에는 `display`를 지정하지 않는다(block 유지). 분할은 파티션 박스의 일.
- `.inner-box`는 **중첩 금지** (`.inner-box` 안에 `.inner-box` 없음).
- 좌우 패딩(거터) `padding-inline: var(--inner-gutter)` 는 `.inner-box`에만 둔다.

```css
.inner-box {
  width: 100%;
  max-width: var(--inner-max);   /* 실측 전 기본값 1920px */
  margin-inline: auto;
  padding-inline: var(--inner-gutter);
  box-sizing: border-box;
}
```

### S.1.4 파티션 박스 규칙

- **MUST** 파티션 박스는 **`display: flex`**를 기본으로 한다.
- **줄바꿈이 필요한 내용**(상품 목록, 태그, 링크 모음 등)은 **`flex-wrap: wrap`**을 적용한다. 줄바꿈이 필요 없는 영역(헤더 한 줄, 로고+메뉴)은 `nowrap`(기본값) 유지.
- **MUST NOT** 파티션 박스를 **Grid로 만들지 않는다.** (`display: grid` 금지)
- **Grid는 내용 박스에서 필요한 경우에만** 허용한다 (예: 폼 라벨-입력 정렬, 스펙 표 형태).
- 간격은 `gap` 사용 (자식 `margin` 으로 간격 만들지 않는다).
- 폭 분배는 `flex: 0 0 <값>` / `flex: 1 1 0` / `width` 로 지정. 비율은 토큰화한다.
- N열 카드 배치(flex-wrap) 표준 패턴 — `gap`을 고려한 `calc()` 사용:

```css
.partition { display: flex; flex-wrap: wrap; gap: var(--gap-card); }
.partition > .item {
  flex: 0 0 calc((100% - var(--gap-card) * (var(--cols) - 1)) / var(--cols));
  min-width: 0;                 /* 내용 넘침 방지 */
}
/* 반응형: --cols 값만 바꾼다 */
.partition { --cols: 2; }
@media (min-width: 768px)  { .partition { --cols: 3; } }
@media (min-width: 1024px) { .partition { --cols: 4; } }
```

- 마지막 줄 정렬이 어긋나면(항목 수 < 열 수) `justify-content: flex-start` 유지(기본값). `space-between` 으로 마지막 줄이 퍼지는 구성 금지.
- 세로 쌓기는 `flex-direction: column` 파티션 사용.
- 파티션 박스의 직계 자식 = **내용 박스**. 파티션 안에 파티션을 **2단계 이상 중첩하지 않는다.** (복잡하면 내용 박스로 내린다)

### S.1.5 네이밍 (이 프로젝트 전용)

| 구분 | 규칙 | 예 |
|---|---|---|
| 겉박스 | `site-header`, `site-footer`, `section-<이름>` | `section-new` |
| 속박스 | **`.inner-box` 고정** | `.inner-box` |
| 파티션 박스 | `<블록>__part` / `<블록>__part--<역할>` | `new__part`, `header__part--utility` |
| 내용 박스 | `<블록>__<요소>` (BEM) | `new__item`, `header__logo` |

### S.1.6 금지 요약

| 금지 | 이유 |
|---|---|
| `.container/.wrap/.inner` 등 속박스 별칭 | `.inner-box` 일원화 |
| `main > div` | main 직계는 section만 |
| 파티션 박스에 `display:grid` | 파티션은 flex 전용 |
| `.inner-box` 중첩 | 박스 구조 단순화 |
| 겉박스에 `max-width` | 폭 제한은 속박스 전담 |
| float / table 레이아웃 | 일반 규칙 |

## S.2 타겟 사이트 구성 요소 (소스 확인 ✅)

디자인은 동일하게, 배치는 S.1 구조로 재구성한다. **원본 클래스명(Cafe24 스킨)은 복사하지 않고, 아래 매핑 표의 우리 클래스명을 쓴다.**

### S.2.1 영역별 구성

| 영역 | 겉박스 | 확인된 구성 요소 |
|---|---|---|
| **프로모션 바** | `header` 최상단 | 문구 링크("첫 쇼핑을 지원하는 3,000원 할인 회원가입 쿠폰", **검정·보통 굵기**), "오늘 하루 보지 않기" 체크박스+라벨, 닫기 아이콘. **기본 `display:none`, JS가 쿠키 확인 후 표시** |
| **유틸리티 라인** | `header` | **PC 전용**. 좌: 언어 선택(토글 버튼 + 한국어/English/日本語/中文 목록, 서브도메인 `en.`/`jp.`/`cn.`로 이동), 우: 회원가입·로그인·주문조회·최근본상품 |
| **로고+GNB** | `header` | 로고 이미지(JPG), 1뎁스 6개: ALBUM / MERCH / TOUR / SEASONAL / ASTERUM 433-10 / NOTICE, MERCH·TOUR·SEASONAL은 **2뎁스 서브메뉴**(최대 9개), 우측 아이콘 3종: 검색 · 마이쇼핑 · 장바구니(수량 뱃지, 0이면 숨김) |
| **모바일 슬라이드 메뉴** | `aside` | 모바일 햄버거로 열리는 사이드 메뉴: 회원 링크, 카테고리(상위 + "상품보기" 링크 + 하위), 구분선, 고객센터(접힘/펼침), 언어 선택, 닫기 |
| **메인 배너** | `section` | 슬라이드 3장, **전체 폭(full)**, **페이드(fade)** 전환, 자동재생, 호버 시 정지, 페이저(원형)+이전/다음 화살표, 높이 적응. PC/모바일 **이미지 분리**(`<picture>` + `max-width:720px`) |
| **NEW ARRIVALS** | `section` | 가운데 정렬 타이틀 `NEW ARRIVALS`(부제 영역 있으나 비어 있음), 상품 카드 **4열**, "상품 더보기 (1/9)" 버튼(페이지 카운터) |
| **상품 카드** | 내용 박스 | 썸네일(링크), 좋아요 버튼(숨김), 뱃지 영역(비어 있으면 빈 span), 아이콘 박스: **WISH / ADD / OPTION(숨김)**, 상품명, 판매가, 품절 아이콘 영역 |
| **푸터** | `footer` | 푸터 로고, 바로가기(회사소개·이용약관·개인정보처리방침·이용안내), 사업자 정보(필드명-값 쌍 8개), 차트 로고 2종, Customer Center 링크, 계좌정보(빈 값), 에스크로 배너(숨김), 저작권, SNS 6종(**기본 숨김**) |
| **모바일 하단 내비** | 고정 UI | 모바일/태블릿 전용 5탭: 네비게이션 / 검색 / 홈 / Cart(수량) / 마이쇼핑 + **TOP 버튼**(화면 최상단 이동) |
| **검색 레이어** | 고정 UI | 폼(GET `/product/search.html`), 검색어 입력 + 검색/삭제 버튼, 닫기 |
| **스마트 팝업** | 고정 UI | 좌하단 고정 카드형 팝업(슬라이드), "오늘 하루 열지 않기" / 닫기 |
| **월드 쉬핑 모달** | 고정 UI | 국가 + 언어 선택, GO 버튼 |
| **건너뛰기 링크** | 최상단 | "전체상품목록 바로가기"(#category), "본문 바로가기"(#contents) |

### S.2.2 원본 → 우리 클래스 매핑 (Cafe24 클래스 복사 금지)

| 원본(참고용, 사용 금지) | 우리 구현 | 비고 |
|---|---|---|
| `#wrap` | `body` 직계 래퍼 불필요 | 겉박스(header/main/footer)를 body 직계로 |
| `.main_top_banner` > `.top_banner_box_inner` | `.promo-bar` > `.inner-box` > 파티션 | header 최상단 |
| `header#header.layout5` > `.inner` | `.site-header` > `.inner-box` | **`.inner` → `.inner-box`** |
| `.toparea` (`display_pc_only`) | `.header__part--utility` | PC 전용(≥721px) |
| `.top_nav_box` | `.header__part--main` | 로고 + GNB + 아이콘 |
| `.top_category` / `.sub_cate01` | `.gnb` / `.gnb__sub` | 2뎁스 |
| `.top_mypage` | `.header__icons` | 검색·마이·장바구니 |
| `aside#aside` | `.side-menu` | 모바일 슬라이드 메뉴 |
| `#container` > `#contents` | **`main`** | main 직계는 section만 |
| `.xans-smart-banner-admin.section` | `.section-visual` | 겉박스(section) |
| `section.main_product_list` | `.section-new` | 겉박스(section) |
| `.main_title` / `.main_title_txt01` | `.section-new__title` | |
| `ul.prdList.grid4` | `.new__part` (**flex-wrap**, 4열) | Grid 금지 → flex 패턴(S.1.4) |
| `.prdList__item` | `.card` | |
| `.thumbnail` / `.icon__box` | `.card__thumb` / `.card__actions` | |
| `.description` > `.name` / `.spec` | `.card__body` > `.card__name` / `.card__price` | |
| `a.btnMore` | `.btn-more` | |
| `.bottom-nav` (`__tabBar`, `__top`) | `.bottom-nav` | 모바일 전용 |
| `footer#footer.layout1` > `.inner` | `.site-footer` > `.inner-box` | **`.inner` → `.inner-box`** |
| `.bt_logo / .bt_util / .bt_info / .bt_cscenter / .bt_wrap2` | `.footer__part--*` | 파티션 박스 |
| `displaynone` / `display_pc_only` / `RMB RTB` | `[hidden]` / `.pc-only` / `.mo-only` | 유틸리티 클래스 3개만 |

### S.2.3 동작 규칙 (소스 확인)

- 프로모션 바: 기본 숨김 → 쿠키 미존재 시 표시. "오늘 하루 보지 않기" 체크 후 닫기 → **당일 쿠키 저장**(자정 만료).
- 장바구니 수량 뱃지: **0이면 숨김**.
- 메인 배너 슬라이더: **fade 전환 500ms / 자동재생 간격 4000ms / 호버 시 정지 / 페이저 + 이전·다음 / 높이 적응**. 자동재생에는 **정지 버튼 필수**(접근성 규칙).
- 상품 더보기: 클릭 시 **8개 단위로 다음 페이지 추가 로드**, 카운터 `(현재/전체)` 갱신, 마지막 페이지에서 버튼 숨김. 총 9페이지(원본 기준).
- 상품 카드: 품절 시 품절 아이콘 표시 + **ADD 비활성**. WISH는 로그인 상태에 따라 동작 분기.
- 이미지: 상품 썸네일 `loading="lazy"`.
- 언어 전환: **서브도메인 기반**(한국어 `/`, `en.`, `jp.`, `cn.`). 현재 언어에 `selected` 상태.
- 건너뛰기 링크 2종 유지.
- 가격 표기: **`43,000원`** (천 단위 콤마 + "원"). "판매가 :" 라벨은 시각적으로 숨기고 스크린리더용으로 유지.
- 반응형 분기: **PC ≥ 721px / 모바일 ≤ 720px** (소스 미디어쿼리 확인). 아래 S.3에서 상세.

## S.3 박스 규칙 — 크기·패딩·마진

> 박스 값은 `tokens.css` 토큰으로만 구현한다.

### S.3.1 확정값 ✅ (소스 직접 확인)

| 토큰 | 대상 | 값 | 출처 |
|---|---|---|---|
| `--inner-max` | `.inner-box` max-width | **1920px** | 프로젝트 규칙(사이트 미적용 시 1920) + 배너 PC 기준폭 1920 |
| `--bp-pc` | PC/모바일 분기 | **min-width: 721px** (모바일 ≤ 720px) | 배너 미디어쿼리 |
| `--banner-pc-w/h` | PC 배너 원본 | **1920 × 600** (비율 16:5) | 배너 설정 |
| `--banner-mo-w/h` | 모바일 배너 원본 | **720 × 767** (비율 720:767) | 배너 설정 |
| `--section-new-mb` | NEW ARRIVALS 섹션 하단 마진(PC) | **120px** | 인라인 스타일 |
| `--cols-card` | 상품 카드 열 수(PC) | **4열** (`grid4`) | 마크업 |
| `--slider-fade` / `--slider-pause` | 배너 전환 / 대기 | **500ms / 4000ms** | 슬라이더 설정 |
| `--pager-dot` | 배너 페이저 점 | **10 × 10px, 좌우 마진 5px, 반경 5px** | bxslider.css |
| `--pager-bottom` | 페이저 하단 위치 | **20px** | bxslider.css |
| `--pager-bar` | 페이저 막대형(variant) | **38 × 8px, 반경 0** | bxslider.css |
| `--arrow-size` / `--arrow-offset` | 배너 화살표 | **32 × 32px / 좌우 10px**(세로 중앙) | bxslider.css |
| `--popup-w` | 스마트 팝업 폭 | **min 360px / max 391px** (모바일 max 440px) | slick.css |
| `--popup-pos` | 팝업 위치 | **bottom 30px / left 40px** (모바일: 하단 0, 좌우 0) | slick.css |
| `--popup-radius` | 팝업 반경 | **24px** (모바일 상단만 `12px 12px 0 0`) | slick.css |
| `--popup-min-h` | 팝업 아이템 최소 높이 | **231px** | slick.css |
| `--popup-border` | 팝업 테두리 | **1px solid #f0f0f0** | slick.css |
| `--popup-shadow` | 팝업 그림자 | **0 4px 12px rgb(0 0 0 / .10)** | slick.css |
| `--popup-dot` | 팝업 도트 | **10 × 10px 원형, 간격 6px, 하단 20px**, 비활성 opacity .3 / 활성 1 | slick.css |
| `--icon-size` | 헤더/내비 아이콘 | **24 × 24px** (TOP 버튼 아이콘만 **14 × 20px**) | SVG 속성 |
| `--chart-logo-1` / `-2` | 푸터 차트 로고 | **120 × 75px** / **187 × 85px** | 인라인 스타일 |
| `--z-popup` | 팝업 z-index | **999** | slick.css |

### S.3.2 미확정값 (본 CSS 미제공)

| 토큰 | 대상 | 값 | 등급 |
|---|---|---|---|
| `--inner-gutter` | `.inner-box` 좌우 패딩 (모바일 / PC) | 16px / 40px | ⚠️ PROVISIONAL |
| `--promo-h` | 프로모션 바 높이 | 40px | ⚠️ PROVISIONAL |
| `--header-h` | 헤더 메인라인 높이 (모바일 / PC) | 56px / 80px | ⚠️ PROVISIONAL |
| `--toparea-h` | 유틸리티 라인 높이(PC) | 32px | ⚠️ PROVISIONAL |
| `--gap-card` | 상품 카드 간격 (모바일 / PC) | 12px / 24px | ⚠️ PROVISIONAL |
| `--cols-card-mo` | 상품 카드 열 수 모바일 (≤720px) | 2열 | ⚠️ PROVISIONAL (소스에 `grid4`만 확인) |
| `--card-ratio` | 썸네일 비율 | 1 / 1 | ⚠️ PROVISIONAL |
| `--section-py` | 섹션 상하 패딩 | 48px / 96px | ⚠️ PROVISIONAL |
| `--section-new-mb-mo` | NEW ARRIVALS 하단 마진 모바일 | 60px | ⚠️ PROVISIONAL |
| `--footer-py` | 푸터 상하 패딩 | 64px | ⚠️ PROVISIONAL |
| `--gnb-gap` | GNB 항목 간격 | 실측 | ❓ MEASURE |
| `--gnb-sub-w` | 2뎁스 서브메뉴 폭 | 실측 | ❓ MEASURE |
| `--btn-more-h` | "상품 더보기" 버튼 높이/패딩 | 실측 | ❓ MEASURE |
| `--bottom-nav-h` | 모바일 하단 내비 높이 | 실측 | ❓ MEASURE |
| `--radius-*` | 카드·버튼 반경 | 실측 | ❓ MEASURE |

- 값이 4px 배수가 아니면 **실측값 우선**(토큰으로 선언). 일반 규칙의 4px 배수 원칙은 임시값 기준.
- 고정 헤더가 있다면 앵커 이동 시 `scroll-margin-top: var(--header-h)`.
- 배너는 **`--inner-max`(1920px) 안에서 전체 폭**으로 표시한다. 즉 `.inner-box` 안에 배너를 `width:100%`로 두면 ≤1920px 화면에서 원본과 동일하게 풀폭이다. >1920px에서는 **중앙 정렬**(원본: `margin: 0 auto`).
- 배너 높이는 `aspect-ratio`로 확보한다 (PC `1920 / 600`, 모바일 `720 / 767`) → CLS 방지. 원본의 JS 높이 계산에 의존하지 않는다.

## S.4 글자 규칙

### S.4.1 확정값 ✅

| 항목 | 값 | 출처 |
|---|---|---|
| 웹폰트 | **Spoqa Han Sans Neo** (한글+영문) — 굵기 **100 / 300 / 400 / 500 / 700** 5종 | `SpoqaHanSansNeo.css` |
| 폰트 라이선스 | MIT (스포카) → **self-host 가능**. 우리 규칙에 따라 woff2 self-host, `local()` 우선 | CSS 헤더 |
| 상품명 | **12px / `#555555`**, 굵기 보통(normal) | 인라인 스타일 |
| 판매가 | **12px / `#008BCC` / bold(700)** | 인라인 스타일 |
| 프로모션 문구 | 색 **black**, 굵기 **normal** | 인라인 스타일 |
| Customer Center 링크 | **14px**, `<strong>` | 인라인 스타일 |
| 메뉴·타이틀 대문자 | GNB(ALBUM, MERCH…), 섹션 타이틀(`NEW ARRIVALS`), 푸터 `Customer Center` 등은 **텍스트 자체가 영문(대문자/타이틀케이스)** — CSS `text-transform` 사용 금지, 데이터로 작성 | 마크업 |
| 가격 표기 | `숫자(천 단위 콤마)` + `원` | 마크업 |
| 배너 페이저 숫자 폰트 | Arial bold (`bx-pager`; 시각적으로 숨김 처리되는 요소라 구현 불필요) | bxslider.css |
| 뷰포트 | `width=device-width, initial-scale=1.0, maximum-scale=2.0, minimum-scale=1.0, user-scalable=yes` | meta |

> ⚠️ 원본 상품명·가격은 **12px**로 매우 작다. 접근성 규칙(본문 최소 16px)과 충돌하나 **디자인 동일성 우선**. 단 **터치 타깃(카드 전체 링크)은 44px 이상**을 유지하고, 사용자 확대(`maximum-scale=2.0`)를 허용해 보완한다. 예외는 `RULE-EXCEPTION` 주석으로 기록.

### S.4.2 미확정값

| 항목 | 값 | 등급 |
|---|---|---|
| 본문 기본 크기/행간 | 14px / 1.5 | ⚠️ PROVISIONAL |
| GNB 1뎁스 / 2뎁스 크기·굵기 | 실측 | ❓ MEASURE |
| 섹션 타이틀(`NEW ARRIVALS`) 크기·굵기·자간 | 실측 | ❓ MEASURE |
| 유틸리티 링크(회원가입 등) 크기 | 12~13px | ⚠️ PROVISIONAL |
| 푸터 사업자 정보 크기·행간·색 | 12px / 1.8 / 보조색 | ⚠️ PROVISIONAL |
| "상품 더보기" 버튼 글자 | 실측 | ❓ MEASURE |
| Google Fonts 3종(`css2`) 실제 폰트 | 실측(용도 불명) | ❓ MEASURE |

- **MUST** 글자 크기는 `--fs-*`, 행간 `--lh-*`, 굵기 `--fw-*` 토큰으로만 지정.
- 국문 `word-break: keep-all; overflow-wrap: break-word;` 유지.
- 가격·수량 숫자 `font-variant-numeric: tabular-nums` SHOULD.
- 폰트 스택: `"Spoqa Han Sans Neo", "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD Gothic Neo", sans-serif`.
- `@font-face`는 굵기별 선언(100/300/400/500/700), `font-display: swap`. **실제 사용하는 굵기만 로드**(최소 400/500/700 권장 — 사용처 확정 후 축소).

## S.5 색상 규칙

> **원칙**: 색은 **역할 토큰**으로만 사용. 원시값은 `tokens.css` 상단에만.

### S.5.1 확정값 ✅ (소스 확인)

| 역할 토큰 | 용도 | 값 | 출처 |
|---|---|---|---|
| `--color-bg` / `--color-theme` | 페이지 배경 / `theme-color` | **#ffffff** | meta `theme-color`, 팝업 배경 |
| `--color-prd-name` | 상품명 | **#555555** | 인라인 |
| `--color-price` | 판매가 | **#008BCC** | 인라인 |
| `--color-promo-text` | 프로모션 문구 | **black(#000)** | 인라인 |
| `--color-icon` | 아이콘 선/채움(헤더·내비·SVG stroke) | **#000** | SVG |
| `--color-icon-top` | TOP 버튼 아이콘 | **#1a1a1a** | SVG fill |
| `--color-pager` / `--color-pager-active` | 배너 페이저 | **rgba(0,0,0,.2)** / **rgba(0,0,0,.8)** | bxslider.css |
| `--color-popup-border` | 팝업 테두리 | **#f0f0f0** | slick.css |
| `--color-popup-dot` | 팝업 도트 | **#404040** (opacity .3 / 활성 1) | slick.css |
| `--color-popup-bg` | 팝업 배경 | **#ffffff** | slick.css |
| `--color-caption-bg` | 배너 캡션 배경(미사용 가능) | rgba(80,80,80,.75) | bxslider.css |

### S.5.2 미확정값 (본 CSS 미제공)

| 역할 토큰 | 용도 | 값 | 등급 |
|---|---|---|---|
| `--color-text` | 본문 텍스트 | 임시 `#111111` | ❓ MEASURE |
| `--color-text-muted` | 푸터·보조 텍스트 | 임시 `#666666` | ❓ MEASURE |
| `--color-border` | 구분선·테두리 | 임시 `#e5e5e5` | ❓ MEASURE |
| `--color-gnb` / `--color-gnb-hover` | GNB 글자 / hover | 임시 `#000` / 실측 | ❓ MEASURE |
| `--color-soldout` | 품절 | 원본은 **이미지 아이콘(GIF)** 사용 → 텍스트/배지로 대체 시 실측 | ❓ MEASURE |
| `--color-badge` | 장바구니 수량 뱃지 | 실측 | ❓ MEASURE |
| `--color-btn-more-*` | 상품 더보기 버튼 | 실측 | ❓ MEASURE |
| `--color-overlay` | 모달·검색 레이어 딤 | `rgb(0 0 0 / .5)` | ⚠️ PROVISIONAL |
| `--color-focus` | 포커스 링 | 임시 `#008BCC`(대비 확인) | ❓ MEASURE |

- 사이트의 포인트 색은 **`#008BCC`(가격)** 하나로 확인되며 나머지는 **흰 배경 + 검정/회색 모노톤** 구성이다. 신규 색을 임의 추가하지 않는다.
- ❓ MEASURE 임시값 사용 시 `tokens.css`에 `/* MEASURE */` 주석 필수.
- 원본 색이 WCAG AA에 미달하면 **디자인 동일성 우선**, 단 본문·핵심 버튼은 AA 충족 최근접 값으로 보정 후 `RULE-EXCEPTION`에 원본 값 기록. (참고: `#008BCC` on `#fff` ≈ 3.77:1 → 12px 굵은 글자는 AA 4.5:1 **미달**. 원본 유지 + 예외 기록, 또는 `#007AB8`(≈ 4.69:1)로 보정은 사용자 결정)
- 이미지(배너·상품)는 색 토큰 대상이 아니다.

## S.6 이 사이트 전용 토큰 (`tokens.css`에 추가)

```css
:root {
  /* ===== Layout (✅) ===== */
  --inner-max: 1920px;
  --bp-pc: 721px;                  /* @media (min-width: 721px) = PC. 변수는 미디어쿼리에서 못 쓰므로 주석용 */
  --banner-pc-ratio: 1920 / 600;
  --banner-mo-ratio: 720 / 767;
  --section-new-mb: 120px;         /* PC 기준 */

  /* ===== Box (✅ 소스 확인) ===== */
  --pager-dot: 10px;
  --pager-gap: 5px;
  --pager-bottom: 20px;
  --arrow-size: 32px;
  --arrow-offset: 10px;
  --slider-fade: 500ms;
  --slider-pause: 4000;            /* ms, JS 설정값 */
  --icon-size: 24px;
  --popup-min-w: 360px;
  --popup-max-w: 391px;
  --popup-radius: 24px;
  --popup-bottom: 30px;
  --popup-left: 40px;
  --popup-shadow: 0 4px 12px rgb(0 0 0 / .10);

  /* ===== Box (⚠️ PROVISIONAL) ===== */
  --inner-gutter: 1rem;
  --promo-h: 40px;
  --header-h: 56px;
  --toparea-h: 32px;
  --section-py: 3rem;
  --footer-py: 4rem;
  --gap-card: .75rem;
  --cols: 2;                       /* 모바일 열 수 (PC 4 ✅) */
  --card-ratio: 1 / 1;

  /* ===== Color (✅) ===== */
  --color-bg: #ffffff;
  --color-prd-name: #555555;
  --color-price: #008BCC;
  --color-promo-text: #000000;
  --color-icon: #000000;
  --color-icon-top: #1a1a1a;
  --color-pager: rgb(0 0 0 / .2);
  --color-pager-active: rgb(0 0 0 / .8);
  --color-popup-border: #f0f0f0;
  --color-popup-dot: #404040;

  /* ===== Color (❓ MEASURE — 임시값) ===== */
  --color-text: #111111;           /* MEASURE */
  --color-text-muted: #666666;     /* MEASURE */
  --color-border: #e5e5e5;         /* MEASURE */
  --color-gnb: #000000;            /* MEASURE */
  --color-overlay: rgb(0 0 0 / .5);/* PROVISIONAL */
  --color-focus: #008BCC;          /* MEASURE */

  /* ===== Typography ===== */
  --font-sans: "Spoqa Han Sans Neo", "Noto Sans KR", -apple-system, BlinkMacSystemFont,
               "Segoe UI", "Apple SD Gothic Neo", sans-serif;           /* ✅ 패밀리 */
  --fw-thin: 100; --fw-light: 300; --fw-regular: 400; --fw-medium: 500; --fw-bold: 700; /* ✅ */
  --fs-prd: .75rem;                /* ✅ 12px 상품명/가격 */
  --fs-cs: .875rem;                /* ✅ 14px Customer Center */
  --fs-sm: .8125rem;               /* MEASURE */
  --fs-md: .875rem;                /* PROVISIONAL */
  --fs-lg: 1rem;                   /* MEASURE */
  --fs-title: 1.5rem;              /* MEASURE (섹션 타이틀) */
  --lh-body: 1.5;                  /* PROVISIONAL */
}

/* PC: ≥ 721px (원본 분기점) */
@media (min-width: 721px) {
  :root {
    --cols: 4;                     /* ✅ grid4 */
    --gap-card: 1.5rem;            /* PROVISIONAL */
    --inner-gutter: 2.5rem;        /* PROVISIONAL */
    --header-h: 80px;              /* PROVISIONAL */
    --section-py: 6rem;            /* PROVISIONAL */
  }
}
```

### 핵심 컴포넌트 CSS 스켈레톤 (S.1 구조 준수 예시)

```css
/* 배너: .inner-box 안에서 풀폭, 비율로 높이 확보 */
.section-visual .banner { aspect-ratio: var(--banner-mo-ratio); }
@media (min-width: 721px) { .section-visual .banner { aspect-ratio: var(--banner-pc-ratio); } }
.section-visual picture, .section-visual img { display: block; width: 100%; height: auto; }

/* 상품 목록: 파티션 박스 = flex + wrap (Grid 금지) */
.section-new { margin-bottom: var(--section-new-mb); }
.new__part { display: flex; flex-wrap: wrap; gap: var(--gap-card); }
.new__part > .card {
  flex: 0 0 calc((100% - var(--gap-card) * (var(--cols) - 1)) / var(--cols));
  min-width: 0;
}
.card__name  { font-size: var(--fs-prd); color: var(--color-prd-name); font-weight: var(--fw-regular); }
.card__price { font-size: var(--fs-prd); color: var(--color-price);   font-weight: var(--fw-bold); }
```

## S.7 사이트 특화 완료 체크리스트

- [ ] 페이지 구조가 `header` + `main > section` + `footer` 뿐이다
- [ ] 모든 겉박스 안에 `.inner-box`가 **1개**, 직계 자식으로 존재한다 (`.inner` 사용 금지)
- [ ] `.inner-box`에 `max-width: var(--inner-max)` + 중앙 정렬이 있다
- [ ] 파티션 박스는 `display:flex` 이며 `display:grid`가 없다
- [ ] 줄바꿈이 필요한 파티션(상품 목록 등)에 `flex-wrap: wrap`이 있다
- [ ] 간격이 `gap`으로 구현되었다
- [ ] 반응형 분기점이 **721px**(PC) 하나로 통일되었다
- [ ] 박스·글자·색 값이 모두 토큰이다 (PROVISIONAL/MEASURE 주석 유지)
- [ ] 폰트가 Spoqa Han Sans Neo self-host이며, 사용하는 굵기만 로드한다
- [ ] 상품 카드: 상품명 12px `#555555`, 가격 12px bold `#008BCC`
- [ ] 메인 배너: fade 500ms / 4000ms / 호버 정지 / 페이저 / 화살표 / **정지 버튼** / PC·모바일 이미지 분리 / aspect-ratio
- [ ] 프로모션 바: 쿠키 기반 "오늘 하루 보지 않기" 동작
- [ ] 상품 더보기: 8개 단위 로드, `(현재/전체)` 카운터 갱신
- [ ] 모바일 하단 내비·TOP 버튼이 safe-area를 고려했다
- [ ] 건너뛰기 링크 2종, 품절 시 ADD 비활성

---

## 부록 S-A. 본 CSS 확보 방법 (사용자 실행용)

**남은 미확정값(헤더·GNB·카드 간격·푸터·버튼·색)은 Cafe24 본 CSS에 있다.** 아래 중 하나를 에이전트에게 전달하면 S.3.2 / S.4.2 / S.5.2를 확정값으로 갱신한다.

### 방법 1 (권장) — 본 CSS 파일 3개 저장
1. 사이트 접속 → DevTools(F12) → **Network** 탭 → `CSS` 필터 → 새로고침
2. 아래 파일을 각각 클릭 → Response 복사(또는 우클릭 → Save as):
   - `optimizer.php`
   - `optimizer_user.php`
   - `front.css`
   - Google Fonts `css2` (3개) — 폰트명 확인용
3. 저장 후 전달 (압축 가능)

### 방법 2 — 실측 스크립트 실행
사이트를 열고 **Console**에 붙여넣어 실행 → 클립보드의 JSON을 전달. **PC 폭 1440px**, **모바일 폭 390px** 각 1회 권장.

```js
(() => {
  const pick = (el) => {
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    return {
      w: Math.round(r.width), h: Math.round(r.height),
      maxWidth: s.maxWidth, margin: s.margin, padding: s.padding,
      font: s.fontFamily.split(',')[0], size: s.fontSize, weight: s.fontWeight,
      lh: s.lineHeight, ls: s.letterSpacing, color: s.color, bg: s.backgroundColor,
      radius: s.borderRadius, border: s.border, gap: s.gap, display: s.display
    };
  };
  // 이 사이트(Cafe24)의 실제 클래스 기준 선택자
  const sel = [
    'body', '.main_top_banner', '.top_banner_text a', '#header', '#header .inner',
    '.toparea', '.toparea_state a', '.toparea_shoppinginfo .toggle',
    '.top_nav_box', '.top_logo img', '.top_category > ul', '.top_category > ul > li',
    '.top_category > ul > li > a', '.top_category .sub_cate01', '.top_category .sub_cate01 a',
    '.top_mypage a', '.top_mypage .count',
    '.smart-banner-wrapper', '.bx-viewport',
    '.main_product_list', '.main_title', '.main_title_txt01',
    '.prdList', '.prdList > li', '.prdList__item', '.prdList .thumbnail',
    '.prdList .icon__box', '.prdList .icon__box .wish', '.prdList .icon__box .cart',
    '.prdList .description', '.prdList .name', '.prdList .name a', '.prdList .spec li',
    '.btnMore', '.btnMore div',
    '#footer', '#footer .inner', '.bt_logo img', '.bt_util a', '.bt_info_list',
    '.bt_info_list div', '.bt_cscenter a', '.bt_copyright', '.bt_wrap2',
    '.bottom-nav', '.bottom-nav__tabBar li', '.bottom-nav__tabBar a, .bottom-nav__tabBar button',
    '.bottom-nav__top a'
  ];
  const out = { viewport: innerWidth, elements: {} };
  sel.forEach(q => { const el = document.querySelector(q); if (el) out.elements[q] = pick(el); });
  const freq = (arr) => Object.entries(arr.reduce((a, v) => (a[v] = (a[v] || 0) + 1, a), {}))
    .sort((a, b) => b[1] - a[1]).slice(0, 12);
  const cs = [...document.querySelectorAll('body *')].slice(0, 3000).map(getComputedStyle);
  out.topTextColors = freq(cs.map(s => s.color));
  out.topBgColors = freq(cs.map(s => s.backgroundColor).filter(c => c !== 'rgba(0, 0, 0, 0)'));
  out.topFontSizes = freq(cs.map(s => s.fontSize));
  out.topFontWeights = freq(cs.map(s => s.fontWeight));
  out.topFontFamilies = freq(cs.map(s => s.fontFamily.split(',')[0]));
  out.topPaddings = freq(cs.map(s => s.padding).filter(p => p !== '0px'));
  out.topRadius = freq(cs.map(s => s.borderRadius).filter(p => p !== '0px'));
  out.topGaps = freq(cs.map(s => s.gap).filter(g => g !== 'normal'));
  copy(JSON.stringify(out, null, 2));
  console.log('클립보드에 복사되었습니다. 결과를 에이전트에게 붙여넣으세요.');
})();
```

**스크립트로 알 수 없는 것**: hover/active 상태 변화, GNB 2뎁스 열림 방식(hover/클릭), 사이드 메뉴 열림 애니메이션, 헤더 고정(sticky) 여부 → 짧은 설명이나 화면 녹화/스크린샷을 함께 전달.

---

# PART 1. DESIGNER 규약

> 역할: 시각 언어·정보 구조·사용성을 책임진다. 에이전트가 디자인 결정을 해야 할 때 이 파트를 따른다.

## 1.1 디자인 원칙

| 원칙 | 의미 |
|---|---|
| **명료함** | 한 화면에 주인공(Primary Action)은 하나. 시선 흐름이 명확해야 한다. |
| **일관성** | 같은 역할은 항상 같은 모양. 예외를 만들지 않는다. |
| **계층** | 크기·굵기·색·여백으로 정보 우선순위를 표현한다. |
| **절제** | 장식보다 기능. 효과는 의미가 있을 때만 쓴다. |
| **포용** | 모든 사용자(시각·청각·운동·인지 제약 포함)가 쓸 수 있어야 한다. |

## 1.2 디자인 토큰 (단일 진실 공급원)

모든 시각 값은 토큰으로 정의하고 `css/tokens.css`에서만 선언한다.

### 색상

- **MUST** 역할 기반(semantic) 이름 사용: `--color-primary`, `--color-text`, `--color-bg`, `--color-border`, `--color-success/warning/danger/info`.
- **MUST NOT** `--color-blue-500`처럼 색 이름만 있는 변수를 컴포넌트에서 직접 사용 (원시 팔레트는 토큰 파일 내부에서만).
- 팔레트 구성: Primary 1 + Neutral 10단계(50~900) + Semantic 4색. **SHOULD** Accent는 최대 1개.
- **60-30-10 규칙**: 배경/중립 60%, 보조 30%, 강조 10%.
- **대비(WCAG 2.2 AA)**: 본문 텍스트 **4.5:1 이상**, 큰 텍스트(18px bold / 24px+)와 UI 컴포넌트 경계 **3:1 이상**.
- **MUST NOT** 색상만으로 정보 전달 (오류·상태에는 아이콘/텍스트 병기).
- 다크 모드를 지원한다면 토큰 값만 교체한다 (`@media (prefers-color-scheme: dark)`, `[data-theme="dark"]`). 컴포넌트 CSS 수정 금지.

### 타이포그래피

- **[Part S.4 대체]** 이 프로젝트의 폰트는 **Spoqa Han Sans Neo**(100/300/400/500/700). 아래 Pretendard 스택은 일반 예시이며 사용하지 않는다.
- **폰트 패밀리**: 최대 **2종**(본문 + 선택적 제목용). 국문 기본 스택(일반 예시):
  `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", "Apple SD Gothic Neo", sans-serif`
- **타입 스케일** (모듈러 스케일 1.25 기준, `rem` 사용):

| 토큰 | 크기 | 용도 |
|---|---|---|
| `--fs-xs` | 0.75rem (12px) | 캡션, 보조 정보 |
| `--fs-sm` | 0.875rem (14px) | 보조 텍스트, 라벨 |
| `--fs-md` | 1rem (16px) | **본문 기본** |
| `--fs-lg` | 1.25rem (20px) | 리드 문단, H4 |
| `--fs-xl` | 1.5rem (24px) | H3 |
| `--fs-2xl` | 2rem (32px) | H2 |
| `--fs-3xl` | 2.5rem+ | H1, 히어로 (`clamp()` 유동 크기 사용) |

- **본문 최소 16px**. 모바일에서 입력 필드 16px 미만 금지(iOS 자동 확대 방지).
- **행간**: 본문 1.6~1.8(국문 기준 1.7 권장), 제목 1.2~1.35.
- **자간**: 국문 본문 `letter-spacing: -0.01em ~ 0`. 대문자 영문 라벨만 양(+) 자간 허용.
- **줄 길이**: 본문 한 줄 **국문 28~40자 / 영문 45~75자** (`max-width: 65ch` 내외).
- **MUST** `word-break: keep-all; overflow-wrap: break-word;` 로 국문 단어 단위 줄바꿈.
- 굵기는 **400 / 500 / 700** 세 단계만 사용. 한 화면에서 굵기 남용 금지.
- 텍스트 정렬: 본문은 **좌측 정렬**. 장문 중앙 정렬·양쪽 정렬(justify) 금지.

### 간격 (Spacing)

- **8pt 그리드**: 모든 간격은 4px 단위 배수. 토큰: `--space-1`(4) `2`(8) `3`(12) `4`(16) `6`(24) `8`(32) `12`(48) `16`(64) `24`(96).
- **MUST NOT** 토큰에 없는 임의 px 값(예: 13px, 27px) 사용.
- **근접성 원칙**: 관련 요소는 가깝게, 무관한 요소는 멀게. 그룹 내부 간격 < 그룹 간 간격.
- 섹션 상하 패딩: 데스크톱 `--space-24`(96) / 모바일 `--space-12`(48).

### 라운드 · 그림자 · 테두리

- 반경 토큰: `--radius-sm`(4) `--radius-md`(8) `--radius-lg`(16) `--radius-full`(9999). 한 프로젝트에서 **2~3종만 실사용**.
- 그림자: `--shadow-sm / md / lg` 3단계. 층위(elevation) 의미가 있을 때만 사용 (카드 hover, 모달, 드롭다운).
- 테두리 두께는 1px 기본, 강조 2px. 3px 이상 지양.

## 1.3 레이아웃 & 반응형

- **모바일 퍼스트**. **[Part S.3 대체]** 이 프로젝트의 분기점은 **721px 하나**(PC ≥ 721px / 모바일 ≤ 720px)이며 필요 시에만 추가한다. 아래 표는 일반 예시:

| 이름 | min-width | 대상 |
|---|---|---|
| (기본) | 0 | 모바일 |
| `sm` | 640px | 큰 모바일 |
| `md` | 768px | 태블릿 |
| `lg` | 1024px | 데스크톱 |
| `xl` | 1280px | 와이드 |

- ~~12컬럼 그리드 / 컨테이너 1200px~~ → **[Part S 대체]** 컨테이너는 `.inner-box`(max-width `--inner-max`, 기본 **1920px**) 하나뿐이며, 분할은 **flex 파티션 박스**로 한다. 거터는 `--inner-gutter` 토큰.
- **MUST** 320px~1920px 구간 어디서도 가로 스크롤·깨짐이 없어야 한다.
- 터치 타깃 **최소 44×44px**, 인접 타깃 간격 8px 이상.
- 모바일 하단 고정 UI는 safe-area(`env(safe-area-inset-bottom)`) 고려.
- 시선 패턴: 텍스트 중심은 **F-패턴**, 랜딩은 **Z-패턴**. 핵심 CTA는 첫 화면(above the fold)에 배치.

## 1.4 컴포넌트 디자인 규칙

모든 인터랙티브 컴포넌트는 **상태 6종**을 반드시 정의한다:
`default` · `hover` · `focus-visible` · `active` · `disabled` · `loading/error`(해당 시)

| 컴포넌트 | 규칙 |
|---|---|
| **버튼** | Primary / Secondary / Ghost 3종. 한 영역에 Primary 1개. 높이 sm 32 / md 40 / lg 48. 라벨은 동사형("저장", "문의하기"). |
| **링크** | 본문 내 링크는 색 + 밑줄. 방문 상태 구분 가능. 클릭 영역이 텍스트보다 작아지지 않게. |
| **폼** | 라벨은 항상 입력창 **위에 노출**(placeholder를 라벨로 대체 금지). 필수 표시, 오류 메시지는 필드 하단에 원인+해결법. |
| **카드** | 패딩·반경·그림자 토큰 통일. 카드 전체 클릭 시 단일 링크로 처리. |
| **내비게이션** | 항목 7개 이하. 현재 위치 표시(`aria-current`). 모바일은 햄버거/드로어. |
| **모달** | 배경 딤(overlay), ESC·바깥 클릭·닫기 버튼으로 닫힘, 포커스 트랩. 모달 위 모달 금지. |
| **테이블** | 모바일에서는 가로 스크롤 래퍼 또는 카드형 변환. 헤더 고정 SHOULD. |
| **토스트/알림** | 3~5초 자동 소멸(오류는 수동 닫기). 화면 가림 최소화. |

- **포커스 링**: `:focus-visible` 시 2px 이상 윤곽선 + 2px offset. **MUST NOT** `outline: none` 단독 사용.
- 빈 상태(empty), 로딩, 오류 화면을 **반드시 디자인**한다. 해피 패스만 만들지 않는다.

## 1.5 이미지 · 아이콘 · 모션

### 이미지
- 비율 고정(`aspect-ratio`)으로 레이아웃 시프트 방지. 비율 토큰: 1:1, 4:3, 16:9, 3:2.
- 포맷 우선순위: **AVIF > WebP > JPG/PNG**. 로고·아이콘은 **SVG**.
- 이미지 위 텍스트는 오버레이/그라디언트로 대비 확보.
- 모든 이미지는 의미 있는 대체 텍스트 제공 (장식용은 `alt=""`).

### 아이콘
- **단일 아이콘 세트**만 사용(Lucide, Phosphor 등 선택 후 고정). 스타일(선/면) 혼용 금지.
- 기본 크기 16 / 20 / 24px. 선 두께 일관. 아이콘 단독 버튼은 `aria-label` 필수.

### 모션
- 목적: **피드백 · 연속성 · 주의 유도**. 장식용 모션 금지.
- 시간 토큰: `--duration-fast` 120ms / `--duration-base` 200ms / `--duration-slow` 320ms. 500ms 초과 금지.
- 이징: 진입 `ease-out`, 퇴장 `ease-in`, 이동 `ease-in-out`. 토큰화(`--ease-out` 등).
- **MUST** `prefers-reduced-motion: reduce` 대응 (애니메이션 제거/최소화).
- 애니메이션 속성은 `transform`, `opacity`만 사용.
- 자동 재생 캐러셀/영상은 정지 버튼 필수. 깜빡임 초당 3회 미만.

## 1.6 콘텐츠 & UX 라이팅

- 톤: 친근하되 전문적. 존댓말(~합니다/~해요) 중 **하나로 통일**.
- 버튼·메뉴 라벨은 짧고 구체적으로 ("자세히 보기" 남발 금지 → "요금제 자세히 보기").
- 오류 메시지: **무엇이 문제 + 어떻게 해결**. 사용자를 탓하는 표현 금지.
- 날짜·숫자·통화 표기 통일 (예: `2026.11.02`, `1,000원`).
- 더미 텍스트 `Lorem ipsum` 금지 — 실제 맥락에 맞는 샘플 문구 사용.

## 1.7 접근성 (디자인 관점)

- WCAG 2.2 **AA 준수**가 최소선.
- 정보는 색 외에 형태·텍스트·아이콘으로 중복 전달.
- 확대 200%에서도 콘텐츠 손실 없음. 텍스트 간격 조정에도 깨지지 않음.
- 호버 전용 정보 금지 (터치 기기 접근 불가). 호버로 나타나는 것은 포커스로도 나타나야 함.
- 읽기 순서 = 시각 순서.

---

# PART 2. DEVELOPER 규약

> 역할: 유지보수 가능하고 빠르고 안전한 코드를 작성한다. 에이전트가 코드를 생성·수정할 때 이 파트를 따른다.

## 2.1 기술 스택 & 환경

- **HTML5 + CSS3 + ES2022+ (Vanilla JS, ES Modules)**. 프레임워크/라이브러리/번들러는 **명시적 요청 없이 도입 금지**.
- 외부 라이브러리가 꼭 필요하면: ① 대안 없음을 설명 ② 번들 크기 명시 ③ 버전 고정 ④ 가능하면 self-host.
- 지원 브라우저: 최신 2버전의 Chrome / Edge / Safari / Firefox, iOS Safari 15+, Android Chrome. IE 지원 안 함.
- 인코딩 **UTF-8**, 줄바꿈 **LF**, 들여쓰기 **스페이스 2칸**, 파일 끝 개행 1개.
- `.editorconfig`, (선택) Prettier/ESLint/Stylelint 설정을 루트에 둔다.

## 2.2 프로젝트 구조

```
project-root/
├─ index.html
├─ pages/                  # 하위 페이지 HTML
│  └─ about.html
├─ assets/
│  ├─ images/              # 원본·최적화 이미지 (kebab-case)
│  ├─ icons/               # SVG 아이콘/스프라이트
│  └─ fonts/               # self-host 웹폰트 (woff2)
├─ css/
│  ├─ tokens.css           # 디자인 토큰 (CSS 변수) ★ 유일한 값 선언처
│  ├─ reset.css            # 리셋/베이스 정규화
│  ├─ base.css             # 요소 기본 스타일(body, a, h1~h6…)
│  ├─ layout.css           # .inner-box, 겉박스(header/section/footer) 공통, 파티션 유틸
│  ├─ components/          # button.css, card.css, modal.css …
│  ├─ utilities.css        # 소수의 유틸리티 클래스
│  └─ main.css             # @import 진입점 (또는 <link> 순서 관리)
├─ js/
│  ├─ main.js              # 진입점 (type="module")
│  ├─ modules/             # 기능 단위 모듈 (nav.js, modal.js …)
│  ├─ utils/               # 순수 함수 유틸 (dom.js, storage.js …)
│  └─ config.js            # 상수/설정
├─ PROJECT_RULES.md
└─ README.md
```

- **MUST** 한 파일 = 한 책임. CSS 컴포넌트 파일 300줄, JS 모듈 250줄 초과 시 분리.
- 파일·폴더명: **kebab-case 소문자 영문** (`hero-section.css`). 공백·한글·대문자 금지.
- 사용하지 않는 파일·코드·주석 처리된 코드는 **삭제**한다 (Git이 이력을 보관).

## 2.3 HTML 규칙

### 문서 골격 (모든 페이지 필수)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>페이지명 | 사이트명</title>
  <meta name="description" content="120~155자 요약">
  <link rel="canonical" href="https://example.com/page">
  <meta property="og:title" content="…">
  <meta property="og:description" content="…">
  <meta property="og:image" content="…">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
  <a class="skip-link" href="#main">본문 바로가기</a>
  <header>…</header>
  <main id="main">…</main>
  <footer>…</footer>
  <script type="module" src="/js/main.js"></script>
</body>
</html>
```

### 시맨틱 & 구조
- **MUST** 시맨틱 요소 사용: `header` `nav` `main` `section` `article` `aside` `footer` `figure` `button` `ul/ol` `time`.
- **MUST NOT** 클릭 가능한 `div`/`span`. 동작은 `<button>`, 이동은 `<a href>`.
- **`<main>`의 직계 자식은 `<section>`만** 허용 (Part S.1.2). `<main>`은 페이지당 1개. `<h1>`은 페이지당 1개. 제목 레벨은 **건너뛰지 않는다** (h1→h3 금지). 스타일 목적으로 제목 태그 선택 금지.
- `<section>`에는 제목을 둔다. 제목이 없으면 `<div>`.
- 인라인 `style=""`, 인라인 이벤트(`onclick=""`) **금지**.
- ID는 JS 훅·앵커·`label for`·ARIA 연결용으로만. 스타일링에 ID 선택자 금지.
- 속성 순서(권장): `class` → `id` → `data-*` → 기타 → `aria-*`.

### 접근성 (개발 관점)
- **MUST** `<img>`에 `alt`, `width`, `height` 지정.
- 폼: 모든 입력은 `<label for>`와 연결. 그룹은 `<fieldset><legend>`. `autocomplete`, `type`, `inputmode`, `required` 적절히 사용.
- ARIA는 **네이티브 요소로 불가능할 때만** (ARIA 첫 번째 규칙). 필요한 경우 role·state(`aria-expanded`, `aria-controls`, `aria-current`, `aria-live`)를 JS로 동기화.
- 키보드만으로 모든 기능 사용 가능해야 함 (Tab 순서 = 시각 순서, `tabindex`는 0 또는 -1만).
- 모달·드로어: 열릴 때 포커스 이동, 닫힐 때 트리거로 복귀, 포커스 트랩, ESC 닫기. 가능하면 `<dialog>` 사용.
- 링크 목적이 텍스트로 드러나지 않으면 `aria-label` 보강. 새 창 링크는 `target="_blank" rel="noopener noreferrer"` + 안내.

## 2.4 CSS 규칙

### 아키텍처
- **로드 순서**: `tokens → reset → base → layout → components → utilities`.
- **`@layer` 사용 SHOULD**: `@layer reset, base, layout, components, utilities;` 로 명시도 충돌 예방.
- **네이밍: BEM** — `.block`, `.block__element`, `.block--modifier`. (박스 계층 네이밍은 Part S.1.5)
  - 상태 클래스는 `is-active`, `is-open`, `has-error` 접두사 사용.
  - JS 훅은 `js-` 접두사 또는 `data-*` 속성 (스타일 금지).
- **MUST NOT**: `!important`(유틸리티 클래스·접근성 오버라이드 제외), ID 선택자, 4단계 이상 중첩 선택자, 요소 선택자 단독 컴포넌트 스타일링(`div span {}`).
- 명시도(specificity)는 **항상 낮게** 유지. 오버라이드가 필요하면 구조를 고친다.
- CSS 네이티브 중첩은 **최대 3단계**.

### 값 & 단위
- 색상·간격·폰트·그림자·반경·z-index·duration 모두 `var(--token)` 사용. 리터럴 값 금지.
- 단위: 폰트 `rem`, 간격 `rem`/토큰, 보더 `px`, 뷰포트 높이 `dvh`(모바일 고려), 무단위 `line-height`.
- `z-index`는 토큰 스케일 사용: `--z-base 0 / --z-dropdown 100 / --z-sticky 200 / --z-overlay 300 / --z-modal 400 / --z-toast 500`.
- 매직 넘버 금지. 불가피하면 변수 + 주석으로 의미 설명.

### 레이아웃
- **[Part S 대체]** 페이지 레이아웃·파티션 박스는 **Flexbox 전용** (`display:grid` 금지). **Grid는 내용 박스 내부에서 필요할 때만** 허용. `float`·`table` 레이아웃 금지.
- 간격은 **`gap` 사용** (자식 margin으로 간격 만들지 않음). 그 외 margin은 **한 방향(주로 하단/상단)**으로 통일.
- 속박스 클래스명은 **`.inner-box`로 고정**. `.container`/`.wrap`/`.inner` 등 별칭 금지.
- 반응형은 **`min-width` 미디어쿼리(모바일 퍼스트)**. 가능하면 `clamp()`, `minmax()`, `auto-fit`, 컨테이너 쿼리로 미디어쿼리를 줄인다.
- 고정 `height` 지양 → `min-height`. 콘텐츠가 늘어날 때 깨지지 않게.
- `box-sizing: border-box` 전역 적용.

### 필수 베이스 스니펫

```css
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--fs-md);
  line-height: 1.7;
  color: var(--color-text);
  background: var(--color-bg);
  word-break: keep-all;
  overflow-wrap: break-word;
  -webkit-font-smoothing: antialiased;
}
img, svg, video { max-width: 100%; height: auto; display: block; }
:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 토큰 파일 템플릿 (`tokens.css`)

```css
:root {
  /* Color — semantic */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-text: #111827;
  --color-text-muted: #4b5563;
  --color-bg: #ffffff;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;
  --color-focus: #2563eb;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;
  --color-info: #0284c7;

  /* Typography */
  --font-sans: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont,
               "Segoe UI", "Noto Sans KR", "Apple SD Gothic Neo", sans-serif;
  --fs-xs: .75rem;  --fs-sm: .875rem; --fs-md: 1rem;
  --fs-lg: 1.25rem; --fs-xl: 1.5rem;  --fs-2xl: 2rem;
  --fs-3xl: clamp(2rem, 1.4rem + 3vw, 3.5rem);

  /* Spacing (4px base) */
  --space-1: .25rem; --space-2: .5rem;  --space-3: .75rem; --space-4: 1rem;
  --space-6: 1.5rem; --space-8: 2rem;   --space-12: 3rem;  --space-16: 4rem;
  --space-24: 6rem;

  /* Radius / Shadow */
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 16px; --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgb(0 0 0 / .06);
  --shadow-md: 0 4px 12px rgb(0 0 0 / .08);
  --shadow-lg: 0 12px 32px rgb(0 0 0 / .12);

  /* Motion */
  --duration-fast: 120ms; --duration-base: 200ms; --duration-slow: 320ms;
  --ease-out: cubic-bezier(.16, 1, .3, 1);

  /* Layout */
  --container-max: 1200px;
  --gutter: 1rem;

  /* z-index */
  --z-base: 0; --z-dropdown: 100; --z-sticky: 200;
  --z-overlay: 300; --z-modal: 400; --z-toast: 500;
}
@media (min-width: 1024px) { :root { --gutter: 2rem; } }
```

## 2.5 JavaScript 규칙

### 기본
- **ES Modules** (`type="module"`), `"use strict"` 불필요(모듈은 기본 strict). 전역 변수 **금지**.
- `var` 금지. 기본 `const`, 재할당 필요 시만 `let`.
- 비교는 항상 `===` / `!==`. 암묵적 형변환 금지.
- 함수는 **작게(≤ 30줄 SHOULD)**, 단일 책임, 부수효과 분리. 순수 함수 우선.
- 이름: 변수·함수 `camelCase`, 상수 `UPPER_SNAKE_CASE`, 클래스 `PascalCase`, 불리언은 `is/has/can` 접두사, 이벤트 핸들러는 `handle*`.
- 의미 없는 이름(`data1`, `temp`, `a`) 금지. 약어는 보편적인 것만.
- 매직 넘버·매직 스트링은 `config.js` 상수로.

### DOM
- 선택자는 **`data-js="…"` 또는 `js-` 클래스**로 잡는다. 스타일 클래스에 의존하지 않는다.
- 상태 표시는 **클래스/속성 토글**(`classList.toggle('is-open')`, `aria-expanded`). `element.style.xxx` 직접 조작 금지 (동적 좌표 등 불가피한 경우 CSS 변수 `style.setProperty('--x', …)`).
- 이벤트: **위임(Event Delegation)** 우선. 스크롤/리사이즈는 `passive: true` + `requestAnimationFrame`/throttle/`IntersectionObserver`·`ResizeObserver` 활용.
- `innerHTML`에 사용자 입력 삽입 **금지**. 텍스트는 `textContent`, 구조는 `<template>` 또는 `createElement`.
- DOM 읽기/쓰기를 번갈아 하지 않는다 (레이아웃 스래싱 방지). 배치 처리.
- 컴포넌트 초기화 패턴:

```js
// js/modules/accordion.js
export function initAccordion(root = document) {
  root.querySelectorAll('[data-js="accordion"]').forEach((el) => {
    const trigger = el.querySelector('[data-js="accordion-trigger"]');
    const panel = el.querySelector('[data-js="accordion-panel"]');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
  });
}
```

```js
// js/main.js
import { initAccordion } from './modules/accordion.js';

document.addEventListener('DOMContentLoaded', () => {
  initAccordion();
});
```

### 비동기 & 오류 처리
- `async/await` 사용, `.then` 체인 지양. 모든 `fetch`는 `try/catch` + `response.ok` 검사 + 타임아웃/`AbortController`.
- 사용자에게 보이는 오류 상태(UI)를 반드시 처리. `console.log`로 끝내지 않는다.
- **MUST NOT** 빈 `catch {}`.
- 프로덕션 코드에 `console.log`/`debugger` 잔존 금지 (`console.error`/`warn`만 필요 시 허용).

### 저장소 & 데이터
- `localStorage`/`sessionStorage`는 `utils/storage.js` 래퍼로 접근(try/catch, JSON 파싱 보호). **민감정보(토큰·개인정보) 저장 금지**.
- 하드코딩된 API 키·시크릿 **절대 금지**.

### 주석
- "무엇"이 아니라 **"왜"**를 쓴다. 자명한 코드에 주석 금지.
- 공개 함수는 JSDoc(`@param`, `@returns`) 작성.
- TODO는 `// TODO(담당/날짜): 내용` 형식.

## 2.6 성능 규칙

**목표 (Lighthouse 모바일 / Core Web Vitals)**: Performance ≥ 90, LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.

- **이미지**: `loading="lazy"`(첫 화면 제외), 첫 화면 LCP 이미지는 `fetchpriority="high"` + 지연 로딩 금지. `srcset`/`sizes`/`<picture>`로 반응형 제공. 업로드 전 압축.
- **폰트**: woff2 self-host, `font-display: swap`, 사용하는 굵기만 로드, 가능하면 서브셋. 핵심 폰트 `preload`.
- **CSS**: 첫 화면 필수 CSS 우선 로드. 사용하지 않는 CSS 제거.
- **JS**: `type="module"`(자동 defer). 렌더링 차단 스크립트 금지. 초기 JS 총량 **50KB(gzip) 이하 SHOULD**. 무거운 기능은 동적 `import()`로 지연 로딩.
- **레이아웃 시프트**: 이미지·영상·광고·임베드에 크기 예약(`width/height`, `aspect-ratio`).
- **리소스 힌트**: 필요한 곳만 `preconnect`, `preload`. 남용 금지.
- 애니메이션은 `transform`/`opacity`. `top/left/width/height` 애니메이션 금지. 필요 시 `will-change`는 일시적으로만.
- 서드파티 스크립트는 최소화, `async`/`defer`, 사용자 동의 후 로드.
- HTTP 캐시·압축(gzip/brotli)은 배포 설정에서 적용(파일명 해시/버전 쿼리).

## 2.7 SEO & 메타

- 페이지마다 고유한 `<title>`(50~60자), `meta description`(120~155자), `canonical`.
- OG/Twitter 카드 메타 작성. OG 이미지 1200×630.
- 구조화 데이터(JSON-LD) 적용 SHOULD: `Organization`, `BreadcrumbList`, `Article`, `Product` 등.
- `robots.txt`, `sitemap.xml`, `favicon`(SVG + 180px apple-touch-icon), `manifest` 준비.
- URL은 소문자 kebab-case, 의미 있는 경로. 내부 링크는 상대/루트 경로 일관 사용.
- 404 페이지 제공.

## 2.8 보안

- 외부 입력은 **항상 신뢰하지 않는다**: 출력 시 이스케이프, `innerHTML`/`eval`/`new Function`/`document.write` **금지**.
- 외부 링크 `rel="noopener noreferrer"`.
- CSP(Content-Security-Policy), `X-Content-Type-Options`, `Referrer-Policy` 등 보안 헤더는 서버 설정에서 적용하도록 문서화.
- 서드파티 CDN 사용 시 **SRI(`integrity`) + `crossorigin`** 필수, 버전 고정.
- 폼은 클라이언트 검증 + **서버 검증 전제**(클라이언트 검증은 UX용).
- 개인정보 수집 시 동의 UI·개인정보처리방침 링크 포함.

## 2.9 브라우저 호환 & 점진적 향상

- **핵심 콘텐츠·기능은 JS 없이도 읽힘** (점진적 향상). JS 실패 시 깨지지 않게.
- 최신 CSS/JS 기능은 `@supports` / 기능 감지로 폴백 제공. (UA 스니핑 금지)
- 모바일 `100vh` 문제 → `dvh`/`svh` 사용 또는 폴백.
- 테스트 대상: Chrome, Safari(iOS 포함), Firefox, Edge — 최소 3종 실기/에뮬레이터 확인.

## 2.10 Git & 협업

- 브랜치: `main`(배포) / `feature/<설명>` / `fix/<설명>`.
- 커밋: **Conventional Commits** — `feat:`, `fix:`, `style:`, `refactor:`, `perf:`, `docs:`, `chore:`. 한 커밋 = 한 논리 변경.
- **MUST NOT** 커밋 금지: `node_modules`, `.env`, 시크릿, 빌드 산출물, OS/IDE 파일 (`.gitignore` 관리).
- 큰 변경은 PR 설명에 **변경 이유 / 영향 범위 / 스크린샷(전·후) / 테스트 방법** 기재.

## 2.11 문서화

- `README.md`: 프로젝트 소개, 폴더 구조, 실행 방법, 배포 방법, 브라우저 지원 범위.
- 새 컴포넌트 추가 시 **HTML 마크업 예시 + 사용 가능한 modifier + 상태**를 CSS 파일 상단 주석에 기록.
- 규칙 예외, 알려진 이슈, 기술 부채는 README의 `Known Issues` 섹션에 누적.

---

# PART 3. 공통 체크리스트 (Definition of Done)

에이전트는 작업 종료 전 **모든 항목**을 확인하고, 결과를 응답 마지막에 요약한다.

### 디자인 일관성
- [ ] 모든 색·간격·폰트·반경·그림자가 `tokens.css` 변수 사용 (리터럴 값 없음)
- [ ] Part S 확정값(✅)과 다른 값을 쓰지 않았다
- [ ] 기존 컴포넌트 재사용, 새 컴포넌트는 상태 6종 정의
- [ ] 8pt 그리드 준수, 타입 스케일 외 폰트 크기 없음
- [ ] 텍스트 대비 AA(4.5:1 / 3:1) 충족
- [ ] 320 / 768 / 1024 / 1440px에서 레이아웃 깨짐 없음
- [ ] 빈 상태·로딩·오류 상태 구현

### 레이아웃 구조 (Part S)
- [ ] Part S.7 체크리스트 전 항목 통과

### 마크업 & 접근성
- [ ] 시맨틱 태그, `h1` 1개, 제목 레벨 순차
- [ ] 모든 `img`에 `alt` + `width/height`
- [ ] 모든 폼 컨트롤에 라벨 연결
- [ ] 키보드만으로 전 기능 사용 가능, `:focus-visible` 표시
- [ ] `prefers-reduced-motion` 대응
- [ ] 인라인 style / 인라인 이벤트 없음

### 코드 품질
- [ ] BEM 네이밍, ID 선택자·`!important` 없음, 중첩 3단계 이하
- [ ] 전역 변수 없음, `var` 없음, 빈 `catch` 없음
- [ ] `console.log`·`debugger`·주석 처리된 코드·미사용 코드 제거
- [ ] 하드코딩된 시크릿/API 키 없음
- [ ] `innerHTML`에 비신뢰 데이터 삽입 없음

### 성능 & SEO
- [ ] LCP 이미지 최적화(`fetchpriority`), 그 외 이미지 lazy
- [ ] CLS 방지(이미지/임베드 크기 예약)
- [ ] 페이지별 `title` / `description` / OG 메타 작성
- [ ] 불필요한 서드파티·라이브러리 추가 없음

### 최종 보고 형식 (에이전트 응답 마지막에 포함)

```
## 작업 요약
- 변경/추가 파일: …
- 적용한 토큰/컴포넌트: …
- 가정한 사항: …
- 규칙 예외(있다면): … (사유)
- 체크리스트: 통과 / 미통과 항목: …
```

---

## 부록 A. 금지 사항 한눈에 보기 (Quick Don'ts)

| 영역 | 금지 |
|---|---|
| 디자인 | 임의 색상·px 값, 폰트 3종 이상, 색상만으로 상태 표현, placeholder를 라벨로 사용 |
| HTML | 클릭 가능한 `div`, 제목 레벨 건너뛰기, 인라인 style/이벤트, 이미지 `alt` 누락 |
| 레이아웃 | `.container` 등 속박스 별칭, `main > div`, 파티션 박스 `display:grid`, `.inner-box` 중첩, 겉박스 `max-width` |
| CSS | `!important`, ID 선택자, 깊은 중첩, float 레이아웃, `outline: none` 단독 사용 |
| JS | 전역 변수, `var`, `eval`, `innerHTML`에 사용자 입력, 빈 `catch`, 잔존 `console.log` |
| 성능 | 렌더 차단 스크립트, 크기 없는 이미지, 레이아웃 속성 애니메이션 |
| 프로세스 | 요청 범위 밖 수정, 임의 라이브러리 도입, 규칙 무단 위반 |

## 부록 B. 신규 컴포넌트 작성 절차

1. 기존 컴포넌트/토큰으로 해결 가능한지 **검색**
2. 불가하면 `css/components/<name>.css` 생성 (BEM, 토큰만 사용)
3. 마크업 예시를 파일 상단 주석에 기록
4. 상태 6종 + 반응형 + 접근성(키보드·ARIA) 구현
5. 필요한 JS는 `js/modules/<name>.js`에 `initXxx()` 형태로 작성, `main.js`에서 초기화
6. 체크리스트(Part 3) 확인 후 작업 요약 보고

---

*Version 1.2 — 프로젝트 진행 중 규칙 개정 시 이 파일의 버전과 변경 이력을 아래에 기록한다.*

| 버전 | 날짜 | 변경 내용 |
|---|---|---|
| 1.0 | 2026-11-02 | 최초 작성 (일반 규칙) |
| 1.1 | 2026-11-02 | VLAST SHOP 특화 Part S 추가, 레이아웃(겉박스>.inner-box>파티션) 규칙 반영, 일반 규칙 중 컨테이너·Grid 규칙 수정 |
| 1.2 | 2026-11-02 | 사이트 소스(HTML + 폰트/슬라이더/팝업 CSS) 분석 반영: 폰트(Spoqa Han Sans Neo), 브레이크포인트 721px, 배너·카드·팝업 수치, 확정 색상, 원본→우리 클래스 매핑, 동작 규칙 추가. 본 CSS 미제공 항목은 MEASURE 유지 |
