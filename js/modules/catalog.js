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

const imageFiles = [
  "vlastshop-dt-1.png", "vlastshop-dt-2.jpg", "vlastshop-dt-3.jpg", "vlastshop-dt-4.jpg",
  "vlastshop-dt-5.jpeg", "vlastshop-dt-6.jpeg", "vlastshop-dt-7.jpg", "vlastshop-dt-8.jpeg",
  "vlastshop-dt-9.png", "vlastshop-dt-10.png", "vlastshop-dt-11.png", "vlastshop-dt-12.png",
  "vlastshop-dt-13.png", "vlastshop-dt-14.png", "vlastshop-dt-15.png", "vlastshop-dt-16.png",
  "vlastshop-dt-17.png", "vlastshop-dt-18.png", "vlastshop-dt-19.png", "vlastshop-dt-20.png",
  "vlastshop-dt-21.png", "vlastshop-dt-22.png", "vlastshop-dt-23.png", "vlastshop-dt-24.png",
  "vlastshop-dt-25.jpeg", "vlastshop-dt-26.jpg", "vlastshop-dt-27.jpeg", "vlastshop-dt-28.png",
  "vlastshop-dt-29.jpg", "vlastshop-dt-30.gif", "vlastshop-dt-31.gif", "vlastshop-dt-32.png",
  "vlastshop-dt-33.gif", "vlastshop-dt-34.jpg", "vlastshop-dt-35.jpg", "vlastshop-dt-36.png",
  "vlastshop-dt-37.png"
];

const itemsPerPage = 20;
const products = Object.entries(categoriesByParent).flatMap(([parentCategory, childCategories]) => {
  const categories = childCategories.length > 0 ? childCategories : [parentCategory];
  return Array.from({ length: 54 }, (_, index) => ({
    parentCategory,
    category: categories[index % categories.length],
    name: `상품명 영역 ${String(index + 1).padStart(2, "0")}`,
    imageFile: imageFiles[index % imageFiles.length],
    price: index + 1
  }));
});

let selectedParent = "TOUR";
let selectedCategory = "all";
let selectedPage = 1;
let selectedSort = "default";

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
  link.href = "#site-footer";

  const thumb = document.createElement("span");
  thumb.className = "card__thumb";
  const picture = document.createElement("picture");
  const mobileSource = document.createElement("source");
  mobileSource.media = "(max-width: 768px)";
  mobileSource.srcset = `imges/img-mob/${product.imageFile}`;
  const image = document.createElement("img");
  image.src = `imges/img-dt/${product.imageFile}`;
  image.alt = `${product.name} 상품 이미지`;
  image.width = 1000;
  image.height = 1000;
  image.loading = "lazy";
  picture.append(mobileSource, image);
  thumb.append(picture);

  const body = document.createElement("span");
  body.className = "card__body";
  const name = document.createElement("span");
  name.className = "card__name";
  name.textContent = product.name;
  const price = document.createElement("span");
  price.className = "card__price";
  price.textContent = "판매가 영역";
  body.append(name, price);
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

export function initCatalog() {
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
