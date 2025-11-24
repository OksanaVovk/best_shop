import { createHeader, createFooter, createLogin, initLoginModal, updateCartIcon } from "./home.js";
if (window.location.pathname.endsWith("about.html") || window.location.pathname === "/") {
  // Header
  const headerBox = document.getElementById("header-about");

  headerBox.innerHTML = createHeader(".", ".");
  const aboutMenu = document.getElementById("about-page");
  if (aboutMenu) {
    aboutMenu.classList.add("active");
  }

  const aboutMobile = document.getElementById("mobile-about");
  if (aboutMobile) {
    aboutMobile.classList.add("active");
  }

  //Hamburger menu
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  hamburgerBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });

  // Footer
  const footerBox = document.getElementById("footer");
  footerBox.innerHTML = createFooter(".", ".");

  //Login
  initLoginModal(createLogin, ".");

  // Cart
  const cartBox = document.getElementById("cart-items-box");
  const cartItems = document.getElementById("cart-items");
  updateCartIcon(cartBox, cartItems);

  //Button
  const btnToCatalog = document.getElementById("see-all-models");
  btnToCatalog.addEventListener("click", () => {
    window.location.href = "./catalog.html";
  });
}
