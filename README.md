# VLAST SHOP 웹사이트 구현 프로젝트

> **이 파일은 AI 에이전트와 개발자가 프로젝트에서 가장 먼저 읽는 문서입니다.**
> README를 읽고 작업을 시작할 때는 아래 **[0. 시작 전 필수 절차](#0-시작-전-필수-절차)** 를 반드시 순서대로 수행하세요.
> 특히 `task-history/task.md`에서 이전 작업과 남은 사항을 확인한 뒤 이어서 진행하세요.

---

## 0. 시작 전 필수 절차

작업(코드 작성·수정) 전에 아래 순서를 **반드시** 지킨다.

1. **`spec-kit/AGENTS.md`를 처음부터 끝까지 읽는다.** 이 프로젝트의 모든 규칙이 그 안에 있다.
   - **Part S (사이트 특화 규약)** 가 일반 규칙(Part 1·2)보다 **우선**한다.
   - 특히 **S.0(값의 신뢰 등급)** 과 **S.1(레이아웃 규약)** 은 건너뛰지 않는다.
2. **`spec-kit/` 폴더의 다른 파일이 있으면 모두 확인한다.** (참고 자료, 실측 데이터 등)
3. **`task-history/task.md`를 읽는다.** 이전 작업의 완료 내용과 남은 사항을 확인하고, 이미 완료된 작업을 중복하지 않는다.
4. **프로젝트 현재 상태를 파악한다.** 기존 파일을 먼저 읽고, 이력과 실제 코드 상태를 대조해 이미 있는 토큰·컴포넌트를 재사용한다.
5. **아래 [5. 첫 응답 형식](#5-첫-응답-형식)에 따라 이해한 내용을 보고한 뒤 작업을 시작한다.**

> 규칙이 이 README와 `AGENTS.md`에서 다르게 보이면 **`spec-kit/AGENTS.md`가 우선**한다.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| **목표** | 타겟 사이트 [vlastshop.com](https://vlastshop.com)과 **디자인은 동일**, **내부 레이아웃 구조는 새로 구성**한 쇼핑몰 웹사이트 구현 |
| **기술 스택** | HTML5 · CSS3 · Vanilla JS (ES Modules). **프레임워크·빌드 도구 도입 금지** (명시적 요청 시에만) |
| **작업 방식** | 바이브코딩 — 에이전트가 규약에 따라 코드를 작성하고 사람이 검수 |
| **디자인 기준** | 타겟 사이트의 크기·패딩·마진 등 박스 규칙, 글자 규칙, 색상 규칙 |
| **레이아웃 기준** | 겉박스 > `.inner-box` > 파티션 박스 (AGENTS.md **S.1**) |

---

## 2. 핵심 규칙 요약 (상세는 AGENTS.md)

반드시 기억할 것만 요약한다. **요약만 보고 작업하지 말고 원문을 읽는다.**

### 레이아웃 (S.1)
- 페이지 구조는 **`header` + `main > section` + `footer`** 만 사용한다.
- 각 겉박스 안에는 **`.inner-box` 1개**를 직계 자식으로 둔다. (`.container`, `.wrap`, `.inner` 등 다른 이름 **금지**)
- `.inner-box`는 `max-width: var(--inner-max)` + 중앙 정렬. 사이트 실측값이 없으면 **1920px**.
- 파티션 박스는 **`display: flex`**, 줄바꿈이 필요하면 `flex-wrap: wrap`. **파티션 박스에 Grid 금지** (Grid는 내용 박스에서만).
- 간격은 `gap`으로 만든다.

### 디자인 값
- 색상·간격·폰트·반경·그림자 등 **모든 값은 `css/tokens.css`의 CSS 변수만** 사용한다. 리터럴 값 하드코딩 금지.
- 폰트는 **Spoqa Han Sans Neo**, 반응형 분기점은 **721px 하나** (PC ≥ 721px).
- 상품명 12px `#555555`, 가격 12px bold `#008BCC` 등 확정값은 AGENTS.md **S.3~S.5**를 따른다.

### 값의 신뢰 등급 (S.0)
| 표기 | 의미 | 행동 |
|---|---|---|
| ✅ CONFIRMED | 확정값 | 그대로 사용 |
| ⚠️ PROVISIONAL | 임시값 | 사용하되 `/* PROVISIONAL */` 주석 유지 |
| ❓ MEASURE | 실측 필요 | **임의로 정하지 말고** 사용자에게 요청, 임시값 사용 시 `/* MEASURE */` 주석 |

### 작업 원칙
- **요청한 범위만** 수정한다. 요청 밖 파일의 리팩터링·포맷 변경·의존성 추가 금지.
- 모르는 것은 **가정을 명시**하고 진행한다.
- 타겟 사이트의 **마크업·클래스명(Cafe24 스킨)은 복사하지 않는다.** 보이는 결과(수치·색·글자)만 재현한다.
- 규칙을 어길 수밖에 없으면 `/* RULE-EXCEPTION: 사유 */` 주석을 남긴다.

---

## 3. 프로젝트 구조

```
project-root/
├─ README.md                 ← 지금 읽는 파일 (진입점)
├─ spec-kit/
│  ├─ AGENTS.md              ← ★ 프로젝트 규약 (반드시 읽기)
│  └─ …                      ← 참고 자료/실측 데이터 (있으면)
├─ index.html
├─ pages/
├─ assets/
│  ├─ images/
│  ├─ icons/
│  └─ fonts/                 ← Spoqa Han Sans Neo woff2 (self-host)
├─ css/
│  ├─ tokens.css             ← 디자인 토큰 (유일한 값 선언처)
│  ├─ reset.css
│  ├─ base.css
│  ├─ layout.css             ← .inner-box, 겉박스 공통, 파티션 유틸
│  ├─ components/
│  ├─ utilities.css
│  └─ main.css
└─ js/
   ├─ main.js
   ├─ modules/
   ├─ utils/
   └─ config.js
```

- 위 구조가 아직 없으면 **첫 작업에서 생성**한다. (상세 규칙: AGENTS.md **2.2**)
- 파일·폴더명은 **kebab-case 소문자 영문**.

---

## 4. 권장 구현 순서

한 번에 전부 만들지 말고 **단계별로 만들고 각 단계마다 검수**를 받는다.

| 단계 | 작업 | 산출물 |
|---|---|---|
| **1** | 프로젝트 골격 + 토큰 | 폴더 구조, `tokens.css`(S.6 기준), `reset.css`, `base.css`, 폰트 `@font-face` |
| **2** | 레이아웃 기반 | `layout.css`(`.inner-box`, 겉박스, 파티션 flex 패턴), 빈 `index.html` 골격 |
| **3** | 공통 영역 | 프로모션 바, **header**(유틸리티·로고·GNB 2뎁스·아이콘), **footer**, 모바일 슬라이드 메뉴·하단 내비·TOP 버튼 |
| **4** | 메인 섹션 | 배너 슬라이더(section-visual), NEW ARRIVALS(section-new) + 상품 카드 + 상품 더보기 |
| **5** | 부가 UI | 검색 레이어, 스마트 팝업, 월드 쉬핑 모달, 언어 전환 |
| **6** | 점검 | AGENTS.md **Part 3 + S.7 체크리스트**, 접근성·성능·반응형(320/720/721/1440/1920px) 확인 |

> 단계 순서·범위는 사용자의 지시가 있으면 그에 따른다.

---

## 5. 첫 응답 형식

작업을 시작하기 **전에** 에이전트는 아래 형식으로 먼저 보고한다. (코드 작성은 그 다음)

```
## 규약 확인
- 읽은 문서: README.md, spec-kit/AGENTS.md, (그 외 읽은 파일)
- 이해한 핵심 규칙 (3~5줄 요약):
  1. …
- 이번 작업 범위: …
- 가정한 사항: …
- 사용자에게 필요한 값 (MEASURE 항목): …
- 작업 계획 (단계/파일 목록): …
```

작업 완료 후에는 AGENTS.md **Part 3**의 **최종 보고 형식**(작업 요약 + 체크리스트 결과)을 따른다.

---

## 6. 현재 알려진 상태 / 미확정 사항

- **확정(✅)**: 박스 구조 규칙, `.inner-box`, 분기점 721px, 폰트, 배너·팝업 수치, 상품명/가격 색·크기, 포인트 색 `#008BCC` 등 → AGENTS.md **S.3.1 / S.4.1 / S.5.1**
- **미확정(⚠️/❓)**: 헤더·GNB 크기, 상품 카드 간격, 푸터 글자 크기·색, 버튼 스타일, 반경 등
  - 원인: 타겟 사이트의 본 CSS(`optimizer.php`, `optimizer_user.php`, `front.css`)를 아직 분석하지 못함.
  - 해결: 본 CSS 또는 실측 JSON이 `spec-kit/`에 추가되면 해당 값을 확정으로 갱신한다. (방법: AGENTS.md **부록 S-A**)
- 미확정 값이 필요한 작업이면 **임의로 만들지 말고** 사용자에게 먼저 요청한다.

---

## 7. 개발 환경

- 빌드 없이 **정적 파일**로 동작한다. 로컬에서는 간단한 정적 서버로 확인한다.
  ```bash
  # 택 1
  npx serve .
  python3 -m http.server 8000
  ```
- ES Modules를 쓰므로 `file://`로 직접 열지 말고 **서버를 통해** 확인한다.
- 지원 브라우저: 최신 2버전 Chrome / Edge / Safari / Firefox, iOS Safari 15+, Android Chrome.
- 인코딩 UTF-8, 줄바꿈 LF, 들여쓰기 스페이스 2칸.

---

## 8. 규약 관리

- 규약 원본은 **`spec-kit/AGENTS.md` 하나**다. 규칙을 바꾸려면 이 파일을 수정하고 하단 **변경 이력**에 기록한다.
- README에는 규칙 상세를 중복해서 쓰지 않는다. (요약만 유지, 충돌 시 AGENTS.md 우선)
- 에이전트가 규약의 오류·모순·누락을 발견하면 **임의로 고치지 말고 사용자에게 보고**한다.


---

## 9. 공지사항 게시판 & 상단 롤링 띠배너 구현 내역 (작업 005)

### 9.1 공지사항 게시판 (`notice.html`)
- **지침 준수 (`curr-task/005.공지사항/localstorage_to_firebase_guidelines.md`)**:
  - UI 컴포넌트(`js/modules/notice.js`)는 `localStorage`에 직접 접근하지 않고 `noticeService` Repository 인터페이스만 호출하도록 계층 분리 완료.
  - 모든 데이터 CRUD 및 조회수 증가는 `async/await` 비동기 인터페이스로 처리.
  - 문서형 데이터 모델(`Notice`), 고유 식별자(`crypto.randomUUID()`), ISO 8601 타임스탬프(`createdAt`, `updatedAt`) 저장.
  - 추후 Firebase(Firestore/Storage) 마이그레이션 교체 지점 및 스텁 파일(`js/services/firebase/`) 마련.
- **4개 핵심 화면**:
  1. **목록 (List)**:
     - 덤프 이미지 기반 4개 컬럼 인덱스 매칭: `번호` | `제목` | `작성자` | `조회`.
     - 상단 고정 공지 4종(`isNotice: true`): `번호` 열에 숫자 없이 `공지` 라벨 표시, **다음 페이지로 이동해도 테이블 최상단에 상시 고정 유지**.
     - 일반 공지사항: 최신 등록일 기준 내림차순 연속 넘버링 적용 (`totalNormal - (startIndex + idx)`).
     - 분류 선택, 기간 필터(전체/일주일/한달/세달), 키워드 검색, 페이지당 10/15/20개 보기, 5개 단위 페이지네이션.
  2. **상세 (Detail)**:
     - 상단 헤더: 좌측 핑크색 볼드 타이틀 `NOTICE` & 핑크 하단선(`border-bottom`), 우측 브레드크럼(`HOME > NOTICE`).
     - 타이틀 박스: `[공지]` 뱃지, 게시글 제목, `[N]` 새 글 뱃지, 등록일, 조회수(진입 시 +1 자동 증가).
     - 본문 영역: 서식/링크 표시, 첨부파일 다운로드 메타 영역, 이전글/다음글 네비게이션, 목록으로/수정/삭제 버튼(삭제 확인 다이얼로그).
     - **타이틀 가림/잘림 방지 최적화**: 고정 헤더 높이만큼 상단 패딩(padding-block-start: calc(var(--header-fixed-height) + 2rem))을 확보하여 헤더 아래로 파고들어 제목이 가려지는 현상을 해소하고, Flex 자식의 min-width: 0, overflow-wrap: anywhere, line-height: 1.5, overflow: visible 적용으로 타이틀이 온전히 나타나도록 조치.
  3. **글쓰기 (Write)**:
     - 제목, 공지유형 라디오(일반공지/이벤트안내/시스템점검/기타), 중요공지 체크박스, 작성자 입력.
     - 리치 텍스트 에디터(굵게·기울임·밑줄·취소선·정렬·목록·링크·이미지·표), 글자수 카운터(5,000자 제한), 첨부파일(최대 10MB, 5개) 유효성 검사 후 등록.
  4. **글수정 (Edit)**:
     - 기존 데이터 폼 자동 채움, 첨부파일 개별 삭제/추가, "수정일을 현재 날짜로 갱신" 체크 옵션, 목록으로/취소/수정완료.

### 9.2 사이트 상단 고정 롤링 공지 띠배너 (`js/components/topNoticeBar.js`)
- **개요**: 사이트 상단(`header.site-header` 최상단)에 위치하여 주요 공지사항 상위 3개를 한줄로 순차 롤링 출력하는 별도 배너 박스 (`index.html` 메인 전용).
- **노출 위치 및 범위 조정**:
  - `index.html` 메인 화면에서만 단독 동작하도록 제한 (`notice.html` 및 `login.html`에서는 배너 호출 제거 및 컴포넌트 내 경로 가드 처리).
- **레이아웃 및 정렬 사양**:
  - **공지 출력 내용**: 중앙 정렬 (`text-align: center`, `justify-content: center`).
  - **컨트롤 파트**: 우측 정렬 (`margin-left: auto`, `justify-self: end`).
  - 데스크톱/태블릿은 대칭형 3단 그리드(`120px 1fr 120px`)로 공지 텍스트를 화면 정중앙에 배치하고 컨트롤을 우측 끝에 배치.
  - 모바일(768px 이하)은 `auto 1fr auto` 그리드로 텍스트 중앙 정렬과 우측 컨트롤 정렬을 유지하면서 작은 화면에 최적화.
- **주요 기능**:
  - `noticeService.getAll()`에서 상위 3개 게시물 실시간 연동.
  - 단일 행(한줄) 출력 및 말줄임 처리(`text-overflow: ellipsis`).
  - 3.5초 간격 순차 롤링 (부드러운 수직 슬라이드 트랜지션 애니메이션).
  - **컨트롤러 버튼군 탑재**:
    - **멈춤(Pause ⏸)**: 자동 롤링 정지 (마우스 호버 및 키보드 포커스 시에도 자동 일시정지 지원).
    - **플레이(Play ▶)**: 롤링 동작 재개.
    - **닫기(Close ✕)**: 상단 배너 슬라이드업 퇴장 애니메이션 및 세션 스토리지(`sessionStorage`) 저장으로 닫힘 상태 유지.
    - **카운터 인디케이터**: `1/3`, `2/3`, `3/3` 현재 순서 표시.
  - 클릭 시 해당 공지 상세 화면(`notice.html?mode=view&id=...`)으로 즉시 이동.

---

## 10. 상위/하위 메뉴별 상품 데이터 매칭 및 구현 (작업 006)

`data/` 폴더 내 JSON 데이터와 상품 카드 박스 구조를 상위 및 하위 메뉴와 매칭하여 추가 구현 완료:

1. **상위메뉴 - 하위메뉴 매칭 현황**:
   - **TOUR**:
     - `1ST FANCON` (15개, `data/tour/product_data_json.md`) — 기존 구현 유지
     - `2025 TOUR` (12개, `data/tour/products.json`) — 기존 구현 유지
     - `1ST FANCON ENCORE` (11개, `data/tour/1ST FANCON ENCORE.json`) — **추가 구현**
     - `2025 TOUR ENCORE` (11개, `data/tour/2025 TOUR ENCORE.json`) — **추가 구현**
     - `2026 TOUR` (16개, `data/tour/2026 TOUR.json`) — **추가 구현**
   - **MERCH** (**전체 신규 구현**):
     - `W4L` (20개, `data/MERCH/W4L.json`)
     - `PUMP UP THE VOLUME` (3개, `data/MERCH/PUMP UP THE VOLUME.json`)
     - `DASH` (4개, `data/MERCH/DASH.json`)
     - `HAPPY PLAVE DAY` (9개, `data/MERCH/HAPPY PLAVE DAY.json`)
     - `KAKURENBO` (6개, `data/MERCH/KAKURENBO.json`)
     - `BBUU` (10개, `data/MERCH/BBUU.json`)
     - `BORN SAVAGE` (11개, `data/MERCH/BORN SAVAGE.json`)
     - `TEAM PLAVE` (8개, `data/MERCH/TEAM PLAVE.json`)
     - `BOOK` (4개, `data/MERCH/BOOK.json`)
   - **SEASONAL** (**전체 신규 구현**):
     - `SEASON'S GREETINGS` (3개, `data/SEASONAL/SEASON'S GREETINGS.json`)
     - `BIRTHDAY KIT` (14개, `data/SEASONAL/BIRTHDAY KIT.json`)
   - **총 157개 상품** 데이터 정상 로드 및 매칭 완료.

2. **상품 박스(카드) 데이터 모델 매칭 및 이미지 경로 반영**:
   - `id`: 원본 JSON의 고유 id 반영.
   - `name`: 상품명 (`card__name`).
   - `price` & `priceDisplay`: 포맷팅된 한국 원화 표기(`7,000원`, `159,000원` 등) 반영 (`card__price`).
   - `imageUrl`: JSON 파일에 명시된 `image_url` 경로(HTTPS CDN 절대경로 및 상대경로)를 `<img src="...">`에 100% 반영.
   - `isSoldOut`: `is_soldout` / `is_sold_out` 플래그 매칭하여 품절 상품 뱃지(`card__soldout`) 표시.
   - `href`: 원본 상품 상세 링크 매칭.

3. **GNB 및 탭 네비게이션 연동**:
   - 데스크톱 GNB(`MERCH`, `TOUR`, `SEASONAL`) 및 모바일 드로어 클릭 시 해당 상위 카테고리로 즉시 전환.
   - 하위 카테고리 탭(`catalog-subnav__scroller`)이 상위 메뉴에 맞게 동적으로 교체되며, 각 하위 메뉴 버튼 클릭 시 해당 분류 상품만 즉시 필터링 렌더링.
   - "전체(all)" 버튼 선택 시 해당 상위 카테고리 전체 상품 렌더링 및 페이지네이션 지원.
   - `js/data/fallbackProducts.js` 모듈을 통한 무중단 환경(오프라인, file://, HTTP 모두 대응) 보장.


---

## 11. 상품 상세페이지 및 장바구니 구현 내역 (작업 007)

### 11.1 상품 상세페이지 (`detail.html`)
- **시안 1:1 매칭 (`media_1793864446324_3cd1c998.jpg`)**:
  - 메인페이지 카드박스 클릭 시 `detail.html?id={productId}` 파라미터를 통해 동일 상품의 정보(이미지, 상품명, 가격)가 셋팅되는 상세페이지 구성.
  - 157개 전체 상품 데이터가 담긴 `data/products_detail.json`을 단일 소스로 연동 (`products_detail.json` 로드 실패 시 `fallbackProducts` 자동 대체).
  - **상세 레이아웃**:
    - 좌측: 대형 메인 이미지 뷰어 + 하단 썸네일 갤러리 (마우스 오버/클릭 시 메인 이미지 실시간 전환).
    - 우측: 상품명, 판매가, 국내/해외배송, 배송방법, 배송비(`3,000원 (50,000원 이상 구매 시 무료)`), 필수 옵션 드롭다운(`[필수] 옵션을 선택해 주세요`), 수량 조절 버튼(`[-] 1 [+]`), TOTAL 금액 실시간 계산기.
  - **버튼 활성화 사양**:
    - `BUY IT NOW`, `CART`, `WISH LIST` 3개 버튼 중 **`CART`(장바구니) 버튼만 활성화**.
    - CART 클릭 시 로컬스토리지에 현재 상품 및 수량을 저장하고, 안내 토스트/모달 노출 후 `cart.html`로 자연스럽게 이동.
    - `BUY IT NOW` 및 `WISH LIST` 버튼은 시안 형태를 유지하되 클릭 시 준비 중 안내 메시지 제공.

### 11.2 장바구니 페이지 (`cart.html`)
- **시안 1:1 매칭 (`media_1793864448366_68c91d34.png`)**:
  - 2단 반응형 장바구니 구조 (좌측: 일반상품 리스트, 우측: 주문/결제 요약 박스).
  - **LocalStorage 기반 상태 관리 (`js/services/cartService.js`)**:
    - 모든 장바구니 품목(`id`, `name`, `price`, `imageUrl`, `quantity`, `selected`)을 `vlast_cart_items` 키에 영구 보존.
    - 탭 간 동기화(`storage` 이벤트) 및 커스텀 `vlast_cart_updated` 이벤트를 통한 UI 자동 동기화.
  - **상품 리스트 기능**:
    - 전체 선택 / 개별 선택 체크박스 지원.
    - 썸네일 이미지, 상품명, 판매가, 배송비 표기, 이용약관 동의 문구 박스.
    - 수량 조절 컨트롤(`[-] 수량 [+]`) 및 '변경' 버튼으로 수량 증감 즉시 반영.
    - 개별 삭제 버튼(`✕`) 및 하단 선택상품 주문/전체상품 주문 액션 버튼.
  - **우측 결제 요약 박스**:
    - `총 상품금액`: 선택된 상품의 합계.
    - `총 배송비`: 50,000원 이상 구매 시 0원, 50,000원 미만 시 3,000원 (장바구니가 비어 있거나 담긴 상품이 없으면 0원).
    - `결제예정금액`: `총 상품금액 + 총 배송비`.
  - **빈 장바구니 상태 처리**:
    - 장바구니에 상품이 없을 경우 시안 규약대로 **`선택한 상품이 없습니다`** 안내 문구를 리스트 중앙에 표시하고 합계 0원 처리.

### 11.3 전역 장바구니 카운터 뱃지 (`js/components/cartBadge.js`)
- **상단 장바구니 아이콘 뱃지**:
  - 장바구니에 1개 이상의 상품이 담긴 경우, **모든 페이지(`index.html`, `notice.html`, `login.html`, `detail.html`, `cart.html`)의 상단 헤더 및 모바일 하단 내비의 장바구니 아이콘 오른쪽 위에 검은색 원과 흰색 숫자로 디자인된 표시**가 노출.
  - 디자인: 검은색 원(`#000000`), 흰색 텍스트(`#ffffff`), `min-width: 18px`, `height: 18px`, `border-radius: 9999px`, 볼드 서체.
  - 장바구니가 비어 있을 경우(`count === 0`) 뱃지가 자동으로 숨겨짐.


---

## 12. ALBUM 및 ASTERUM 433-10 데이터 매칭 및 구현 내역 (작업 008)

`data/` 폴더 안의 데이터를 상위메뉴(`ALBUM`, `ASTERUM 433-10`)와 매칭하여 기존 구현 부분(TOUR, MERCH, SEASONAL)은 제외하고 미구현된 부분만 추가 매칭 및 구현 완료:

1. **상위메뉴 - 하위메뉴 매칭 현황**:
   - **ALBUM** (`data/ALBUM/ALBUM.json`, **신규 구현**):
     - 상위메뉴: `ALBUM` ↔ 하위메뉴: `ALBUM`
     - 총 20개 상품: PLAVE 5th Mini Album 'HYPERDRIVE' 5종, 4th Mini Album 'Caligo Pt.2' 7종, 2nd Single Album 'PLBBUU' 3종, JP 1ST SINGLE かくれんぼ 4종, 3rd Mini Album 'Caligo Pt.1' 1종.
   - **ASTERUM 433-10** (`data/ASTERUM 433-10/ASTERUM 433-10.json`, **신규 구현**):
     - 상위메뉴: `ASTERUM 433-10` ↔ 하위메뉴: `ASTERUM 433-10`
     - 총 20개 상품: FROM BAMBY TIN CASE(품절), ASTERUM DECAF 01 DRIPBAG, ASTERUM BLEND 03 DRIPBAG, FROM EUNHO TIN CASE, ASTERUM STICKCOFFEE, FROM HAMIN TIN CASE, FROM NOAH TIN CASE, ASTERUM COFFEE BEAN 시리즈, 굿즈(COLD CUP, BADGE SET, BLANKET) 등.
   - **전체 상품 카탈로그 규모**:
     - 기존: TOUR 65개, MERCH 75개, SEASONAL 17개 (157개)
     - 신규 추가: ALBUM 20개, ASTERUM 433-10 20개 (40개)
     - **총 197개 상품** 전체 로드 및 매칭 완료.

2. **상품 박스(카드) 데이터 모델 매칭 및 이미지 경로 반영**:
   - `id`: 원본 JSON의 고유 id 반영.
   - `name`: 상품명 (`card__name`).
   - `price` & `priceDisplay`: 포맷팅된 한국 원화 표기(`6,000원`, `81,500원` 등) 반영 (`card__price`).
   - `imageUrl`: JSON 파일에 명시된 `image_url` 경로(HTTPS 절대경로 및 상대경로)를 `<img src="...">`에 100% 반영.
   - `isSoldOut`: `is_soldout` 플래그 매칭하여 품절 상품(예: `FROM BAMBY TIN CASE`)에 `품절` 뱃지(`card__soldout`) 표시.
   - `href`: 상품 상세 링크 `detail.html?id={id}&parent={parentCategory}` 매칭.

3. **GNB 및 모바일 내비게이션 연동**:
   - 상단 GNB의 `ALBUM` 및 `ASTERUM 433-10` 클릭 시 해당 상위 카테고리로 즉시 전환되어 20개 상품 목록 및 하위 메뉴 버튼(`전체`, `ALBUM` 또는 `전체`, `ASTERUM 433-10`) 렌더링.
   - 모바일 전체메뉴 드로어(`index.html` 856번째 줄)에서 `ASTERUM 433-10` 클릭 시에도 상위 카테고리 전환이 정상 동작하도록 연동 보완.
   - `data/products_detail.json` 및 `js/data/fallbackProducts.js`에 ALBUM 20개 및 ASTERUM 433-10 20개를 모두 포함하여 상세페이지(`detail.html`) 및 장바구니(`cart.html`)와의 연계 완료.


---

## 13. 상품 카드/상세 이미지 호버 액션 버튼(WISH / ADD) 구현 내역 (작업 009)

- **레퍼런스 이미지 반영 (`media_1793866137630_fcbf415b.jpg`)**:
  - 상품 썸네일(메인 카탈로그 카드 및 상세페이지 대형 이미지 뷰어)에 마우스 오버 시 중앙에 2개의 액션 버튼(`WISH`, `ADD`)이 부드럽게 나타나도록 구현.
- **버튼 디자인 및 마우스 오버 인터랙션**:
  - **평소 상태**: `opacity: 0`, `visibility: hidden`, `pointer-events: none`으로 숨김 처리.
  - **카드/썸네일 호버 시**: `opacity: 1`, `visibility: visible`로 전환되어 썸네일 정중앙에 나란히 노출 (`display: flex`, `gap: 10px`).
  - **기본 버튼 스타일**:
    - `background: rgba(255, 255, 255, 0.88)` (반투명 화이트)
    - `color: #111111` (블랙 텍스트)
    - `border: 1px solid rgba(0, 0, 0, 0.18)`
    - `border-radius: 12px` (시안과 일치하는 둥근 직사각형)
    - 블러 효과(`backdrop-filter: blur(6px)`), 부드러운 그림자.
  - **버튼 오버 시 색상 전환 (호버 인터랙션)**:
    - `:hover` 시 레퍼런스 시안의 WISH 버튼과 동일하게 **검은색 배경(`background: #000000`) + 흰색 글씨(`color: #ffffff`) + 검은 테두리(`border-color: #000000`)** 로 즉시 반전 전환.
    - 살짝 떠오르는 모션(`transform: translateY(-2px)`) 및 짙은 그림자(`box-shadow`) 적용.
- **버튼 클릭 액션 연계**:
  - `WISH` 버튼 클릭 시: 링크 이동을 차단(`e.preventDefault()`, `e.stopPropagation()`)하고 관심상품 담기 토스트 안내 노출.
  - `ADD` 버튼 클릭 시: 링크 이동을 차단하고 `cartService.addItem`을 통해 해당 상품을 즉시 장바구니에 1개 추가 + 상단 장바구니 뱃지 실시간 갱신 + 장바구니 안내 토스트 노출.
  - 메인페이지 카드(`.card__thumb`) 및 상세페이지 대형 이미지 뷰어(`.detail-visual__image-wrap`) 모두 적용 완료.


---

## 14. 메인 화면 NEW ARRIVALS 2줄 그리드 및 상품 더보기 구현 내역 (작업 010)

- **레퍼런스 이미지 반영 (`media_1793867000336_7e0f837c.jpg`)**:
  - 홈페이지(`index.html`) 메인 진입 시 섹션 타이틀을 `'NEW ARRIVALS'`로 구성.
  - 가로 4개 × 세로 2개 = 총 8개 (2줄)의 카드박스가 바로 보이도록 기본 배치.
  - 서브 카테고리 네비게이션 및 정렬 툴바는 메인 기본 상태에서 숨김 처리하여 시안과 동일한 뷰 제공.
- **카드박스 구조 (이미지 미구현 규약 준수)**:
  - **"카드박스 안의 이미지는 아직 구현하지마. 구조만 만들어줘."** 지침에 따라 `<img>` 태그를 삽입하지 않고 1:1 비율의 썸네일 박스 구조(`.card__thumb.card__thumb--placeholder`)만 생성.
  - 썸네일 박스 내 마우스 오버 시 나타나는 `WISH` / `ADD` 액션 버튼 구조 및 호버 시 색상 전환 인터랙션 포함.
  - 썸네일 하단에 상품명(`card__name`), 가격(`card__price`), 품절 뱃지(`card__soldout`) 기본 구조 매칭.
- **상품 더보기 버튼 및 2줄씩 추가 로직**:
  - 카드 그리드 하단 중앙에 직사각형의 `상품 더보기(1/10)` 버튼 배치 (`.catalog-more-btn`).
  - 더보기 버튼 클릭 시마다 다음 2줄(8개 상품)이 데이터에 맞게 그리드 하단에 누적 추가(`append`).
  - 버튼 문구가 `상품 더보기(2/10)`, `상품 더보기(3/10)` ... 형태로 실시간 갱신.
  - 전체 데이터(또는 최대 배치) 도달 시 버튼 비활성화 처리.


---

## 15. 메인 화면 NEW ARRIVALS1.json 데이터 및 이미지 경로 매칭 구현 내역 (작업 011)

- **데이터 소스 매칭 (`data/NEW ARRIVALS(main)/NEW ARRIVALS1.json`)**:
  - 메인 화면의 `NEW ARRIVALS` 1번째 배치(가로 4개 × 세로 2개 = 8개 카드)에 `NEW ARRIVALS1.json`의 8개 상품 데이터를 1:1 매칭 완료.
  - 매칭 상품 8종:
    1. `STAR TRACE PHOTOCARD PACK` (7,000원, 품절)
    2. `STAR TRACE ACRYLIC STAND` (18,000원, 품절)
    3. `STAR TRACE TRADING CAN BADGE_RANDOM` (5,000원, 품절)
    4. `STAR TRACE TRADING MINIATURE KEYRING_RANDOM` (9,000원, 품절)
    5. `STAR TRACE STICKER PACK` (9,000원, 품절)
    6. `STAR TRACE IN-EAR EARPHONES` (65,000원, 품절)
    7. `STAR TRACE BALL CAP POUCH KEYRING` (17,000원, 품절)
    8. `STAR TRACE CLICKER KEYRING` (19,500원, 품절)
- **이미지 경로 반영**:
  - `data/NEW ARRIVALS(main)/NEW ARRIVALS1.json`에 명시된 원본 HTTPS 이미지 경로(`image_url`)를 `<img src="...">` 태그로 카드 썸네일 박스(`.card__thumb`)에 100% 반영.
  - 지연 로딩(`loading="lazy"`), 너비/높이 속성, 이미지 에러 시 폴백 처리 유지.
- **카드 박스 구조 및 인터랙션 유지**:
  - 상품명(`card__name`), 판매가(`card__price`), 검은색 품절 뱃지(`card__soldout`) 구조 세팅.
  - 마우스 오버 시 나타나는 `WISH` / `ADD` 호버 액션 버튼 및 호버 시 검은색 반전 인터랙션 유지.
  - 카드 클릭 시 상세페이지(`detail.html?id={id}&parent=NEW%20ARRIVALS`)로 연계되어 동일한 이미지와 상품 정보가 세팅되도록 `data/products_detail.json` 및 `js/data/fallbackProducts.js`에도 8개 상품 동기화 완료 (총 205개 상품).
- **상품 더보기 연동**:
  - 첫 8개(2줄) 렌더링 후 `상품 더보기(1/10)` 버튼 클릭 시 다음 2줄(8개 상품)이 데이터에 맞게 순차적으로 추가 누적 렌더링(`append`).


---

## 16. 공지사항 Firebase Cloud Firestore 마이그레이션 구현 내역 (작업 012)

- **Firebase 프로젝트 연동 (`sso-wed-project`)**:
  - 사용자 제공 `firebaseConfig`를 [js/services/firebase/firebaseConfig.js](file:///c:/Users/Administrator.User-2026NDLUOK/Documents/new_github/vibe-project-2026-Sso/vibe-project-2026-Sso/js/services/firebase/firebaseConfig.js)에 적용 완료.
  - 최신 Firebase SDK v10 Modular 공식 CDN 연동을 통해 번들러/빌드 도구 없는 순수 브라우저 ES Modules 환경에서 Firestore 클라이언트 인스턴스 초기화.
- **서비스 계층 전환 (`noticeService.js`)**:
  - UI 컴포넌트(`notice.html`, `js/modules/notice.js`, `js/components/topNoticeBar.js`)의 코드 수정 없이, [js/services/noticeService.js](file:///c:/Users/Administrator.User-2026NDLUOK/Documents/new_github/vibe-project-2026-Sso/vibe-project-2026-Sso/js/services/noticeService.js)의 export 대상을 Mock에서 `noticeFirebaseService`로 전환 완료.
- **안정성 및 요구사항 반영 (`noticeFirebaseService.js`)**:
  - **첨부파일**: 복잡한 별도 Storage 규칙 설정 없이 기존 DataURL(Base64) 방식을 그대로 유지하여 Firestore 문서 객체에 직접 저장.
  - **보안 설정**: 별도 admin 로그인 없이 누구나 공지사항을 조회·등록·수정·삭제할 수 있는 테스트 환경 지원.
  - **복합 색인 오류 방지**: Firestore Composite Index 생성 여부와 관계없이 에러가 발생하지 않도록 상단 공지 우선 및 최신순 정렬을 보장하는 안전 쿼리 로직 탑재.
  - **자동 마이그레이션 (Auto Seeding)**: Firestore `notices` 컬렉션이 비어있는 경우 기존 LocalStorage 및 상단 고정 공지 4종을 포함한 초기 공지 데이터 세트를 1회 자동 업로드하여 데이터 유실 없는 무중단 전환 보장.

- **패치 및 안정성 보강**:
  - `noticeFirebaseService.js`의 `INITIAL_NOTICES` import 경로 불일치 오류(`../mock/noticeMockService.js` ➔ `../mock/initialNotices.js`) 수정 완료.
  - Firestore 응답 지연/오류 시에도 화면이 멈추지 않도록 3.5초 타임아웃 레이스 및 안전 폴백 렌더링 보호막 추가.

---

## 17. 로그인 / 회원가입 기능 및 공지사항 관리자 권한 제어 구현 내역 (작업 013)

- **로그인 및 회원가입 서비스 (`js/services/authService.js`)**:
  - Firebase Cloud Firestore의 `users` 컬렉션에 사용자 정보(이름, 아이디, 비밀번호, 이메일, 역할, 등록일) 실시간 저장 및 연동.
  - 기본 관리자 계정(`뚝스`/`admin`) 및 기존 로컬 회원의 Firestore 자동 동기화(`syncToFirebase`) 탑재.
  - **수동 등록 기본 관리자 계정**:
    - 이름: `뚝스`
    - 아이디: `admin`
    - 비밀번호: `1111`
    - 이메일: `admin.com@company.co.kr`
  - **회원가입**: `이름`, `아이디`, `비밀번호`, `이메일` 4개 필수 입력값 검증, Firestore 기반 아이디 중복 체크(`checkIdDuplicate`), 이메일 유효성 검사 후 Firestore `users` 컬렉션 문서로 저장.
  - **로그인 / 로그아웃**: Firestore 실시간 자격 증명 검증 후 브라우저 세션 저장 및 실시간 상태 이벤트(`vlast_auth_changed`) 디스패치.
- **전역 상단 헤더 동적 전환 (`js/components/authHeader.js`)**:
  - 모든 페이지(`index.html`, `notice.html`, `detail.html`, `cart.html`, `login.html`, `signup.html`) 상단 헤더에 실시간 반영:
    - **로그인 시**: `뚝스 환영합니다` (사용자 등급 및 괄호 표기 없이 이름만 표시) + `로그아웃` 버튼 + `주문조회` + `최근본상품`
    - **비로그인 시**: `회원가입`(`signup.html`) + `로그인`(`login.html`) + `주문조회` + `최근본상품`
    - `로그아웃` 버튼 클릭 시 확인 다이얼로그 후 즉시 세션 해제 및 헤더 리렌더링.
- **공지사항(Notice) 기준 디자인의 회원 화면 (`login.html`, `signup.html`, `css/components/login.css`)**:
  - 상단 `MEMBER` 타이틀 및 핑크(`#e0245e`) 2px 하단 라인, 브레드크럼(`HOME > MEMBER > LOGIN` / `SIGNUP`) 구조 적용.
  - **로그인 페이지 (`login.html`)**: 아이디, 비밀번호 입력 필드, 로그인 버튼, 테스트용 관리자 원클릭 자동입력 버튼, 하단에 **회원가입 페이지 이동 링크(`signup.html`)** 배치.
  - **회원가입 페이지 (`signup.html`)**: 별도 독립 페이지로 분리 구성. 이름, 아이디 + 중복확인 버튼, 비밀번호, 비밀번호 확인, 이메일 입력 필드 및 완료 버튼, 하단에 **로그인 페이지 이동 링크(`login.html`)** 배치.
  - **전용 스크립트 분리 (`js/modules/login.js`, `js/modules/signup.js`)**: 회원가입 성공 시 가입된 아이디 정보를 전달하며 로그인 페이지로 자동 전환.
- **공지사항 권한 제어 (`js/modules/notice.js`)**:
  - **글쓰기 버튼 제어**: 목록 화면 우측 상단 `글쓰기 >` 버튼은 `admin` 관리자에게만 노출.
  - **수정 / 삭제 버튼 제어**: 상세 화면 하단 `수정`, `삭제` 버튼은 `admin` 관리자에게만 노출.
  - **라우팅 가드 (URL 보호)**: 일반 회원이나 비로그인 사용자가 `?mode=write` 또는 `?mode=edit` URL로 직접 진입 시 경고 팝업을 띄우고 즉시 목록으로 튕겨내도록 보안 보호 적용.
  - **작성자 연동**: 관리자가 글 작성 시 작성자(`author`) 필드에 로그인된 관리자 이름(`뚝스`)이 자동 세팅.

---

## 18. 상·하단 공통 모듈화(siteLayout.js) 및 회원정보 필드 규격화 (작업 014)

- **상·하단 공통 레이아웃 중앙 제어 모듈 (`js/components/siteLayout.js`)**:
  - 각 페이지(`index.html`, `notice.html`, `cart.html`, `detail.html`, `login.html`, `signup.html`)에 수백 줄씩 반복되던 하드코딩 마크업을 완전히 제거하고, 단일 모듈에서 중앙 집중 제어하도록 리팩터링 완료.
  - **`getHeaderTemplate(activePage)`**: 상단 유틸리티 링크, 브랜드 로고, 쇼핑 아이콘, GNB 카테고리 6종 메뉴 렌더링.
  - **`getBottomNavTemplate(activePage)`**: 모바일 전용 5대 탭(카테고리, 검색, 홈, 장바구니, 마이) 렌더링 및 활성 탭 하이라이트.
  - **`getFloatingUITemplate()`**: 플로팅 맨 위로 이동(스무스 스크롤 자동 바인딩) 및 고객센터 버튼 렌더링.
  - **`getFooterTemplate()`**: 기업 정보, 정책 링크, CIRCLE CHART/HANTEO 인증마크, 고객센터, 저작권, 에스크로 안전결제 배너 등 완성형 공통 푸터 렌더링.
  - **`initSiteLayout(options)`**: 상단/하단 4대 컴포넌트 렌더링 + `initAuthHeader()`(로그인 환영문구) + `initCartBadge()`(장바구니 수량) 자동 통합 실행.
- **회원 정보 필드 규격화 (`js/services/authService.js`)**:
  - 일반회원은 **`role: 'user'`**, 관리자는 **`role: 'admin'`** 으로 규격화.
  - 필수 저장 필드: `createdAt` (ISO 문자열), `email` (문자열), `name` (문자열), `role` ('admin' | 'user'), `username` (아이디 문자열), `id`, `password`.
  - Firebase Cloud Firestore의 `users` 컬렉션에 동일 규격으로 영구 저장 및 자동 동기화.

---

## 19. 커뮤니티(답변형 Q&A) 게시판 구현 내역 (작업 015)

- **Firebase Cloud Firestore 연동 (`community_posts` 컬렉션)**:
  - `js/services/firebase/communityFirebaseService.js`, `js/services/communityService.js` 구현.
  - CRUD(작성, 상세조회, 목록조회, 수정, 삭제) 및 카테고리/기간/키워드 필터링, 조회수 카운트 연동.
  - 초기 데이터 자동 시딩(Auto Seeding) 및 로컬 스토리지 백업 캐시를 지원하여 지연 없이 안정적인 렌더링 보장.
- **질문 유형 6종 드롭다운 & 탭 필터**:
  - `'배송문의'`, `'교환/환불'`, `'계정문의'`, `'시스템오류'`, `'굿즈리뷰'`, `'기타'`.
  - 글 작성/수정 시 필수 선택값으로 지정되며, 목록 상단 탭 버튼을 통해 유형별 모아보기 제공.
- **권한 제어 및 비밀글(비공개) 보호 UX**:
  - **글쓰기**: 로그인 회원만 가능 (미로그인 상태로 클릭 시 로그인 확인 팝업 및 이동 안내).
  - **글 수정/삭제**: 작성자 본인 및 관리자(`admin`)만 가능.
  - **비공개 설정(`isSecret`)**:
    - 리스트 화면: 제목 바로 아래에 `🔒 비공개` 뱃지 노출.
    - 상세 화면: 작성자 본인 또는 관리자가 아닐 경우 본문을 노출하지 않고 `🔒 비밀글로 보호된 게시글입니다. 작성자 본인과 관리자만 확인하실 수 있습니다.` 잠금 안내 카드 노출.
- **답변형 게시판 기능 (관리자 전용 답변)**:
  - 리스트 테이블의 STATUS 컬럼에 `답변완료` 또는 `답변대기` 상태 뱃지 노출.
  - 상세 보기 시 질문글 본문 바로 아래에 관리자 공식 답변 카드 표출.
  - 관리자(`admin`, 예: `뚝스`) 계정으로 로그인한 경우에만 답변 작성/수정/삭제 폼 및 버튼 활성화.
- **이모티콘 3종 의견 반응 (웃음, 슬픔, 좋아요)**:
  - 상세 글 하단에 누구나 클릭 가능한 반응 버튼 3종 제공: `웃음(smile 😊)`, `슬픔(sad 😢)`, `좋아요(like ❤️)`.
  - 버튼 클릭 시 Firestore의 `increment(1)`을 통해 실시간 반응 카운트가 원자적으로 누적 반영.
- **화면 구성 및 디자인 연동**:
  - `community.html`: 시맨틱 마크업 및 `siteLayout.js` 공통 상·하단 연동 (`activePage: "community"`).
  - `css/components/community.css`, `css/main.css`: 공지사항 Notice의 톤앤매너(VLAST 핑크 `#e0245e`, 타이틀 밑줄, 테이블 디자인)를 계승.
  - `js/components/siteLayout.js`: GNB 카테고리 메뉴에 `COMMUNITY` 링크 추가.

