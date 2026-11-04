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
let selectedCategory = "all";
let selectedPage = 1;
let selectedSort = "default";

async function loadProductData() {
  const response = await fetch("data/product_data_json.md");
  if (!response.ok) {
    throw new Error("상품 데이터를 불러오지 못했습니다.");
  }

  const records = await response.json();
  if (!Array.isArray(records)) {
    throw new Error("상품 데이터 형식이 올바르지 않습니다.");
  }

  return records
    .filter((record) => record
      && typeof record.name === "string"
      && Number.isFinite(record.price)
      && typeof record.image_url === "string"
      && typeof record.link === "string")
    .map((record) => ({
      id: record.id,
      parentCategory: "TOUR",
      category: "1ST FANCON",
      name: record.name,
      price: record.price,
      imageUrl: record.image_url,
      href: new URL(record.link, "https://vlastshop.com").href,
      isSoldOut: record.is_sold_out === true
    }));
}

function getVisibleProducts() {
  const parentProducts = products.filter((product) => product.parentCategory === selectedParent);
  const filtered = selectedCategory === "all"
    ? parentProducts
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

function createProductCard(product) {
  const item = document.createElement("li");
  item.className = "card";
  const link = document.createElement("a");
  link.className = "card__link";
  link.href = product.href;

  const thumb = document.createElement("span");
  thumb.className = "card__thumb";
  const image = document.createElement("img");
  image.src = product.imageUrl;
  image.alt = `${product.name} 상품 이미지`;
  image.width = 1000;
  image.height = 1000;
  image.loading = "lazy";
  thumb.append(image);

  const body = document.createElement("span");
  body.className = "card__body";
  const name = document.createElement("span");
  name.className = "card__name";
  name.textContent = product.name;
  const price = document.createElement("span");
  price.className = "card__price";
  price.textContent = `${product.price.toLocaleString("ko-KR")}원`;
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
  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / itemsPerPage));
  selectedPage = Math.min(selectedPage, totalPages);
  const start = (selectedPage - 1) * itemsPerPage;
  const currentProducts = visibleProducts.slice(start, start + itemsPerPage);

  elements.grid.replaceChildren(...currentProducts.map(createProductCard));
  elements.itemCount.textContent = `${visibleProducts.length} ITEMS`;
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
    products.push(...await loadProductData());
  } catch {
    itemCount.textContent = "상품 데이터를 불러오지 못했습니다.";
    return;
  }
  if (products.length === 0) {
    itemCount.textContent = "표시할 상품이 없습니다.";
    return;
  }

  renderCategoryOptions(categoryScroller, selectedParent, selectedCategory);
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
    selectedCategory = categoryControl.dataset.catalogCategory ?? "all";
    selectedPage = 1;
    renderCategoryOptions(categoryScroller, selectedParent, selectedCategory);
    renderCatalog(elements);
  });

  renderCatalog(elements);
}
