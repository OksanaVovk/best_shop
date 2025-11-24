export async function getData(url) {
  const res = await fetch(url);
  return await res.json();
}

export async function getSuitcaseById(url, id) {
  const response = await getData(url);
  return response.data.find((s) => s.id === id);
}

export function addToCart(suitcase) {
  const cartBox = document.getElementById("cart-items-box");
  const cartItems = document.getElementById("cart-items");
  const color = suitcase.color;
  const size = suitcase.size;

  const cart = JSON.parse(window.localStorage.getItem("cart")) || [];

  const existing = cart.findIndex(
    (item) => item.id === suitcase.id && item.color === color && item.size === size
  );

  if (existing !== -1) {
    cart[existing].quantity += 1;
    cartBox.classList.add("active");
    cartItems.textContent = Number(cartItems.textContent) + 1;
  } else {
    cart.push({
      id: suitcase.id,
      name: suitcase.name,
      imageUrl: suitcase.imageUrl,
      salesStatus: suitcase.salesStatus,
      category: suitcase.category,
      quantity: 1,
      color,
      size,
    });
    cartBox.classList.add("active");
    cartItems.textContent = Number(cartItems.textContent) + 1;
  }

  window.localStorage.setItem("cart", JSON.stringify(cart));
}

export async function handleSuitcaseCardClick(e, url) {
  const btn = e.target.closest(".suitcase-card-button");
  if (btn) {
    e.preventDefault();
    e.stopPropagation();
    const id = btn.dataset.id;
    if (!id) return;
    try {
      const suitcase = await getSuitcaseById(url, id);
      if (suitcase) addToCart(suitcase);
    } catch (error) {
      window.console.log(error);
    }
    return;
  }
  const link = e.target.closest(".suitcase-card-link");
  if (link) {
    const id = link.dataset.id;
    window.localStorage.setItem("selectedSuitcaseId", id);
  }
}

export function createCard(suitcase, path = "", hrefPrefix = "") {
  const { price, imageUrl, salesStatus, id, name } = suitcase;

  return `<li class="suitcase-card-item" data-key=${id}>
       <a class="suitcase-card-link" data-id="${id}" href="${hrefPrefix}product.html?id=${id}">
        <div class="suitcase-card-img-container">
         <img src="${path + imageUrl}" class="suitcase-card-img" alt="suitcase" loading="lazy" data-id=${id} />
         ${salesStatus ? `<div class="suitcase-card-sale">SALE</div>` : ""}
        </div>
        <div class="suitcase-card-info">
          <h2 class="suitcase-card-text">${name}</h2>
          <div class="card-gap-box">
          <p class="suitcase-card-text">$${price}</p>
          <button type="button" class="button suitcase-card-button" data-id="${id}">Add To Cart</button>
          </div>
        </div>
        </a>
      </li>`;
}

export function createLogin(path = "") {
  return `
    <div class="modal" id="login-modal">
      <form id="login-form" class="login-form">
        <label>Email <span>*</span></label>
        <input
          type="email"
          id="login-email"
          required
          class="login-input"
        />

        <label>Password <span>*</span></label>
        <div class="password-box">
          <input
            type="password"
            id="login-password"
            class="login-input"
            required
            minlength="6"
          />
          <svg id="toggle-password" class="eye-icon" width="18" height="14">
            <use href="${path}./assets/images/icons.svg#icon-eye"></use>
          </svg>
        </div>
        <div class="checkbox-flex-box">
        <div class="checkbox-row">
          <input type="checkbox" id="remember-me" />
          <p class="checkbox-label">Remember me</p>
        </div>
        <p>Forgot Your Password?</p>
        </div>

        <button type="submit" class="button login-btn">LOG IN</button>
      </form>
  </div>`;
}

export function createHeader(path1 = "", path2 = "") {
  return ` <div class="container">
  <div class="header-info-container">

    <div class="header-social-icons-container">
      <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
        <svg class="facebook">
          <use href="${path1}./assets/images/icons.svg#icon-facebook"></use>
        </svg>
      </a>
      <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
        <svg class="twitter">
          <use href="${path1}./assets/images/icons.svg#icon-twitter"></use>
        </svg>
      </a>
      <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
        <svg class="instagram">
          <use href="${path1}./assets/images/icons.svg#icon-instagram"></use>
        </svg>
      </a>
    </div>

    <a href="${path1}./index.html" class="header-logo-container">
      <img src="${path1}./assets/images/logo.png" alt="Best Shop logo" class="header-logo-icon" />
      <h1 class="header-logo">BEST SHOP</h1>
    </a>

    <div class="header-user-container">
      <button id="open-login">
        <svg class="user">
          <use href="${path1}./assets/images/icons.svg#icon-user"></use>
        </svg>
      </button>

      <a class="cart-link-basket" href="${path2}/cart.html">
        <div class="cart-items-box" id="cart-items-box">
          <p id="cart-items"></p>
        </div>
        <svg class="cart">
          <use href="${path1}./assets/images/icons.svg#icon-shopping-cart"></use>
        </svg>
      </a>
    </div>

  </div>

  <ul class="header-menu-container">
    <li><a href="${path1}./index.html" class="header-link" id="home-page">Home</a></li>
    <li>
      <a href="${path2}/catalog.html" class="header-item-container header-link" id="catalog-page">
        <p>Catalog</p>
        <svg width="7" height="12">
          <use href="${path1}./assets/images/icons.svg#icon-arrow"></use>
        </svg>
      </a>
    </li>
    <li><a href="${path2}/about.html" class="header-link" id="about-page">About Us</a></li>
    <li><a href="${path2}/contact.html" class="header-link" id="contact-page">Contact Us</a></li>
  </ul>

  <button class="hamburger-btn" id="hamburger-btn">
    <span></span>
    <span></span>
    <span></span>
  </button>

  <ul class="mobile-menu" id="mobile-menu">
    <li><a href="${path1}./index.html" id="mobile-home">Home</a></li>
    <li><a href="${path2}/catalog.html" id="mobile-catalog">Catalog</a></li>
    <li><a href="${path2}/about.html" id="mobile-about">About Us</a></li>
    <li><a href="${path2}/contact.html" id="mobile-contact">Contact Us</a></li>
  </ul>

</div>
`;
}

export function createFooter(path1 = "", path2 = "") {
  return `<section class="footer-benefits">
        <div class="container">
          <h3 class="footer-benefits-title">Our Benefits</h3>
          <div class="footer-benefits-list">
            <div class="benefit-item">
              <img src="${path1}./assets/images/benefit1.png" alt="Benefit" />
              <p>Velit nisl sodales eget donec quis. volutpat orci.</p>
            </div>
            <div class="benefit-item">
              <img src="${path1}./assets/images/benefit2.png" alt="Benefit" />
              <p>Dolor eu varius. Morbi fermentum velit nisl.</p>
            </div>
            <div class="benefit-item">
              <img src="${path1}./assets/images/benefit3.png" alt="Benefit" />
              <p>Malesuada fames ac ante ipsum primis in faucibus.</p>
            </div>
            <div class="benefit-item">
              <img src="${path1}./assets/images/benefit4.png" alt="Benefit" />
              <p>Nisl sodales eget donec quis. volutpat orci.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="container">
        <div class="footer-main">
          <div class="footer-columns">
            <div class="footer-col-container">
              <div class="footer-col">
                <a href="${path2}/about.html"><h4>About Us</h4></a>
                <ul>
                  <li>Organisation</li>
                  <li>Partners</li>
                  <li>Clients</li>
                </ul>
              </div>

              <div class="footer-col">
                <h4>Interesting Links</h4>
                <ul>
                  <li>Photo Gallery</li>
                  <li>Our Team</li>
                  <li>Socials</li>
                </ul>
              </div>

              <div class="footer-col">
                <h4>Achievements</h4>
                <ul>
                  <li>Winning Awards</li>
                  <li>Press</li>
                  <li>Our Amazing Clients</li>
                </ul>
              </div>
            </div>

            <div class="footer-col footer-col-grid">
              <a href="${path2}/contact.html"><h4>Contact Us</h4></a>
              <p>
                Bendum dolor eu varius. Morbi fermentum velitsodales egetonec. volutpat orci. Sed
                ipsum felis, tristique egestas et, convallis ac velitn consequat nec luctus.
              </p>
            </div>

            <ul class="footer-contact-list">
              <li>
                <svg class="phone">
                  <use href="${path1}./assets/images/icons.svg#icon-phone"></use>
                </svg>
                <p>Phone: (+63) 236 63222</p>
              </li>
              <li>
                <svg class="email">
                  <use href="${path1}./assets/images/icons.svg#icon-email"></use>
                </svg>
                <p>public@news.com</p>
              </li>
              <li>
                <svg class="clock">
                  <use href="${path1}./assets/images/icons.svg#icon-clock"></use>
                </svg>
                <p>
                  Mon - Fri: 10am - 6pm
                  <br />
                  Sat - Sun: 10am - 6pm
                </p>
              </li>
              <li>
                <svg class="map">
                  <use href="${path1}./assets/images/icons.svg#icon-map-pin"></use>
                </svg>
                <p>639 Jade Valley, Washington DC</p>
              </li>
            </ul>

            <div class="footer-shipping">
              <h4>Shipping Information</h4>
              <p>
                Nulla eleifend pulvinar purus, molestie euismod odio imperdiet ac. Ut sit amet erat
                nec nibh rhoncus varius in non lorem. Donec interdum, lectus in convallis pulvinar,
                enim elit porta sapien, vel finibus erat felis sed neque. Etiam aliquet neque
                sagittis erat tincidunt aliquam.
              </p>
            </div>
          </div>

          <div class="footer-copy">
            <svg>
              <use href="${path1}./assets/images/icons.svg#icon-copyright"></use>
            </svg>
          </div>
        </div>
      </section>`;
}

export function getCart() {
  return JSON.parse(window.localStorage.getItem("cart")) || [];
}

export function getCartItems(cart) {
  return cart.reduce((total, item) => {
    return total + Number(item.quantity);
  }, 0);
}

export function initLoginModal(createLogin, ...args) {
  const openBtn = document.getElementById("open-login");
  const backdrop = document.getElementById("login-modal-backdrop");

  if (!openBtn || !backdrop) return;

  openBtn.addEventListener("click", () => {
    backdrop.classList.remove("is-hidden");
    document.body.style.overflow = "hidden";

    backdrop.innerHTML = createLogin(...args);

    const togglePassword = backdrop.querySelector("#toggle-password");
    const passwordInput = backdrop.querySelector("#login-password");
    const emailInput = backdrop.querySelector("#login-email");
    const form = backdrop.querySelector("#login-form");

    togglePassword.addEventListener("click", () => {
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

      if (!emailRegex.test(email)) {
        window.alert("Please enter a valid email address");
        emailInput.focus();
        return;
      }

      if (!form.checkValidity()) return;

      closeModal();
    });

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
  });

  function closeModal() {
    backdrop.classList.add("is-hidden");
    backdrop.innerHTML = "";
    document.body.style.overflow = "";
  }
}

export function updateCartIcon(cartBox, cartItems) {
  const cart = getCart();

  if (!cartBox || !cartItems) return;

  if (cart.length > 0) {
    cartBox.classList.add("active");
    cartItems.textContent = getCartItems(cart);
  } else {
    cartBox.classList.remove("active");
    cartItems.textContent = "";
  }
}

function travelSliderInfinite() {
  const list = document.querySelector(".travel-section-list");
  const slides = Array.from(document.querySelectorAll(".travel-slide"));
  const next = document.querySelector(".travel-next");
  const prev = document.querySelector(".travel-prev");

  if (!list || slides.length === 0) return;

  let index = 0;

  function getSlidesPerView() {
    if (window.innerWidth >= 1440) return 4;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function updateSlider() {
    const gap = 20;
    const visible = getSlidesPerView();
    const total = slides.length;

    const windowSlides = [];

    for (let i = 0; i < Math.min(visible, 4); i++) {
      const realIndex = (index + i) % total;
      windowSlides.push(slides[realIndex].outerHTML);
    }

    list.innerHTML = windowSlides.join("");
    list.style.display = "flex";
    list.style.gap = gap + "px";
  }

  next.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    updateSlider();
  });

  prev.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    updateSlider();
  });

  window.addEventListener("resize", updateSlider);

  updateSlider();
}

const randomTexts = [
  {
    title: "Duis vestibulum elit vel neque.",
    text: "Duis vestibulum vel neque pharetra vulputate. Quisque scelerisque nisi.",
  },
  {
    title: "Neque vestibulum elit nequvel.",
    text: "Duis vestibulum vel neque pharetra vulputate. Quisque scelerisque nisi.",
  },
  {
    title: "Elituis stibulum elit velneque.",
    text: "Duis vestibulum vel neque pharetra vulputate. Quisque scelerisque nisi.",
  },
  {
    title: "Vel vestibulum elit tuvel euqen.",
    text: "Duis vestibulum vel neque pharetra vulputate. Quisque scelerisque nisi.",
  },
];

if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
  // Header
  const headerBox = document.getElementById("header-home");

  headerBox.innerHTML = createHeader("", "./html");
  const homeMenu = document.getElementById("home-page");
  if (homeMenu) {
    homeMenu.classList.add("active");
  }

  const homeMobile = document.getElementById("mobile-home");
  if (homeMobile) {
    homeMobile.classList.add("active");
  }

  //Hamburger menu
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  hamburgerBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });

  // Footer
  const footerBox = document.getElementById("footer");
  footerBox.innerHTML = createFooter("", "./html");

  //Login
  initLoginModal(createLogin, "");

  // Cart
  const cartBox = document.getElementById("cart-items-box");
  const cartItems = document.getElementById("cart-items");
  updateCartIcon(cartBox, cartItems);

  (async () => {
    try {
      const response = await getData("./assets/data.json");
      const data = response.data;

      // Selected Products
      const selectedSectionList = document.getElementById("selected-section-list");
      if (selectedSectionList) {
        const suitcaseData1 = data
          .filter((item) => item.blocks.includes("Selected Products"))
          .slice(0, 4);

        selectedSectionList.innerHTML = suitcaseData1
          .map((s) => createCard(s, "", "html/"))
          .join("");
      }

      // New Products Arrival
      const arrivalsSectionList = document.getElementById("arrivals-section-list");
      if (arrivalsSectionList) {
        const suitcaseData2 = data
          .filter((item) => item.blocks.includes("New Products Arrival"))
          .slice(0, 4);

        arrivalsSectionList.innerHTML = suitcaseData2
          .map((s) => createCard(s, "", "html/"))
          .join("");
      }
    } catch (error) {
      window.console.error("Error loading data:", error);
    }

    // Cart actions
    document.addEventListener("click", async (e) => {
      await handleSuitcaseCardClick(e, "./assets/data.json");
    });

    //Button to catalog
    const btnToCatalog = document.getElementById("suitcase-banner-button");
    btnToCatalog.addEventListener("click", () => {
      window.location.href = "html/catalog.html";
    });

    //Random text- Travel section

    document.querySelectorAll(".travel-section-list li").forEach((item) => {
      const random = randomTexts[Math.floor(Math.random() * randomTexts.length)];

      const titleEl = item.querySelector(".travel-section-item-title");
      const textEl = item.querySelector(".travel-section-item-text");

      if (titleEl) titleEl.textContent = random.title;
      if (textEl) textEl.textContent = random.text;
    });

    travelSliderInfinite();
  })();
}
