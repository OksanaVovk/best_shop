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

import { buildStars } from "./catalog.js";

function toArray(value) {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
}

function addToCartHandler(
  product,
  selectColor,
  selectSize,
  selectCategory,
  countInput,
  cartBox,
  cartItems
) {
  return function (e) {
    e.preventDefault();

    const color = selectColor.value;
    const size = selectSize.value;
    const category = selectCategory.value;

    if (!color || !size || !category) {
      window.alert("Please fill in all the form fields.");
      return;
    }

    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        item.color === color &&
        item.size === size &&
        item.category === category
    );

    const count = Number(countInput.value);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += count;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        salesStatus: product.salesStatus,
        color,
        size,
        category,
        quantity: count,
      });
    }
    cartBox.classList.add("active");
    cartItems.textContent = Number(cartItems.textContent) + count;

    window.localStorage.setItem("cart", JSON.stringify(cart));

    selectColor.value = "";
    selectSize.value = "";
    selectCategory.value = "";
    countInput.value = 1;

    window.alert("Product added to cart");
  };
}

function renderProductData(
  selectedSuitcase,
  selectSize,
  selectColor,
  selectCategory,
  productRatingEl
) {
  // Sizes
  if (selectSize && selectedSuitcase.size) {
    const sizes = toArray(selectedSuitcase.size);

    sizes.forEach((size) => {
      const option = document.createElement("option");
      option.value = size;
      option.textContent = size;
      selectSize.appendChild(option);
    });
  }

  // Colors
  if (selectColor && selectedSuitcase.color) {
    const colors = toArray(selectedSuitcase.color);

    colors.forEach((color) => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      selectColor.appendChild(option);
    });
  }

  // Categories
  if (selectCategory && selectedSuitcase.category) {
    const categories = toArray(selectedSuitcase.category);

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      selectCategory.appendChild(option);
    });
  }

  // Rating
  if (productRatingEl) {
    const rating = selectedSuitcase.rating;
    const starsString = buildStars(rating);
    productRatingEl.innerHTML = starsString;
  }
}

function renderSuggestionsData(data, suggestionsProductsList) {
  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [data[i], data[j]] = [data[j], data[i]];
  }

  const randomFive = data.slice(0, 4);

  suggestionsProductsList.innerHTML = randomFive.map((s) => createCard(s, ".")).join("");
}

function onSubmit(e, emailInput, form) {
  e.preventDefault();
  const email = emailInput.value.trim();
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email)) {
    window.alert("Please enter a valid email address");
    emailInput.focus();
    return;
  }
  if (!form.checkValidity()) {
    return;
  }

  window.alert("Your feedback has been successfully sent.");
  form.reset();
}

function renderStarsForm(starsBoxUser, starsBoxUserOutlined) {
  let starsStringUser = "";
  let starsStringUserOutlined = "";

  for (let i = 1; i <= 5; i++) {
    starsStringUser += `<svg  data-index="${i}" class="stars-user" width="16" height="15">
                  <use  href="../assets/images/icons.svg#icon-star"></use>
                </svg>`;
    starsStringUserOutlined += `<svg width="16" height="15" class="stars-user-outlined">
                  <use  href="../assets/images/icons.svg#icon-polygon"></use>
                </svg>`;
  }
  if (!starsBoxUser) {
    return;
  }
  starsBoxUser.innerHTML = starsStringUser;
  starsBoxUserOutlined.innerHTML = starsStringUserOutlined;

  starsBoxUser.addEventListener("click", (e) => {
    const star = e.target.closest("svg.stars-user");
    if (!star) return;

    const index = Number(star.dataset.index);

    const allStars = starsBoxUser.querySelectorAll("svg");

    if (index === 1 && star.classList.contains("active")) {
      allStars.forEach((s) => s.classList.remove("active"));
      return;
    }

    allStars.forEach((s, i) => {
      if (i < index) {
        s.classList.add("active");
      } else {
        s.classList.remove("active");
      }
    });
  });
}

function counter(e, counterBox, countInput) {
  if (!counterBox) return;
  const btnMinus = e.target.closest(".counter-minus");
  if (btnMinus) {
    if (Number(countInput.value) === 1) {
      return;
    }
    countInput.value = Number(countInput.value) - 1;
  }
  const btnPlus = e.target.closest(".counter-plus");
  if (btnPlus) {
    countInput.value = Number(countInput.value) + 1;
  }
}

function toggleTabs(e, detailsBtnBox, contentBoxes) {
  const btn = e.target.closest("button");
  if (!btn) return;

  const tab = btn.dataset.tab;

  [...detailsBtnBox.children].forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  contentBoxes.forEach((box) => {
    if (box.dataset.content === tab) {
      box.classList.add("active");
    } else {
      box.classList.remove("active");
    }
  });
}

if (window.location.pathname.includes("/product.html")) {
  const countInput = document.getElementById("counter-input");
  const selectSize = document.getElementById("size");
  const selectColor = document.getElementById("color");
  const selectCategory = document.getElementById("category");
  const counterBox = document.getElementById("product-counter-box");
  const detailsBtnBox = document.getElementById("product-datails-buttons");
  const contentBoxes = document.querySelectorAll(".product-additional-info > div");
  const starsBoxUser = document.getElementById("user-rating");
  const form = document.getElementById("review-form");
  const emailInput = document.getElementById("your-email");
  const starsBoxUserOutlined = document.getElementById("user-rating-outlined");
  const headerBox = document.getElementById("header-product");
  const footerBox = document.getElementById("footer");
  const suggestionsProductsList = document.getElementById("suggestions-products-list");

  const selectedId = window.localStorage.getItem("selectedSuitcaseId");

  // Header
  if (headerBox) {
    headerBox.innerHTML = createHeader(".", ".");
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

  // Product
  (async () => {
    if (selectedId) {
      try {
        const response = await getData("../assets/data.json");
        const data = response.data;
        const selectedSuitcase = data.find((s) => s.id === selectedId);

        if (!selectedSuitcase) return;
        document.getElementById("product-img").setAttribute("src", `.${selectedSuitcase.imageUrl}`);
        document.getElementById("product-name").textContent = selectedSuitcase.name;
        document.getElementById("product-price").textContent = `$${selectedSuitcase.price}`;

        if (selectedSuitcase) {
          renderProductData(
            selectedSuitcase,
            document.getElementById("size"),
            document.getElementById("color"),
            document.getElementById("category"),
            document.getElementById("product-rating")
          );

          document
            .getElementById("add-to-cart-btn")
            .addEventListener(
              "click",
              addToCartHandler(
                selectedSuitcase,
                selectColor,
                selectSize,
                selectCategory,
                countInput,
                cartBox,
                cartItems
              )
            );
        }
        // Suggestions Products
        if (suggestionsProductsList) {
          renderSuggestionsData(data, suggestionsProductsList);
        }
      } catch (error) {
        window.console.log(error);
      }
    }

    counterBox.addEventListener("click", (e) => {
      counter(e, counterBox, countInput);
    });

    // Details
    detailsBtnBox.addEventListener("click", (e) => {
      toggleTabs(e, detailsBtnBox, contentBoxes);
    });

    // Review form
    renderStarsForm(starsBoxUser, starsBoxUserOutlined);
  })();

  // Submit review form
  form.addEventListener("submit", (e) => onSubmit(e, emailInput, form));

  // Carts actions
  document.addEventListener("click", async (e) => {
    await handleSuitcaseCardClick(e, "../assets/data.json");
  });
}
