const categoriesByParent = {
  ALBUM: [],
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
  SEASONAL: ["SEASON'S GREETINGS", "BIRTHDAY KIT"]
};

const itemsPerPage = 20;
const products = [];

let selectedParent = "TOUR";
let selectedCategory = "1ST FANCON"; // 기본으로 이전에 요청된 1ST FANCON 상품이 먼저 노출
let selectedPage = 1;
let selectedSort = "default";

/**
 * 1ST FANCON(이전 데이터)과 2025 TOUR(현재 데이터)를 모두 로드하여 병합
 */
async function loadProductData() {
  const allProducts = [];

  // 1. 이전 1ST FANCON 데이터 (data/product_data_json.md) 로드
  try {
    const fanconResponse = await fetch("data/product_data_json.md");
    if (fanconResponse.ok) {
      const fanconRecords = await fanconResponse.json();
      if (Array.isArray(fanconRecords)) {
        const fanconProducts = fanconRecords
          .filter((record) => record
            && typeof record.name === "string"
            && (Number.isFinite(record.price) || typeof record.price === "number")
            && typeof record.image_url === "string"
            && (typeof record.link === "string" || typeof record.product_url === "string"))
          .map((record) => {
            const urlPath = record.link || record.product_url || "#";
            const numPrice = Number(record.price);
            return {
              id: record.id,
              parentCategory: "TOUR",
              category: "1ST FANCON",
              name: record.name,
              price: numPrice,
              priceDisplay: record.price_display || `${numPrice.toLocaleString("ko-KR")}원`,
              imageUrl: record.image_url,
              href: new URL(urlPath, "https://vlastshop.com").href,
              isSoldOut: record.is_sold_out === true
            };
          });
        allProducts.push(...fanconProducts);
      }
    }
  } catch (error) {
    console.warn("1ST FANCON 데이터 로드 실패:", error);
  }

  // 2. 현재 2025 TOUR 데이터 (data/products.json) 로드
  try {
    const tourResponse = await fetch("data/products.json");
    if (tourResponse.ok) {
      const tourRecords = await tourResponse.json();
      if (Array.isArray(tourRecords)) {
        const tourProducts = tourRecords
          .filter((record) => record
            && typeof record.name === "string"
            && (Number.isFinite(record.price) || typeof record.price === "number")
            && typeof record.image_url === "string"
            && (typeof record.product_url === "string" || typeof record.link === "string"))
          .map((record) => {
            const urlPath = record.product_url || record.link || "#";
            const numPrice = Number(record.price);
            return {
              id: record.id,
              parentCategory: "TOUR",
              category: "2025 TOUR",
              name: record.name,
              price: numPrice,
              priceDisplay: record.price_display || `${numPrice.toLocaleString("ko-KR")}원`,
              imageUrl: record.image_url,
              href: new URL(urlPath, "https://vlastshop.com").href,
              isSoldOut: record.is_sold_out === true
            };
          });
        allProducts.push(...tourProducts);
      }
    }
  } catch (error) {
    console.warn("2025 TOUR 데이터 로드 실패:", error);
  }

  if (allProducts.length === 0) {
    throw new Error("상품 데이터를 불러오지 못했습니다.");
  }

  return allProducts;
}

function getVisibleProducts() {
  const parentProducts = products.filter((product) => product.parentCategory === selectedParent);
  const filtered = selectedCategory === "all"
    ? [...parentProducts]
    : parentProducts.filter((product) => product.category === selectedCategory);

  if (selectedSort === "name") {
    filtered.sort((first, second) => first.name.localeCompare(second.name));
  } else if (selectedSort === "price-ascending") {
    filtered.sort((first, second) => first.price - second.price);
  } else if (selectedSort === "price-descending") {
    filtered.sort((first, second) => second.price - first.price);
  }
  return filtered;
}

function renderCategoryOptions(scroller, parentCategory, activeCategory) {
  const childCategories = categoriesByParent[parentCategory];
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
 * 상품 카드 박스 생성
 */
function createProductCard(product) {
  const item = document.createElement("li");
  item.className = "card";
  item.dataset.productId = String(product.id);
  item.dataset.category = product.category;

  const link = document.createElement("a");
  link.className = "card__link";
  link.href = product.href;
  link.setAttribute(
    "aria-label",
    `${product.name} - ${product.priceDisplay}${product.isSoldOut ? " (품절)" : ""}`
  );

  const thumb = document.createElement("span");
  thumb.className = "card__thumb";

  const image = document.createElement("img");
  image.src = product.imageUrl;
  image.alt = `${product.name} 상품 이미지`;
  image.width = 1000;
  image.height = 1000;
  image.loading = "lazy";
  image.onerror = () => {
    image.style.display = "none";
    thumb.classList.add("is-fallback");
    if (!thumb.textContent) {
      thumb.textContent = product.name;
    }
  };
  thumb.append(image);

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

function renderPagination(pagination, pageList, totalPages) {
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
  pagination.querySelector("[data-page-previous]").disabled = selectedPage === 1;
  pagination.querySelector("[data-page-next]").disabled = selectedPage === totalPages;
}

function renderCatalog(elements) {
  const visibleProducts = getVisibleProducts();
  elements.itemCount.textContent = `${visibleProducts.length} ITEMS`;

  if (visibleProducts.length === 0) {
    elements.grid.replaceChildren();
    const emptyNotice = document.createElement("li");
    emptyNotice.className = "card-empty";
    emptyNotice.style.cssText = "width: 100%; text-align: center; padding: 4rem 1rem; color: #888888;";
    emptyNotice.textContent = "해당 카테고리에 등록된 상품이 없습니다.";
    elements.grid.append(emptyNotice);
    renderPagination(elements.pagination, elements.pageList, 1);
    return;
  }

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / itemsPerPage));
  selectedPage = Math.min(selectedPage, totalPages);
  const start = (selectedPage - 1) * itemsPerPage;
  const currentProducts = visibleProducts.slice(start, start + itemsPerPage);

  elements.grid.replaceChildren(...currentProducts.map(createProductCard));
  renderPagination(elements.pagination, elements.pageList, totalPages);
}

export async function initCatalog() {
  const grid = document.querySelector("[data-product-grid]");
  const itemCount = document.querySelector("[data-items-count]");
  const pagination = document.querySelector("[data-catalog-pagination]");
  const pageList = document.querySelector("[data-page-list]");
  const categoryScroller = document.querySelector("[data-category-scroller]");
  const sortSelect = document.querySelector("[data-catalog-sort]");

  if (!grid || !itemCount || !pagination || !pageList || !categoryScroller || !sortSelect) {
    return;
  }

  const elements = { grid, itemCount, pagination, pageList };
  itemCount.textContent = "상품 데이터를 불러오는 중입니다.";

  try {
    const loaded = await loadProductData();
    products.length = 0;
    products.push(...loaded);
  } catch (error) {
    console.error("상품 데이터 로드 에러:", error);
    itemCount.textContent = "상품 데이터를 불러오지 못했습니다.";
    return;
  }

  if (products.length === 0) {
    itemCount.textContent = "표시할 상품이 없습니다.";
    return;
  }

  // 하위 카테고리 버튼 목록 렌더링 및 활성 상태 반영
  renderCategoryOptions(categoryScroller, selectedParent, selectedCategory);

  // 하위 카테고리 버튼 클릭 이벤트 리스너: 버튼 누를 때마다 해당 카테고리 데이터로 즉시 전환
  categoryScroller.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category-option]");
    if (!button) {
      return;
    }

    selectedCategory = button.dataset.categoryOption;
    selectedPage = 1;

    categoryScroller.querySelectorAll("[data-category-option]").forEach((option) => {
      const isActive = option === button;
      option.classList.toggle("is-active", isActive);
      option.setAttribute("aria-pressed", String(isActive));
    });

    const buttonBounds = button.getBoundingClientRect();
    const railBounds = categoryScroller.getBoundingClientRect();
    categoryScroller.scrollBy({
      left: buttonBounds.left - railBounds.left - (railBounds.width - buttonBounds.width) / 2,
      behavior: "smooth"
    });

    renderCatalog(elements);
  });

  sortSelect.addEventListener("change", () => {
    selectedSort = sortSelect.value;
    selectedPage = 1;
    renderCatalog(elements);
  });

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

    renderCatalog(elements);
    document.querySelector("#new-arrivals").scrollIntoView({ block: "start", behavior: "smooth" });
  });

  // 상위 GNB나 드로어에서 카테고리 클릭 시
  document.addEventListener("click", (event) => {
    const categoryControl = event.target.closest("[data-catalog-parent], [data-catalog-category]");
    if (!categoryControl) {
      return;
    }

    const parentCategory = categoryControl.dataset.catalogParent ?? selectedParent;
    if (!Object.hasOwn(categoriesByParent, parentCategory)) {
      return;
    }

    selectedParent = parentCategory;
    selectedCategory = categoryControl.dataset.catalogCategory ?? (parentCategory === "TOUR" ? "1ST FANCON" : "all");
    selectedPage = 1;
    renderCategoryOptions(categoryScroller, selectedParent, selectedCategory);
    renderCatalog(elements);
  });

  // 초기 렌더링
  renderCatalog(elements);
}
