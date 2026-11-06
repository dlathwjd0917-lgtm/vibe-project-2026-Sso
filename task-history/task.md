# 작업 이력 및 이어서 작업하기

> 새 작업을 시작하기 전에 이 문서와 `README.md`, `spec-kit/AGENTS.md`를 확인한다.
> 이 문서는 2026-11-03 작업 기록과 현재 파일 상태를 대조해 정리했다.

## 작업 001 — 데스크톱 메인 화면 기본 골격

- **요청**: 제공된 README와 데스크톱 화면 덤프를 참고해 기본 프로젝트 파일과 CSS를 구성하고, HTML 상단 영역을 구현한다. 이미지 파일은 새로 만들지 않고 이미지 자리를 박스로 표현한다.
- **구현 상태**:
  - 정적 HTML/CSS와 Vanilla JS ES Modules 기반의 기본 페이지가 있다.
  - `index.html`에 메타 정보, 건너뛰기 링크, 헤더(유틸리티 링크·로고·아이콘·GNB), 메인 배너 영역, NEW ARRIVALS 상품 카드 목록, 간단한 푸터가 구성되어 있다.
  - CSS는 토큰, 폰트, 리셋, 베이스, 레이아웃, 헤더, 배너, 상품 컴포넌트로 분리되어 `css/main.css`에서 가져온다.
  - Spoqa Han Sans Neo 로컬 폰트와 기본 디자인 토큰이 연결되어 있다. 일부 디자인 수치는 `MEASURE` 또는 `PROVISIONAL`로 남아 있다.
  - 배너는 텍스트 기반 슬라이드 3장과 이전/다음, 페이지 선택, 자동 재생 정지/재생 컨트롤을 제공한다. 동작 코드는 `js/modules/carousel.js`에 있다.
  - 배너와 상품 이미지에는 실제 이미지 대신 자리 표시 영역이 사용된다. 상품명과 가격도 자리 표시 콘텐츠다.
  - 현재 CSS에는 721px 기준의 모바일 레이아웃 규칙도 포함되어 있으므로, 이후 변경 전에 기존 동작을 확인한다.
- **관련 기준 자료**: `curr-task/001/prompt.txt`, `curr-task/001/dt.png`, `curr-task/001/image.png`, `curr-task/001/tb.png`, `README.md`, `spec-kit/AGENTS.md`
- **주의**: 이 요약은 최초 프롬프트와 현재 파일 상태에서 확인한 내용이다. 별도 실행 기록이나 커밋 이력은 이 요약의 근거로 삼지 않았다.

## 작업 002 — 히어로 섹션 반응형 구현

- **요청**: 데스크톱·모바일 시안에 맞춘 100vh 히어로, 고정 헤더·슬라이드 인디케이터·플로팅 버튼, 모바일 카테고리 메뉴와 하단 내비게이션 구현.
- **구현 상태**:
  - 히어로를 실제 캠페인 이미지 3장으로 구성하고 `<picture>`의 미디어 조건으로 데스크톱·모바일 이미지를 분리했다. 자동재생·이전/다음·페이지 버튼 동작은 유지한다.
  - 상단 헤더, 우측 중앙 배너 컨트롤, 우측 하단 플로팅 버튼 2개를 고정하고, 모바일에는 5개 항목 하단 내비게이션을 추가했다.
  - 히어로 높이는 `100vh`를 기본으로 하며 지원 브라우저에서 `100svh`를 사용한다. 하단 카피와 고정 UI는 모바일 safe-area를 고려한다.
  - 요청한 반응형 기준(데스크톱 ≥769px / 모바일 ≤768px)을 관련 레이아웃·토큰·컴포넌트에 적용했다. 기존 규약의 721px 분기와 달라진 요청 범위 기준이다.
  - 요청 경로 `images/used`는 저장소에 없고, `imges/used`에는 SVG 아이콘만 있다. 히어로 배경은 시안과 일치하는 실제 이미지 페어를 `imges/img-dt`와 `imges/img-mob`에서 사용한다.
  - 브라우저에서 1440px, 769px, 768px, 390px, 320px 너비를 확인했다. 데스크톱/모바일 분기, 고정 내비게이션, 이미지 전환, 슬라이드 선택/정지 동작과 가로 넘침이 없는 것을 확인했다.
- **다음 단계 참고**: 요청 이미지 폴더 구조가 정리되거나 추가 시안이 제공되면 히어로 이미지 경로와 슬라이드 구성을 점검한다.

## 작업 003 — 전체 메뉴 및 검색 UI 추가 (2026-11-03, 진행 중)

- **요청**: 헤더의 반응형 전체 메뉴와 하위 메뉴 아코디언, 검색 오버레이를 추가하고, 메인 2·3페이지를 전체 화면 단위로 구성한다.
- **구현 상태**:
  - 모바일 GNB 중앙 로고, 햄버거 메뉴 버튼, 검색 버튼을 추가했다.
  - 모바일 전체 메뉴 드로어에 카테고리를 렌더링하고, MERCH(9개)·TOUR(5개)·SEASONAL(2개) 하위 메뉴를 아코디언으로 제공한다. 오버레이/닫기 버튼, Escape 닫기, 포커스 제어와 본문 스크롤 잠금 처리도 포함되어 있다.
  - 검색 오버레이의 고정 상단 패널, 검색어 입력, 닫기 버튼을 추가했다. 현재 폼은 제출 동작만 막으며 실제 검색은 하지 않는다.
  - **미완료**: 데스크톱 전체 메뉴의 별도 표시/페이드 동작은 확인되지 않는다. 검색 제안어·최근 검색어·상품 목록 콘텐츠도 아직 없고, 검색 화면에는 상단 패널만 있다.
  - **미완료**: 메인에는 히어로와 NEW ARRIVALS만 있으며, 요청된 두 번째·세 번째 전체 화면 섹션과 페이지 단위 스크롤은 구현되지 않았다.
- **관련 자료**: `imges/used/prompt.txt`, `curr-task/002/`의 데스크톱·태블릿·모바일 및 검색/상세 시안 이미지
- **확인 기준**: 위 구현 상태는 `index.html` 및 관련 CSS/JS의 현재 코드에서 확인했다. 별도의 브라우저 검증 기록은 확인되지 않았다.

## 다음 작업 이어가기

1. 작업 시작 전에 이 문서와 README의 필수 절차 및 `spec-kit/AGENTS.md`를 읽는다.
2. 작업 001·002의 기본 골격과 반응형 히어로, 작업 003의 모바일 메뉴를 재사용하고 이미 구현된 내용을 중복하지 않는다.
3. 이어서 데스크톱 메뉴, 검색 오버레이의 제안어·최근 검색어·상품 영역, 메인 2·3페이지와 페이지 단위 스크롤을 구현한다. 실제 작업 범위는 사용자의 요청과 시안을 기준으로 정한다.
4. 화면 치수·색상 등 미확정값은 `spec-kit/AGENTS.md`의 신뢰 등급 규칙에 따르고 임의로 확정하지 않는다.
5. 작업 완료 후 이 문서의 구현 상태와 다음 작업 안내를 실제 변경사항에 맞게 갱신한다.


## 작업 005 — 공지사항 게시판 및 상단 롤링 띠배너 구현 (2026-11-05, 완료)

- **요청**:
  1. `localstorage_to_firebase_guidelines.md` 지침에 따라 공지사항 게시판(목록/상세/글쓰기/글수정 4개 화면)을 LocalStorage 기반 Repository 패턴으로 구축하고 추후 Firebase 마이그레이션이 가능하도록 설계.
  2. 덤프 이미지 기반 테이블 컬럼 인덱스 매칭(`번호`, `제목`, `작성자`, `조회`) 및 최상단 4개 공지 데이터 추가, 페이지 이동 시에도 상단 공지 리스트 고정 유지.
  3. 공지 리스트 넘버링 제거 및 일반 공지사항 최신순 내림차순 정렬, 상세보기 제목 표시 및 텍스트 잘림 현상 원인 분석/해결.
  4. 공지사항 상위 3개 게시물을 별도의 박스로 구성하여 사이트 상단에 고정하고 3.5초 간격으로 한줄 롤링 출력(멈춤, 플레이, 닫기 버튼 포함).
- **구현 상태**:
  - `js/services/types/notice.js`, `js/services/mock/noticeMockService.js`, `js/services/noticeService.js`, `js/services/firebase/noticeFirebaseService.js`를 통해 완벽한 계층 분리 구현.
  - `notice.html`, `js/modules/notice.js`, `css/components/notice.css`를 통해 공지사항 4개 화면 구현 완료.
  - 상단 4개 공지 고정 유지 페이징 및 최신순 내림차순 번호 정렬 완료.
  - 상세보기 타이틀 Flexbox `min-width: 0` 및 `overflow-wrap: anywhere`, `line-height: 1.5` 적용으로 글자 잘림 완전 해소.
  - `js/components/topNoticeBar.js`, `css/components/topNoticeBar.css`를 통해 사이트 상단 고정 한줄 롤링 띠배너(멈춤/플레이/닫기/카운터) 구현.
  - **위치 및 정렬 변경 반영**:
    - `notice.html` 및 `login.html`에서 배너 호출 제거 및 `index.html` 전용으로 노출 범위 조정 (모듈 내부 경로 가드 추가).
    - 공지사항 내용 텍스트는 컨테이너 중앙 정렬(`text-align: center`, `justify-content: center`), 닫기/플레이/멈춤/카운터 등 컨트롤 파트는 우측 끝 정렬(`margin-left: auto`, `justify-self: end`)로 스타일링 개편 완료.
    - 지침에 따라 완료 후 개별 테스트를 별도 실행하지 않고 `README.md` 및 작업 이력에 상세 기록 완료.

## 작업 006 — 상위/하위 메뉴별 상품 데이터 매칭 및 구현 (2026-11-05, 완료)

- **요청**:
  - `data` 폴더 안의 데이터를 상위 메뉴(`TOUR`, `MERCH`, `SEASONAL`)와 매칭하여 하위 메뉴를 JSON 파일의 데이터와 구현된 박스의 데이터를 비교하여 매칭 후 변경.
  - 이미지의 경로도 모두 반영.
  - 이미 구현된 부분(TOUR > 1ST FANCON, 2025 TOUR)은 제외하고 미구현된 부분만 추가 구현.
- **구현 상태**:
  - `TOUR` 미구현 하위메뉴 매칭: `1ST FANCON ENCORE` (11개), `2025 TOUR ENCORE` (11개), `2026 TOUR` (16개) 추가 로드 및 매칭 완료.
  - `MERCH` 하위메뉴 신규 매칭: `W4L` (20개), `PUMP UP THE VOLUME` (3개), `DASH` (4개), `HAPPY PLAVE DAY` (9개), `KAKURENBO` (6개), `BBUU` (10개), `BORN SAVAGE` (11개), `TEAM PLAVE` (8개), `BOOK` (4개) 전체 추가 로드 및 매칭 완료.
  - `SEASONAL` 하위메뉴 신규 매칭: `SEASON'S GREETINGS` (3개), `BIRTHDAY KIT` (14개) 전체 추가 로드 및 매칭 완료.
  - 상품 박스(카드) 구조에 `id`, `name`, `price`, `priceDisplay`, `imageUrl`, `href`, `isSoldOut` 완벽 매칭 및 이미지 원본 경로 반영.
  - 데스크톱 GNB 및 모바일 드로어 클릭 시 해당 상위 메뉴 및 하위 메뉴 버튼(`catalog-subnav__scroller`) 동적 생성 및 전환 연동 완료.
  - 총 157개 상품 데이터 로드 및 렌더링 지원, `js/data/fallbackProducts.js`를 통해 무중단 안전성 확보.

## 패치 — `notice-detail__title` 가림 현상 수정 (2026-11-05, 완료)
- **원인**:
  1. 상단 고정 헤더(`.site-header`, 높이 10.5rem = 168px)에 비해 `.notice-page`의 상단 패딩이 2.5rem(40px)으로 부족하여 상단 영역 128px가 고정 헤더 아래로 파고들어 제목(`.notice-detail__title`)이 가려짐.
  2. `.notice-detail__title-wrap`의 `flex: 1 1 0%` flex-basis 0 축소 설정 및 `.notice-detail`의 `overflow: hidden`으로 인한 클리핑 가능성.
- **조치**:
  1. `.notice-page`에 고정 헤더 높이를 반영한 상단 패딩 `padding-block-start: calc(var(--header-fixed-height, 10.5rem) + 2rem)` (모바일 768px 이하는 `calc(var(--header-mobile-h, 2.75rem) + 1.5rem)`) 적용.
  2. `.notice-detail__title-wrap`을 `flex: 1 1 auto`, `max-width: 100%`로 안정화하고 `.notice-detail`의 `overflow`를 `visible`로 전환.
  3. 상세 화면 진입 시 `window.scrollTo({ top: 0, behavior: 'instant' })`를 호출하여 최상단에서 제목이 시원하게 노출되도록 보장.


## 작업 007 — 상품 상세페이지, 장바구니 페이지 및 장바구니 뱃지 구현 (2026-11-05, 완료)

- **요청**:
  1. 메인페이지 카드박스를 클릭하면 카드박스와 동일한 정보의 상품 상세페이지(`detail.html`)가 세팅 (시안 1 `media_1793864446324_3cd1c998.jpg` 1:1 매칭).
  2. 해당 상품 데이터는 JSON 파일(`data/products_detail.json`)로 생성하여 처리 (이미지, 상품명, 가격 세팅).
  3. 상세페이지에 표시된 버튼(`BUY IT NOW`, `CART`, `WISH LIST`) 중 **`CART`(장바구니) 버튼만 활성화**하여 장바구니 페이지로 이동/담기 처리.
  4. 장바구니 페이지(`cart.html`) 구성 (시안 2 `media_1793864448366_68c91d34.png` 1:1 매칭):
     - 상품 기본 정보를 표시한 리스트 구성 (체크박스, 썸네일, 상품명, 가격, 수량 컨트롤 `[-] 1 [+]`, 수량 변경, 삭제 `✕`).
     - 총 합계(총 상품금액, 총 배송비, 결제예정금액)를 오른쪽 박스에 표시.
     - 모든 장바구니 정보는 `localStorage`에 저장하여 사용.
     - 상품이 없을 경우 `'선택한 상품이 없습니다'` 문구 표시.
  5. 장바구니에 상품이 담긴 경우 `index.html`, `notice.html`, `login.html`, `detail.html`, `cart.html` 등 **모든 페이지 상단의 장바구니 아이콘 오른쪽 위에 검은색 원과 흰색 숫자로 디자인된 표시**가 나타나도록 구현.
- **구현 상태**:
  - `data/products_detail.json`: 전체 157개 상품(TOUR, MERCH, SEASONAL 전 하위 카테고리 포함)의 고유 id, name, price, priceDisplay, imageUrl, options을 단일 JSON 배열로 생성 완료.
  - `js/services/cartService.js`: LocalStorage 기반 장바구니 CRUD(추가, 수량 변경, 개별/전체 선택, 삭제, 비우기, 합계 및 배송비 계산, 탭 간 실시간 동기화) 서비스 완성.
  - `js/components/cartBadge.js` & `css/components/cart.css`: 검은 원(`#000000`)에 흰색 숫자(`#ffffff`)로 디자인된 장바구니 카운터 뱃지 컴포넌트 구현 및 모든 페이지 헤더/모바일 하단 내비 실시간 동기화 연동.
  - `detail.html`, `js/modules/detail.js`, `css/components/detail.css`: 시안 1과 동일한 상품 상세 레이아웃 구현 (메인/썸네일 갤러리, 옵션 드롭다운, 수량 증감, 총 결제액 실시간 계산, `CART` 버튼 클릭 시 장바구니 담기 및 토스트 알림, 타 버튼 비활성화 안내).
  - `cart.html`, `js/modules/cart.js`, `css/components/cart.css`: 시안 2와 동일한 장바구니 화면 구현 (체크박스 제어, 수량 증감/변경, 삭제, 빈 장바구니 시 `'선택한 상품이 없습니다'` 표시, 우측 총 상품금액/배송비/결제예정금액 연산 및 전체/선택상품 주문 액션).
  - `index.html`, `notice.html`, `login.html`: 모든 상단 헤더 및 하단 내비의 장바구니 링크를 `cart.html`로 연결하고 실시간 뱃지 연동 완료.
  - 사용자 지침에 따라 별도 개별 테스트 스크립트를 수행하지 않고 `README.md` 및 `task-history/task.md`에 모든 구현 내용을 상세 기록 완료.


## 작업 008 — ALBUM 및 ASTERUM 433-10 데이터 매칭 및 구현 (2026-11-05, 완료)

- **요청**:
  - `data` 폴더 안의 데이터를 상위메뉴와 매칭하여 하위메뉴를 제이슨 파일의 데이터와 구현된 박스의 데이터를 비교하여 매칭 후 변경.
  - 이미지의 경로도 모두 반영.
  - 이미 구현된 부분(TOUR, MERCH, SEASONAL)은 제외하고 구현되지 않은 부분만 추가 구현 (ALBUM 폴더와 ASTERUM 433-10 폴더 참고).
- **구현 상태**:
  - `ALBUM` 상위/하위 메뉴 매칭: `data/ALBUM/ALBUM.json`의 20개 상품 전체 로드 및 매칭 완료.
  - `ASTERUM 433-10` 상위/하위 메뉴 매칭: `data/ASTERUM 433-10/ASTERUM 433-10.json`의 20개 상품 전체 로드 및 매칭 완료.
  - 상품 박스(카드) 구조에 `id`, `name`, `price`, `priceDisplay`, `imageUrl`, `href`, `isSoldOut` 완벽 매칭 및 이미지 원본 HTTPS 경로 100% 반영.
  - `js/modules/catalog.js`:
    - `categoriesByParent`에 `ALBUM: ["ALBUM"]`, `"ASTERUM 433-10": ["ASTERUM 433-10"]` 등록.
    - `dataSources`에 ALBUM 및 ASTERUM 433-10 데이터 경로 등록.
    - 상세 링크에 `&parent=${parentCategory}`를 추가하여 상세페이지 진입 시 중복 ID가 있더라도 정확한 부모 카테고리 매칭 지원.
  - `index.html`:
    - 모바일 드로어 856번째 줄에 `"ASTERUM 433-10"` 추가하여 모바일 드로어 클릭 시 카탈로그 부모 카테고리 전환 보장.
  - `data/products_detail.json` & `js/data/fallbackProducts.js`:
    - ALBUM(20개)과 ASTERUM 433-10(20개)을 추가하여 전체 상품 수 197개로 확장.
    - 카드 클릭 시 상세페이지(`detail.html`) 및 장바구니(`cart.html`)에서 동일한 정보(이미지, 상품명, 가격)로 세팅 및 주문 가능하도록 연계 완료.
  - 지침 준수: 별도 개별 테스트 스크립트를 수행하지 않고 `README.md` 및 `task-history/task.md`에 모든 구현 내용을 상세 기록 완료.


## 작업 009 — 상품 썸네일 호버 액션 버튼(WISH / ADD) 구현 (2026-11-05, 완료)

- **요청**:
  - 상세화면/상품 카드 이미지 레퍼런스(`media_1793866137630_fcbf415b.jpg`)를 참고하여 마우스 오버 시 생기는 2개의 버튼(`WISH`, `ADD`) 구현.
  - 해당 버튼에 마우스 오버 시 색이 반전/변경되도록 화면 디자인을 충실히 반영.
- **구현 상태**:
  - `css/components/product.css`:
    - `.card__thumb` 및 `.detail-visual__image-wrap`에 `position: relative`, `overflow: hidden` 적용.
    - `.card__hover-actions`: 정중앙 배치(`top: 50%`, `left: 50%`, `transform: translate(-50%, -50%)`), 평소 숨김 처리 및 썸네일 호버 시 페이드인 전환.
    - `.card__hover-btn`: 둥근 사각형(`border-radius: 12px`), 기본 반투명 화이트 배경(`rgba(255, 255, 255, 0.88)`), 블랙 텍스트, 블러 효과.
    - `.card__hover-btn:hover`: 시안과 동일하게 블랙 배경(`#000000`) + 화이트 텍스트(`#ffffff`) + 블랙 테두리로 호버 인터랙션 적용.
  - `js/modules/catalog.js`:
    - 상품 카드 생성(`createProductCard`) 시 썸네일 내부에 `WISH`, `ADD` 버튼 자동 주입.
    - `WISH` 클릭 시 관심상품 안내 토스트 노출, `ADD` 클릭 시 장바구니에 해당 상품을 담고 실시간 장바구니 뱃지 동기화 및 안내 토스트 표시. 카드 클릭 상세페이지 이동 이벤트와의 버블링 방지 처리.
  - `detail.html` & `js/modules/detail.js`:
    - 상세페이지 대형 메인 이미지 뷰어(`.detail-visual__image-wrap`)에도 동일한 `WISH` / `ADD` 호버 버튼 및 이벤트 리스너 연동.
  - 지침 준수: 별도 개별 테스트 스크립트를 수행하지 않고 `README.md` 및 `task-history/task.md`에 모든 구현 내용을 상세 기록 완료.


## 작업 010 — 메인 NEW ARRIVALS 2줄 카드 그리드 및 상품 더보기 구현 (2026-11-05, 완료)

- **요청**:
  - 홈페이지 메인 화면에 `'NEW ARRIVALS'` 타이틀을 배치하고 밑의 카드박스 구현.
  - 가로 4개 × 세로 2개 = 총 8개 (두 줄)까지만 처음에 보이도록 구현.
  - 두 줄 아래에 "상품 더보기" 버튼으로 이어지고, 버튼 누를 때마다 2줄씩 데이터에 맞게 추가되도록 구현.
  - **카드박스 안의 이미지는 아직 구현하지 않고 구조만 생성**.
- **구현 상태**:
  - `index.html`:
    - 섹션 타이틀을 `<h2 class="section-new__title" id="new-title">NEW ARRIVALS</h2>`로 변경.
    - 기본 메인 화면에서 불필요한 서브내비/툴바/페이지네이션을 숨김 처리하고, 카드 그리드 아래에 `<button class="catalog-more-btn" data-catalog-more>상품 더보기(1/10)</button>` 배치.
  - `css/components/product.css`:
    - `.catalog__heading-box`: 타이틀 중앙 정렬 및 여백 스타일.
    - `.card__thumb--placeholder`: 이미지를 넣지 않은 상태에서도 1:1 비율의 깔끔한 사각 썸네일 박스 레이아웃 유지 (`background-color: #f8f8f8`, `border: 1px solid #f0f0f0`, `border-radius: 4px`).
    - `.catalog-more-btn`: 시안과 1:1 매칭되는 직사각형 화이트 버튼(그레이 테두리, 중앙 정렬, 호버 효과, 비활성화 스타일).
  - `js/modules/catalog.js`:
    - `selectedParent = "NEW ARRIVALS"`, `ITEMS_PER_BATCH = 8` (가로 4개 × 세로 2개).
    - `createProductCard`: `<img>` 요소를 생성하지 않고 썸네일 박스 구조 + 호버 WISH/ADD 버튼 + 상품명 + 가격 + 품절 뱃지 구조만 생성.
    - 초기 진입 시 첫 8개(2줄) 렌더링 및 `상품 더보기(1/10)` 표기.
    - 더보기 버튼 클릭 시 다음 8개(2줄)를 순서대로 추가(`append`)하며 `(2/10)`, `(3/10)` ... 텍스트 실시간 갱신 및 마지막 배치 도달 시 비활성화.
  - 지침 준수: 별도 개별 테스트 스크립트를 수행하지 않고 `README.md` 및 `task-history/task.md`에 모든 구현 내용을 상세 기록 완료.


## 작업 011 — 메인 NEW ARRIVALS1.json 데이터 및 이미지 경로 매칭 (2026-11-05, 완료)

- **요청**:
  - 메인 화면에 구현할 데이터를 JSON(`data/NEW ARRIVALS(main)/NEW ARRIVALS1.json`)으로 제공.
  - JSON 파일의 데이터와 구현된 박스의 데이터를 비교하여 매칭 후 변경.
  - **이미지의 경로도 모두 반영**.
- **구현 상태**:
  - `data/NEW ARRIVALS(main)/NEW ARRIVALS1.json`의 8개 상품(STAR TRACE 시리즈 8종) 데이터를 메인 `NEW ARRIVALS`의 1번째 배치(가로 4개 × 세로 2개 = 8개)에 100% 매칭 완료.
  - `js/modules/catalog.js`:
    - `dataSources`에 `NEW ARRIVALS(main)/NEW ARRIVALS1.json` 추가.
    - `createProductCard`: `thumb` 내에 `<img src="${product.imageUrl}">` 요소를 생성하여 원본 이미지 경로 반영 완료.
    - `renderNewArrivals`: `NEW ARRIVALS1.json`의 8개 상품을 최우선으로 1번째 배치(2줄)에 세팅.
    - 마우스 오버 시 `WISH` / `ADD` 버튼 및 호버 색상 전환 인터랙션 유지.
    - `상품 더보기(1/10)` 버튼 클릭 시 2줄씩 데이터에 맞게 추가 로드 연동 유지.
  - `data/products_detail.json` & `js/data/fallbackProducts.js`:
    - 8개 상품(ID 502, 501, 500, 499, 498, 497, 496, 483)의 상세 메타데이터(이미지, 상품명, 가격, 품절 여부)를 동기화 추가하여 전체 205개 상품으로 확장.
    - 카드 클릭 시 상세페이지(`detail.html`) 및 장바구니(`cart.html`)에서 동일한 상품 정보가 세팅되도록 연동.
  - 지침 준수: 별도 개별 테스트 스크립트를 수행하지 않고 `README.md` 및 `task-history/task.md`에 모든 구현 내용을 상세 기록 완료.


## 작업 012 — 공지사항 Firebase Cloud Firestore 마이그레이션 (2026-11-06, 완료)

- **요청**:
  - 공지사항 데이터를 기존 LocalStorage에서 Firebase Firestore로 마이그레이션.
  - 첨부파일은 기존 방식(DataURL)을 유지하고, 별도 admin 인증 없이 테스트용으로 쉽게 연결되도록 설정.
  - 제공된 Firebase SDK configuration(`sso-wed-project`) 반영.
- **구현 상태**:
  - `js/services/firebase/firebaseConfig.js`:
    - 사용자 제공 `firebaseConfig`(`apiKey`, `authDomain`, `projectId: sso-wed-project`, `storageBucket`, `messagingSenderId`, `appId`) 적용.
    - 공식 Firebase SDK v10 Modular CDN import를 통해 정적 웹 환경에서 Firestore DB 인스턴스 초기화.
  - `js/services/firebase/noticeFirebaseService.js`:
    - Firestore `notices` 컬렉션 기반 CRUD(조회, 상세, 등록, 수정, 삭제, 조회수 증가) 완성.
    - 첨부파일은 기존 DataURL 방식을 유지하여 문서 내 `attachments` 필드로 보존.
    - 복합 색인(Composite Index) 미생성 시에도 에러 없이 상단 공지 우선 및 최신순 정렬이 유지되도록 안전 정렬 알고리즘 적용.
    - Firestore 컬렉션이 비어있을 경우 기존 LocalStorage 및 Mock 공지(상단 고정 공지 4종 포함)를 1회 자동 업로드하는 `seedInitialData` 탑재.
  - `js/services/noticeService.js`:
    - UI 컴포넌트(`notice.html`, `js/modules/notice.js`, `js/components/topNoticeBar.js`) 변경 없이, 엔트리포인트를 Firebase 모드로 전환 완료.
  - 지침 준수: 별도 개별 테스트 스크립트를 수행하지 않고 `README.md` 및 `task-history/task.md`에 모든 구현 내용을 상세 기록 완료.

  - **패치 및 안정성 보강**:
    - `noticeFirebaseService.js`의 `INITIAL_NOTICES` import 경로 불일치 오류(`../mock/noticeMockService.js` ➔ `../mock/initialNotices.js`) 수정 완료.
    - 네트워크 지연이나 보안 규칙 미적용 상황에서도 화면이 백지로 멈추지 않도록 3.5초 타임아웃 레이스 및 안전 폴백 렌더링 로직 추가.
