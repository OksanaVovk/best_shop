import {
  createFooter,
  createHeader,
  getCart,
  getCartItems,
  createLogin,
  initLoginModal,
  updateCartIcon,
  getData,
} from "./home.js";

export function createTableRow(cart, index) {
  const { price, imageUrl, id, name, quantity } = cart;

  return `<li class="cart-item" data-key="${id}_${Date.now()}">
        <div class="cart-img-box">
        <img src=".${imageUrl}" class="cart-img" />
        </div>
        <p class="cart-name">${name}</p>
        <p data-index=${index} class="cart-price">$${price}</p>
        <div class="cart-counter">
          <button data-index=${index} class="minus">-</button>
          <span data-index=${index} class="counter-span">${quantity}</span>
          <button data-index=${index} class="plus">+</button>
        </div>
        <div class="total-box">
        <p>$</p>
        <p class="cart-total" data-index=${index}>${Number(price) * Number(quantity)}</p>
        </div>
        <button class="cart-delete" data-index=${index}>
         <svg width="14" height="20">
           <use href="../assets/images/icons.svg#icon-basket"></use>
        </svg>
        </button>
      </li>`;
}

const emptyCart = document.getElementById("empty-cart");
const tableBox = document.getElementById("cart-table");
const tableList = document.getElementById("cart-list");
const totalSummary = document.getElementById("summary-total");
const discounSummaryBox = document.getElementById("summary-discount-box");
const discounSummary = document.getElementById("summary-discount");
const amountDue = document.getElementById("amount-due");
const clearList = document.getElementById("clear");
const checkout = document.getElementById("checkout");
const headerBox = document.getElementById("header-cart");
const footerBox = document.getElementById("footer");

if (window.location.pathname.endsWith("cart.html") || window.location.pathname === "/") {
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

  (async () => {
    let cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    const response = await getData("../assets/data.json");
    const data = response.data;
    if (cart.length > 0) {
      const updatedCart = cart.map((c) => {
        const productFromDB = data.find((item) => item.id === c.id);
        if (productFromDB) {
          return {
            ...c,
            price: productFromDB.price,
          };
        }
        return c;
      });

      cart = updatedCart;
      window.localStorage.setItem("cart", JSON.stringify(cart));
    }
    function renderCart() {
      if (cart.length === 0) {
        emptyCart.classList.add("active");
        tableBox.classList.remove("active");
        tableList.innerHTML = "";
        emptyCart.innerHTML = `<p>Your cart is empty. Use the catalog to add new items.</p>`;
        return;
      }

      const tableRowsHtml = cart.map((item, index) => createTableRow(item, index)).join("");

      emptyCart.classList.remove("active");
      tableBox.classList.add("active");
      tableList.innerHTML = tableRowsHtml;

      attachEvents();
      updateSummary();
    }

    function attachEvents() {
      tableList.querySelectorAll(".plus").forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = Number(btn.dataset.index);
          const counterSpan = tableList.querySelector(`.counter-span[data-index="${index}"]`);
          let count = Number(counterSpan.textContent);
          count++;
          counterSpan.textContent = `${count}`;
          updateTotal(index, count);
          updateSummary();
          cartItems.textContent = Number(cartItems.textContent) + 1;
        });
      });

      tableList.querySelectorAll(".minus").forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = Number(btn.dataset.index);
          const counterSpan = tableList.querySelector(`.counter-span[data-index="${index}"]`);
          let count = Number(counterSpan.textContent);
          if (count > 1) {
            count--;
            counterSpan.textContent = `${count}`;
            updateTotal(index, count);
            updateSummary();
            cartItems.textContent = Number(cartItems.textContent) - 1;
          }
        });
      });

      tableList.querySelectorAll(".cart-delete").forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = Number(btn.dataset.index);
          cart.splice(index, 1);
          window.localStorage.setItem("cart", JSON.stringify(cart));
          const newCart = getCart();
          if (newCart.length > 0) {
            cartBox.classList.add("active");
            cartItems.textContent = getCartItems(newCart);
          } else {
            cartBox.classList.remove("active");
          }

          renderCart();
          updateSummary();
        });
      });
    }

    function updateTotal(index, count) {
      const price = cart[index].price;
      const totalElem = tableList.querySelector(`.cart-total[data-index="${index}"]`);
      totalElem.textContent = `${(price * count).toFixed(2)}`;
      cart[index].quantity = count;
      window.localStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateSummary() {
      const totalInCart = cart.reduce((total, item) => total + item.price * item.quantity, 0);
      totalSummary.textContent = `$${totalInCart.toFixed(2)}`;

      let discount = 0;

      if (totalInCart >= 3000) {
        discount = cart.reduce((total, item) => {
          if (item.salesStatus) {
            return total + item.price * item.quantity * 0.1;
          }
          return total;
        }, 0);

        discounSummary.textContent = `$${discount.toFixed(2)}`;
        discounSummaryBox.classList.add("active");
      } else {
        discounSummary.textContent = "$0.00";
        discounSummaryBox.classList.remove("active");
      }

      const toPay = totalInCart - discount + 30;
      amountDue.textContent = `$${toPay.toFixed(2)}`;
    }

    clearList.addEventListener("click", () => {
      cart.length = 0;
      window.localStorage.removeItem("cart");
      renderCart();
      updateSummary();
      cartBox.classList.remove("active");
    });

    checkout.addEventListener("click", () => {
      cart.length = 0;
      window.localStorage.removeItem("cart");
      renderCart();
      updateSummary();
      window.alert("Thank you for your purchase.");
      cartBox.classList.remove("active");
    });

    renderCart();
  })();

  const btnToCatalog = document.getElementById("continue");
  btnToCatalog.addEventListener("click", () => {
    window.location.href = "./catalog.html";
  });
}
