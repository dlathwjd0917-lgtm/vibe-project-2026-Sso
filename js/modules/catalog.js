import { FALLBACK_PRODUCTS } from "../data/fallbackProducts.js";
import { cartService } from "../services/cartService.js";

const categoriesByParent = {
  ALBUM: ["ALBUM"],
  MERCH: [
    "W4L",
    "PUMP UP THE VOLUME",
    "DASH",
    "HAPPY PLAVE DAY",
    "KAKURENBO",
    "BBUU",
    "BORN SAVAGE",
    "TEAM PLAVE",
    "BOOK"
  ],
  TOUR: ["1ST FANCON", "1ST FANCON ENCORE", "2025 TOUR", "2025 TOUR ENCORE", "2026 TOUR"],
  SEASONAL: ["SEASON'S GREETINGS", "BIRTHDAY KIT"],
  "ASTERUM 433-10": ["ASTERUM 433-10"]
};

// 메인 화면 기본 설정: 가로 4개 × 세로 2개 = 8개 (2줄) 단위 로드
const ITEMS_PER_ROW = 4;
const ROWS_PER_BATCH = 2;
const ITEMS_PER_BATCH = ITEMS_PER_ROW * ROWS_PER_BATCH; // 8개
const TARGET_TOTAL_BATCHES = 10; // 시안의 (1/10) 규격 매칭

const products = [];

let selectedParent = "NEW ARRIVALS"; // 기본 메인 화면은 NEW ARRIVALS
let selectedCategory = "all";
let currentBatch = 1; // 현재 줄 묶음 (1페이지 = 2줄 8개)
let selectedPage = 1; // 카테고리 상세 모드용 페이지
let selectedSort = "default";

/**
 * data 폴더 안의 데이터 소스 매핑 목록
 */
const dataSources = [
  // 0. NEW ARRIVALS (메인 화면)
  {
    parent: "NEW ARRIVALS",
    category: "NEW ARRIVALS",
    paths: ["data/NEW ARRIVALS(main)/NEW ARRIVALS1.json"]
  },

  // 1. TOUR (상위메뉴)
  {
    parent: "TOUR",
    category: "1ST FANCON",
    paths: ["data/tour/product_data_json.md", "data/product_data_json.md"]
  },
  {
    parent: "TOUR",
    category: "2025 TOUR",
    paths: ["data/tour/products.json", "data/tour/2025 TOUR.json", "data/products.json"]
  },
  {
    parent: "TOUR",
    category: "1ST FANCON ENCORE",
    paths: ["data/tour/1ST FANCON ENCORE.json"]
  },
  {
    parent: "TOUR",
    category: "2025 TOUR ENCORE",
    paths: ["data/tour/2025 TOUR ENCORE.json"]
  },
  {
    parent: "TOUR",
    category: "2026 TOUR",
    paths: ["data/tour/2026 TOUR.json"]
  },

  // 2. MERCH (상위메뉴)
  {
    parent: "MERCH",
    category: "W4L",
    paths: ["data/MERCH/W4L.json"]
  },
  {
    parent: "MERCH",
    category: "PUMP UP THE VOLUME",
    paths: ["data/MERCH/PUMP UP THE VOLUME.json"]
  },
  {
    parent: "MERCH",
    category: "DASH",
    paths: ["data/MERCH/DASH.json"]
  },
  {
    parent: "MERCH",
    category: "HAPPY PLAVE DAY",
    paths: ["data/MERCH/HAPPY PLAVE DAY.json"]
  },
  {
    parent: "MERCH",
    category: "KAKURENBO",
    paths: ["data/MERCH/KAKURENBO.json"]
  },
  {
    parent: "MERCH",
    category: "BBUU",
    paths: ["data/MERCH/BBUU.json"]
  },
  {
    parent: "MERCH",
    category: "BORN SAVAGE",
    paths: ["data/MERCH/BORN SAVAGE.json"]
  },
  {
    parent: "MERCH",
    category: "TEAM PLAVE",
    paths: ["data/MERCH/TEAM PLAVE.json"]
  },
  {
    parent: "MERCH",
    category: "BOOK",
    paths: ["data/MERCH/BOOK.json"]
  },

  // 3. SEASONAL (상위메뉴)
  {
    parent: "SEASONAL",
    category: "SEASON'S GREETINGS",
    paths: ["data/SEASONAL/SEASON'S GREETINGS.json"]
  },
  {
    parent: "SEASONAL",
    category: "BIRTHDAY KIT",
    paths: ["data/SEASONAL/BIRTHDAY KIT.json"]
  },

  // 4. ALBUM (상위메뉴)
  {
    parent: "ALBUM",
    category: "ALBUM",
    paths: ["data/ALBUM/ALBUM.json"]
  },

  // 5. ASTERUM 433-10 (상위메뉴)
  {
    parent: "ASTERUM 433-10",
    category: "ASTERUM 433-10",
    paths: ["data/ASTERUM 433-10/ASTERUM 433-10.json"]
  }
];

/**
 * 제이슨 레코드 데이터를 박스(카드) 데이터 모델로 정규화
 */
function normalizeProduct(record, parentCategory, category) {
  if (!record || typeof record.name !== "string") {
    return null;
  }
  const numPrice = Number(record.price);
  if (!Number.isFinite(numPrice)) {
    return null;
  }

  let imageUrl = typeof record.image_url === "string" ? record.image_url.trim() : "";
  if (imageUrl.startsWith("//")) {
    imageUrl = "https:" + imageUrl;
  } else if (imageUrl.startsWith("/")) {
    imageUrl = "https://vlastshop.com" + imageUrl;
  }

  const urlPath = record.product_url || record.link || "#";
  const href = urlPath.startsWith("http") ? urlPath : new URL(urlPath, "https://vlastshop.com").href;

  return {
    id: record.id,
    parentCategory,
    category,
    name: record.name,
    price: numPrice,
    priceDisplay: record.price_formatted || record.price_display || `${numPrice.toLocaleString("ko-KR")}원`,
    imageUrl,
    href,
    isSoldOut: record.is_soldout === true || record.is_sold_out === true
  };
}

/**
 * data 폴더 안의 각 상위/하위 메뉴별 JSON 데이터를 로드하여 상품 배열로 변환
 */
async function loadProductData() {
  const allProducts = [];

  for (const source of dataSources) {
    let loadedItems = null;
    for (const filePath of source.paths) {
      try {
        const response = await fetch(encodeURI(filePath));
        if (response.ok) {
          const records = await response.json();
          if (Array.isArray(records)) {
            loadedItems = records
              .map((record) => normalizeProduct(record, source.parent, source.category))
              .filter(Boolean);
            break;
          }
        }
      } catch (err) {
        // 다음 대체 경로 시도
      }
    }

    if (loadedItems && loadedItems.length > 0) {
      allProducts.push(...loadedItems);
    } else {
      const fallbacks = FALLBACK_PRODUCTS.filter(
        (p) => p.parentCategory === source.parent && p.category === source.category
      );
      if (fallbacks.length > 0) {
        allProducts.push(...fallbacks);
      }
    }
  }

  if (allProducts.length === 0) {
    allProducts.push(...FALLBACK_PRODUCTS);
  }

  return allProducts;
}

/**
 * 장바구니/관심상품 토스트 안내 팝업
 */
function showToast(message) {
  const existing = document.querySelector(".cart-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "cart-toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `
    <span>${message}</span>
    <a href="cart.html">장바구니 바로가기 &gt;</a>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

/**
 * 상품 카드 박스 생성
 * [요청사항 준수]: 카드박스 안의 이미지는 아직 구현하지 않고 구조만 생성
 * - 썸네일 박스 구조 (.card__thumb.card__thumb--placeholder)
 * - 마우스 오버 시 나타나는 2개 버튼(WISH / ADD) 및 호버 인터랙션 구조
 * - 상품 기본 정보(상품명, 가격, 품절 뱃지)
 */
function createProductCard(product) {
  const item = document.createElement("li");
  item.className = "card";
  item.dataset.productId = String(product.id);
  item.dataset.category = product.category;

  const link = document.createElement("a");
  link.className = "card__link";
  link.href = `detail.html?id=${encodeURIComponent(product.id)}&parent=${encodeURIComponent(product.parentCategory)}`;
  link.setAttribute(
    "aria-label",
    `${product.name} - ${product.priceDisplay}${product.isSoldOut ? " (품절)" : ""}`
  );

  // 1. 썸네일 박스 구조 및 이미지 경로 반영
  const thumb = document.createElement("span");
  thumb.className = "card__thumb";

  if (product.imageUrl) {
    const image = document.createElement("img");
    image.src = product.imageUrl;
    image.alt = `${product.name} 상품 이미지`;
    image.width = 1000;
    image.height = 1000;
    image.loading = "lazy";
    image.onerror = () => {
      image.style.display = "none";
      thumb.classList.add("is-fallback");
    };
    thumb.append(image);
  } else {
    thumb.classList.add("card__thumb--placeholder");
  }

  // 마우스 오버 시 나타나는 WISH / ADD 액션 버튼 구조
  const actionsWrap = document.createElement("span");
  actionsWrap.className = "card__hover-actions";

  const wishBtn = document.createElement("button");
  wishBtn.className = "card__hover-btn card__hover-btn--wish";
  wishBtn.type = "button";
  wishBtn.textContent = "WISH";
  wishBtn.setAttribute("aria-label", `${product.name} 관심상품 담기`);
  wishBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    showToast(`${product.name}을(를) 관심상품(WISH)에 담았습니다.`);
  });

  const addBtn = document.createElement("button");
  addBtn.className = "card__hover-btn card__hover-btn--add";
  addBtn.type = "button";
  addBtn.textContent = "ADD";
  addBtn.setAttribute("aria-label", `${product.name} 장바구니 담기`);
  addBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    cartService.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1
    });
    showToast(`${product.name}을(를) 장바구니에 담았습니다.`);
  });

  actionsWrap.append(wishBtn, addBtn);
  thumb.append(actionsWrap);

  // 2. 상품 본문 정보 박스 (상품명, 가격, 품절 여부)
  const body = document.createElement("span");
  body.className = "card__body";

  const name = document.createElement("span");
  name.className = "card__name";
  name.textContent = product.name;

  const price = document.createElement("span");
  price.className = "card__price";
  price.textContent = product.priceDisplay;

  body.append(name, price);

  if (product.isSoldOut) {
    const soldOut = document.createElement("span");
    soldOut.className = "card__soldout";
    soldOut.textContent = "품절";
    body.append(soldOut);
  }

  link.append(thumb, body);
  item.append(link);
  return item;
}

/**
 * 카테고리 탭 옵션 렌더링
 */
function renderCategoryOptions(scroller, parentCategory, activeCategory) {
  if (!scroller) return;
  const childCategories = categoriesByParent[parentCategory] || [];
  const options = childCategories.length > 0 ? ["all", ...childCategories] : ["all", parentCategory];
  scroller.setAttribute("aria-label", `${parentCategory} 하위 카테고리`);
  scroller.replaceChildren(...options.map((category) => {
    const button = document.createElement("button");
    button.className = "catalog-subnav__button";
    button.type = "button";
    button.dataset.categoryOption = category;
    button.setAttribute("aria-pressed", String(category === activeCategory));
    button.textContent = category === "all" ? "전체" : category;
    if (category === activeCategory) {
      button.classList.add("is-active");
    }
    return button;
  }));
}

/**
 * NEW ARRIVALS 메인 화면 렌더링
 * - 초기: 가로 4개 × 세로 2개 = 총 8개 (2줄) 노출
 * - 상품 더보기(1/10) 버튼 노출
 * - 더보기 클릭 시 2줄(8개)씩 데이터에 맞게 추가 누적 렌더링
 */
function renderNewArrivals(elements, isAppend = false) {
  const { grid, moreWrap, moreButton, subnav, toolbar, pagination } = elements;

  // 헤딩 타이틀 셋팅
  const headingTitle = document.querySelector("#new-title");
  if (headingTitle) {
    headingTitle.textContent = "NEW ARRIVALS";
  }

  // 메인 NEW ARRIVALS 화면에서는 서브내비/툴바/숫자페이징 숨김, 더보기 버튼 표시
  if (subnav) subnav.style.display = "none";
  if (toolbar) toolbar.style.display = "none";
  if (pagination) pagination.style.display = "none";
  if (moreWrap) moreWrap.style.display = "flex";

  // NEW ARRIVALS에 사용할 데이터 리스트: NEW ARRIVALS1.json의 8개 상품을 최우선으로 배치
  const mainArrivals = products.filter(p => p.parentCategory === "NEW ARRIVALS");
  const others = products.filter(p => p.parentCategory !== "NEW ARRIVALS");
  const targetProducts = [...mainArrivals, ...others];
  const totalBatches = Math.min(TARGET_TOTAL_BATCHES, Math.ceil(targetProducts.length / ITEMS_PER_BATCH)) || TARGET_TOTAL_BATCHES;

  if (targetProducts.length === 0) {
    grid.replaceChildren();
    const emptyNotice = document.createElement("li");
    emptyNotice.className = "card-empty";
    emptyNotice.style.cssText = "width: 100%; text-align: center; padding: 4rem 1rem; color: #888888;";
    emptyNotice.textContent = "등록된 상품이 없습니다.";
    grid.append(emptyNotice);
    if (moreWrap) moreWrap.style.display = "none";
    return;
  }

  // 현재 배치(2줄 = 8개) 슬라이스
  const startIndex = (currentBatch - 1) * ITEMS_PER_BATCH;
  const endIndex = startIndex + ITEMS_PER_BATCH;
  const batchProducts = targetProducts.slice(startIndex, endIndex);

  if (isAppend) {
    grid.append(...batchProducts.map(createProductCard));
  } else {
    grid.replaceChildren(...batchProducts.map(createProductCard));
  }

  // 더보기 버튼 텍스트 갱신: 상품 더보기(현재줄묶음/총줄묶음) -> 시안 1:1 매칭
  if (moreButton) {
    moreButton.textContent = `상품 더보기(${currentBatch}/${totalBatches})`;
    if (currentBatch >= totalBatches || endIndex >= targetProducts.length) {
      moreButton.disabled = true;
      moreButton.classList.add("is-disabled");
    } else {
      moreButton.disabled = false;
      moreButton.classList.remove("is-disabled");
    }
  }
}

/**
 * 카테고리별 상품 목록 렌더링 (GNB 메뉴 클릭 시)
 */
function renderCategoryCatalog(elements) {
  const { grid, moreWrap, subnav, toolbar, pagination, pageList, itemCount } = elements;

  const headingTitle = document.querySelector("#new-title");
  if (headingTitle) {
    headingTitle.textContent = selectedParent;
  }

  if (subnav) subnav.style.display = "";
  if (toolbar) toolbar.style.display = "";
  if (pagination) pagination.style.display = "";
  if (moreWrap) moreWrap.style.display = "none";

  const parentProducts = products.filter((p) => p.parentCategory === selectedParent);
  const filtered = selectedCategory === "all"
    ? [...parentProducts]
    : parentProducts.filter((p) => p.category === selectedCategory);

  if (itemCount) {
    itemCount.textContent = `${filtered.length} ITEMS`;
  }

  if (filtered.length === 0) {
    grid.replaceChildren();
    const emptyNotice = document.createElement("li");
    emptyNotice.className = "card-empty";
    emptyNotice.style.cssText = "width: 100%; text-align: center; padding: 4rem 1rem; color: #888888;";
    emptyNotice.textContent = "해당 카테고리에 등록된 상품이 없습니다.";
    grid.append(emptyNotice);
    return;
  }

  const itemsPerPage = 20;
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  selectedPage = Math.min(selectedPage, totalPages);
  const start = (selectedPage - 1) * itemsPerPage;
  const pageProducts = filtered.slice(start, start + itemsPerPage);

  grid.replaceChildren(...pageProducts.map(createProductCard));

  if (pageList && pagination) {
    pageList.replaceChildren();
    for (let page = 1; page <= totalPages; page += 1) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.className = "catalog-pagination__page";
      button.type = "button";
      button.textContent = String(page);
      button.dataset.page = String(page);
      if (page === selectedPage) {
        button.setAttribute("aria-current", "page");
      }
      item.append(button);
      pageList.append(item);
    }
    const prevBtn = pagination.querySelector("[data-page-previous]");
    const nextBtn = pagination.querySelector("[data-page-next]");
    if (prevBtn) prevBtn.disabled = selectedPage === 1;
    if (nextBtn) nextBtn.disabled = selectedPage === totalPages;
  }
}

export async function initCatalog() {
  const grid = document.querySelector("[data-product-grid]");
  const moreWrap = document.querySelector("[data-catalog-more-wrap]");
  const moreButton = document.querySelector("[data-catalog-more]");
  const subnav = document.querySelector("[data-catalog-subnav]");
  const categoryScroller = document.querySelector("[data-category-scroller]");
  const toolbar = document.querySelector("[data-catalog-toolbar]");
  const itemCount = document.querySelector("[data-items-count]");
  const pagination = document.querySelector("[data-catalog-pagination]");
  const pageList = document.querySelector("[data-page-list]");
  const sortSelect = document.querySelector("[data-catalog-sort]");

  if (!grid) return;

  const elements = {
    grid,
    moreWrap,
    moreButton,
    subnav,
    categoryScroller,
    toolbar,
    itemCount,
    pagination,
    pageList
  };

  try {
    const loaded = await loadProductData();
    products.length = 0;
    products.push(...loaded);
  } catch (error) {
    console.error("상품 데이터 로드 에러:", error);
  }

  // 1. 초기 홈페이지 화면 렌더링: NEW ARRIVALS (가로 4개 × 세로 2개 = 8개)
  currentBatch = 1;
  selectedParent = "NEW ARRIVALS";
  renderNewArrivals(elements, false);

  // 2. 상품 더보기 버튼 클릭 이벤트: 2줄(8개)씩 데이터에 맞게 추가
  if (moreButton) {
    moreButton.addEventListener("click", () => {
      currentBatch += 1;
      renderNewArrivals(elements, true);
    });
  }

  // 3. 서브 카테고리 스크롤러 클릭 이벤트
  if (categoryScroller) {
    categoryScroller.addEventListener("click", (event) => {
      const button = event.target.closest("[data-category-option]");
      if (!button) return;

      selectedCategory = button.dataset.categoryOption;
      selectedPage = 1;

      categoryScroller.querySelectorAll("[data-category-option]").forEach((option) => {
        const isActive = option === button;
        option.classList.toggle("is-active", isActive);
        option.setAttribute("aria-pressed", String(isActive));
      });

      renderCategoryCatalog(elements);
    });
  }

  // 4. 정렬 셀렉트 이벤트
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      selectedSort = sortSelect.value;
      if (selectedParent !== "NEW ARRIVALS") {
        selectedPage = 1;
        renderCategoryCatalog(elements);
      }
    });
  }

  // 5. 페이지네이션 이벤트
  if (pagination) {
    pagination.addEventListener("click", (event) => {
      const pageButton = event.target.closest("[data-page]");
      if (pageButton) {
        selectedPage = Number(pageButton.dataset.page);
      } else if (event.target.closest("[data-page-previous]")) {
        selectedPage -= 1;
      } else if (event.target.closest("[data-page-next]")) {
        selectedPage += 1;
      } else {
        return;
      }
      renderCategoryCatalog(elements);
      document.querySelector("#new-arrivals")?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }

  // 6. GNB 및 로고/홈 메뉴 클릭 연동
  document.addEventListener("click", (event) => {
    // 홈 또는 로고 클릭 시 NEW ARRIVALS 모드로 리셋
    const homeLink = event.target.closest("a[href='#main'], a[href='index.html'], a.header__logo, a.footer__logo");
    if (homeLink) {
      selectedParent = "NEW ARRIVALS";
      currentBatch = 1;
      renderNewArrivals(elements, false);
      return;
    }

    // 상위 카테고리 클릭 시 해당 카테고리 모드로 전환
    const categoryControl = event.target.closest("[data-catalog-parent]");
    if (!categoryControl) return;

    const parentCategory = categoryControl.dataset.catalogParent;
    if (!Object.hasOwn(categoriesByParent, parentCategory)) return;

    selectedParent = parentCategory;
    selectedCategory = categoryControl.dataset.catalogCategory ?? "all";
    selectedPage = 1;

    renderCategoryOptions(categoryScroller, selectedParent, selectedCategory);
    renderCategoryCatalog(elements);
  });
}
