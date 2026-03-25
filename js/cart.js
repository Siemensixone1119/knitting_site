function renderCart() {
  const cartContainer = document.getElementById("cart-container");
  const totalElement = document.getElementById("cart-total");

  if (!cartContainer || !totalElement) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <p>Ваша корзина пуста.</p>
      </div>
    `;
    totalElement.textContent = "0 ₽";
    return;
  }

  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const cartItem = document.createElement("article");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <div 
        class="image-placeholder cart-item__image set-bg"
        data-setbg="${item.image}">
      </div>

      <div class="cart-item__content">
        <h2 class="cart-item__title">${item.title}</h2>
        <p class="cart-item__price">${item.price} ₽</p>
      </div>

      <button class="cart-item__remove" data-index="${index}">
        Удалить
      </button>
    `;

    cartContainer.appendChild(cartItem);
  });

  totalElement.textContent = `${total} ₽`;

  bgElement();

  const removeButtons = document.querySelectorAll(".cart-item__remove");

  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      const updatedCart = getCart();

      updatedCart.splice(index, 1);
      saveCart(updatedCart);
      updateCartCount();
      renderCart();
    });
  });
}

document.addEventListener("DOMContentLoaded", renderCart);