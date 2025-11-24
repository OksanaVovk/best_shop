import {
  createCard,
  getData,
  createFooter,
  createHeader,
  createLogin,
  initLoginModal,
  updateCartIcon,
  handleSuitcaseCardClick,
} from "./home.js";

const searchInput = document.getElementById("catalog-search-input");
const searchBtn = document.getElementById("catalog-search-btn");
const select = document.getElementById("catalog-selector");
const catalogBox = document.getElementById("catalog-card-list");
const infoText = document.getElementById("catalog-pages-info");
const buttonsBox = document.getElementById("catalog-pages-btn-box");
const nextBtn = document.getElementById("catalog-next-btn");
const salesCheckbox = document.querySelector(".filter-check");
const filterMainBox = document.getElementById("filter-large-box");
const showFiltersBtn = document.getElementById("show-filters-btn");
const clearFiltersBtn = document.getElementById("clear-filters");
const hideFiltersBtn = document.getElementById("hide-filters");

const headerBox = document.getElementById("header-catalog");
const footerBox = document.getElementById("footer");

function createBtn(index) {
  return `<button class="catalog-page-btn" data-key=${index}>${index}
        </button>`;
}

export function buildStars(rating) {
  let starsString = "";
  let goldStars = Math.floor(rating);

  for (let i = 1; i <= 5; i++) {
    if (goldStars > 0) {
      starsString += `
        <svg width="16" height="15">
          <use fill="#F5B423" href="../assets/images/icons.svg#icon-star"></use>
        </svg>`;
      goldStars--;
    } else {
      starsString += `
        <svg width="16" height="15">
          <use fill="#E9E9ED" href="../assets/images/icons.svg#icon-star"></use>
        </svg>`;
    }
  }

  return starsString;
}

function createBestSetsItem(suitcase) {
  const { price, imageUrl, id, name, rating } = suitcase;

  return `
    <li data-key="${id}">
      <div class="img-box-sets">
        <img src=".${imageUrl}" alt="suitcase" />
      </div>
      <div class="text-sets-box">
        <p>${name}</p>
        <div class="sets-rating">${buildStars(rating)}</div>
        <p>$${price}</p>
      </div>
    </li>
  `;
}

let originalData = [];
let filtredData = [];
let generalData = [];
let currentPageData = [];
let currentPage = 1;
let pages;

const renderData = (array, element) => {
  let html = array.map((item) => createCard(item, ".")).join("");
  element.innerHTML = html;
};
const updateInfoText = () => {
  if (pages === 0) {
    infoText.textContent = `Showing 0-0 of 0 Results`;
  } else {
    const start = (currentPage - 1) * 12 + 1;
    const end = Math.min(currentPage * 12, generalData.length);
    infoText.textContent = `Showing ${start}-${end} of ${generalData.length} Results`;
  }
};

const renderPagination = () => {
  if (!buttonsBox) return;

  if (pages === 0) {
    buttonsBox.innerHTML = "";
    nextBtn.style.display = "none";
    return;
  }

  let buttonsData = "";
  for (let i = 1; i <= pages; i++) {
    buttonsData += createBtn(i);
  }
  buttonsBox.innerHTML = buttonsData;

  [...buttonsBox.children].forEach((btn, index) => {
    btn.classList.toggle("active", index === currentPage - 1);
  });

  nextBtn.style.display = "flex";
  nextBtn.disabled = currentPage === pages;
};

const activeFilters = {
  color: "",
  size: "",
  category: "",
  salesStatus: null,
};

function updateFilteredData() {
  filtredData = [...originalData];
  Object.entries(activeFilters).forEach(([key, value]) => {
    if (value !== null && value !== "") {
      filtredData = filtredData.filter((item) => item[key] === value);
    }
  });
  if (filtredData.length === 0) {
    pages = 0;
    catalogBox.innerHTML = `<div class="catalog-zero"><p>Product not found</p></div>`;
    buttonsBox.innerHTML = "";
    nextBtn.style.display = "none";
    updateInfoText();
    return;
  } else {
    generalData = filtredData;
    currentPage = 1;
    pages = Math.ceil(generalData.length / 12);
    currentPageData = [...generalData].slice(0, 12);
    renderData(currentPageData, catalogBox);
    updateInfoText();
    renderPagination();
  }
  select.value = "default";
  searchInput.value = "";
}

function applyFilter(filterName, value) {
  activeFilters[filterName] = value || null;
  updateFilteredData();
}

function clearFilters() {
  activeFilters.size = "";
  activeFilters.color = "";
  activeFilters.category = "";
  activeFilters.sales = null;
  filtredData = [];

  document.querySelectorAll(".filter-options").forEach((list) => {
    const items = list.querySelectorAll("li");
    items.forEach((li) => li.classList.remove("selected"));
    items[0].classList.add("selected");
  });

  salesCheckbox.checked = false;
}

async function handleSearch() {
  select.value = "default";
  clearFilters();
  nextBtn.style.display = "flex";
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    const response = await getData("../assets/data.json");
    filtredData = response.data;

    generalData = [...filtredData];
    currentPage = 1;
    pages = Math.ceil(generalData.length / 12);
    currentPageData = [...generalData].slice(0, 12);

    renderData(currentPageData, catalogBox);
  } else {
    filtredData = [...originalData].filter((item) => item.name.toLowerCase().includes(query));

    if (filtredData.length === 0) {
      pages = 0;
      catalogBox.innerHTML = `<div class="catalog-zero"><p>Product not found</p></div>`;
      buttonsBox.innerHTML = "";
      nextBtn.style.display = "none";
      updateInfoText();
      return;
    } else if (filtredData.length === 1) {
      window.localStorage.setItem("selectedSuitcaseId", filtredData[0].id);
      window.location.href = `product.html?id=${filtredData[0].id}`;
      return;
    } else {
      currentPage = 1;
      generalData = [...filtredData];
      pages = Math.ceil(generalData.length / 12);
      currentPageData = [...generalData].slice(0, 12);

      renderData(currentPageData, catalogBox);
    }
  }

  updateInfoText();
  renderPagination();
}

if (window.location.pathname.endsWith("catalog.html") || window.location.pathname === "/") {
  // Header
  if (headerBox) {
    headerBox.innerHTML = createHeader(".", ".");
  }
  const catalogMenu = document.getElementById("catalog-page");
  if (catalogMenu) {
    catalogMenu.classList.add("active");
  }
  const catalogMobile = document.getElementById("mobile-catalog");
  if (catalogMobile) {
    catalogMobile.classList.add("active");
  }

  //Hamburger menu
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  hamburgerBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });

  // Footer
  if (footerBox) {
    footerBox.innerHTML = createFooter(".", ".");
  }

  //Login
  initLoginModal(createLogin, ".");

  // Cart
  const cartBox = document.getElementById("cart-items-box");
  const cartItems = document.getElementById("cart-items");
  updateCartIcon(cartBox, cartItems);

  //Catalog
  (async () => {
    try {
      const response = await getData("../assets/data.json");
      originalData = response.data;
      pages = Math.ceil(originalData.length / 12);
      currentPageData = [...originalData].slice(0, 12);
      generalData = [...originalData];

      if (currentPage === pages) {
        nextBtn.disabled = true;
      } else {
        nextBtn.disabled = false;
      }

      updateInfoText();

      if (catalogBox) {
        renderData(currentPageData, catalogBox);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      renderPagination();
    } catch (error) {
      window.console.error("Error loading data:", error);
    }

    // Search
    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    });

    // Sorting
    select.addEventListener("change", (e) => {
      const val = e.target.value;

      if (filtredData.length !== originalData.length && filtredData.length > 0) {
        generalData = [...filtredData];
        if (val === "price-asc") generalData.sort((a, b) => a.price - b.price);
        else if (val === "price-desc") generalData.sort((a, b) => b.price - a.price);
        else if (val === "popularity") generalData.sort((a, b) => b.popularity - a.popularity);
        else if (val === "rating") generalData.sort((a, b) => b.rating - a.rating);
        else if (val === "default") generalData = [...filtredData];
      } else {
        generalData = [...originalData];
        if (val === "price-asc") generalData.sort((a, b) => a.price - b.price);
        else if (val === "price-desc") generalData.sort((a, b) => b.price - a.price);
        else if (val === "popularity") generalData.sort((a, b) => b.popularity - a.popularity);
        else if (val === "rating") generalData.sort((a, b) => b.rating - a.rating);
        else if (val === "default") generalData = [...originalData];
      }

      pages = Math.ceil(generalData.length / 12);
      currentPageData = [...generalData].slice(0, 12);
      currentPage = 1;

      renderData(currentPageData, catalogBox);
      updateInfoText();
      renderPagination();
    });

    // Pagination
    buttonsBox.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        [...buttonsBox.children].forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");
        currentPage = Number(e.target.dataset.key);
        const start = (currentPage - 1) * 12;
        const end = start + 12;
        currentPageData = [...generalData].slice(start, end);

        if (catalogBox) {
          catalogBox.classList.add("fade-out");
          window.setTimeout(() => {
            renderData(currentPageData, catalogBox);
            updateInfoText();
            window.scrollTo({ top: 0, behavior: "smooth" });

            catalogBox.classList.remove("fade-out");
          }, 400);
        }
      }
      if (currentPage === pages) {
        nextBtn.disabled = true;
      } else {
        nextBtn.disabled = false;
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentPage < pages) {
        currentPage += 1;

        const start = (currentPage - 1) * 12;
        const end = start + 12;
        currentPageData = [...generalData].slice(start, end);

        if (catalogBox) {
          catalogBox.classList.add("fade-out");
          window.setTimeout(() => {
            renderData(currentPageData, catalogBox);
            updateInfoText();
            window.scrollTo({ top: 0, behavior: "smooth" });
            catalogBox.classList.remove("fade-out");
          }, 400);
        }

        if (buttonsBox && buttonsBox.children.length > 0) {
          [...buttonsBox.children].forEach((btn) => btn.classList.remove("active"));
          buttonsBox.children[currentPage - 1].classList.add("active");
        }

        nextBtn.disabled = currentPage === pages;
      }
    });

    // Best Sets
    const bestSetsList = document.getElementById("catalog-best-list");

    if (bestSetsList) {
      const suitcaseData = originalData.filter((item) => item.category === "luggage sets");

      for (let i = suitcaseData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [suitcaseData[i], suitcaseData[j]] = [suitcaseData[j], suitcaseData[i]];
      }

      const randomFive = suitcaseData.slice(0, 5);

      bestSetsList.innerHTML = randomFive.map((s) => createBestSetsItem(s)).join("");
    }

    // Carts actions

    document.addEventListener("click", async (e) => {
      await handleSuitcaseCardClick(e, "../assets/data.json");
    });
  })();

  // Filtering
  document.querySelectorAll(".filter-box").forEach((box) => {
    const options = box.querySelectorAll(".filter-options li");
    const label = box.querySelector("p").textContent.trim().toLowerCase();

    options.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();

        options.forEach((o) => o.classList.remove("selected"));
        option.classList.add("selected");

        const value = option.dataset.value;
        applyFilter(label, value);
      });
    });
  });

  if (salesCheckbox) {
    salesCheckbox.addEventListener("change", () => {
      const value = salesCheckbox.checked ? true : null;
      window.console.log(value);
      applyFilter("salesStatus", value);
    });
  }

  clearFiltersBtn.addEventListener("click", () => {
    clearFilters();
    updateFilteredData();
  });

  hideFiltersBtn.addEventListener("click", () => {
    window.console.log("clack");
    clearFilters();
    showFiltersBtn.classList.add("active");
    filterMainBox.classList.remove("active");
  });

  showFiltersBtn.addEventListener("click", () => {
    filterMainBox.classList.add("active");
    showFiltersBtn.classList.remove("active");
  });
}
