import { createHeader, createFooter, createLogin, initLoginModal, updateCartIcon } from "./home.js";
const form = document.getElementById("feedbackform");
const emailInput = document.getElementById("user_email");

if (window.location.pathname.endsWith("contact.html") || window.location.pathname === "/") {
  // Header
  const headerBox = document.getElementById("header-contact");

  headerBox.innerHTML = createHeader(".", ".");
  const contactMenu = document.getElementById("contact-page");
  if (contactMenu) {
    contactMenu.classList.add("active");
  }

  const contactMobile = document.getElementById("mobile-contact");
  if (contactMobile) {
    contactMobile.classList.add("active");
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

  //Form
  form.addEventListener("submit", (e) => {
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
  });
}
