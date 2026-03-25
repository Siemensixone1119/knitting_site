function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const countElements = document.querySelectorAll("#cart-count");

  countElements.forEach((element) => {
    element.textContent = cart.length;
  });
}

function addToCart(product) {
  const cart = getCart();
  cart.push(product);
  saveCart(cart);
  updateCartCount();
  alert(`Товар "${product.title}" добавлен в корзину`);
}

function bgElement() {
  const elements = document.querySelectorAll(".set-bg");

  elements.forEach((elem) => {
    const bg = elem.dataset.setbg;

    if (bg) {
      elem.style.backgroundImage = `url(${bg})`;
    }
  });
}

function createProductCard(product) {
  return `
    <article class="product-card" data-category="${product.category}">
      <div
        class="image-placeholder product-card__placeholder set-bg"
        data-setbg="${product.image}">
      </div>

      <div class="product-card__body">
        <p class="product-card__category">${product.category}</p>
        <h3 class="product-card__title">${product.title}</h3>
        <p class="product-card__desc">${product.description}</p>

        <div class="product-card__bottom">
          <span class="product-card__price">${product.price} ₽</span>

          <div class="product-card__actions">
            <a href="product.html?id=${product.id}" class="button button--small button--light">
              Подробнее
            </a>

            <button
              class="button button--small add-to-cart"
              data-id="${product.id}"
              data-title="${product.title}"
              data-price="${product.price}"
              data-image="${product.image}"
            >
              В корзину
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderPopularProducts() {
  const container = document.getElementById("popular-products");
  if (!container || typeof productsData === "undefined") return;

  const popularItems = productsData.filter((product) => product.popular);

  container.innerHTML = popularItems.length
    ? popularItems.map(createProductCard).join("")
    : '<p class="slider__empty">Популярные товары появятся позже.</p>';

  bgElement();
}

function renderCatalogProducts(filter = "all") {
  const container = document.getElementById("catalog-products");
  if (!container || typeof productsData === "undefined") return;

  const items = filter === "all"
    ? productsData
    : productsData.filter((product) => product.category === filter);

  container.innerHTML = items.length
    ? items.map(createProductCard).join("")
    : '<p class="slider__empty">Товары не найдены.</p>';

  bgElement();
}

function setupCatalogFilters() {
  const filtersContainer = document.getElementById("catalog-filters");
  if (!filtersContainer) return;

  renderCatalogProducts();

  filtersContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (!button) return;

    filtersContainer.querySelectorAll(".filter-btn").forEach((item) => {
      item.classList.remove("filter-btn--active");
    });

    button.classList.add("filter-btn--active");
    renderCatalogProducts(button.dataset.filter);
  });
}

function setupForms() {
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      formSuccess.textContent = "Сообщение отправлено. Мы скоро с вами свяжемся.";
      contactForm.reset();
    });
  }

  const checkoutForm = document.getElementById("checkout-form");
  const checkoutSuccess = document.getElementById("checkout-success");

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();
      checkoutSuccess.textContent = "Заказ успешно оформлен.";
      localStorage.removeItem("cart");
      updateCartCount();
      checkoutForm.reset();
    });
  }
}

function setupProductPage() {
  const productPage = document.getElementById("product-page");
  if (!productPage || typeof productsData === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = productsData.find((item) => item.id === id) || productsData[0];

  productPage.innerHTML = `
    <div
      class="image-placeholder image-placeholder--large set-bg"
      data-setbg="${product.image}">
    </div>

    <div>
      <p class="product-page__category">${product.category}</p>
      <h1 class="product-page__title">${product.title}</h1>
      <p class="product-page__text">${product.description}</p>
      <p class="product-page__text">
        Изделие выполняется вручную. Возможен выбор цвета, размера и небольших деталей оформления по договорённости.
      </p>

      <div class="product-page__price">${product.price} ₽</div>

      <div class="product-page__actions">
        <button class="button" id="product-add-btn">Добавить в корзину</button>
        <a href="catalog.html" class="button button--light">Вернуться в каталог</a>
      </div>
    </div>
  `;

  bgElement();

  const productAddBtn = document.getElementById("product-add-btn");
  if (productAddBtn) {
    productAddBtn.addEventListener("click", () => addToCart(product));
  }
}

function setupBurgerMenu() {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  if (!burger || !nav) return;

  burger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    burger.classList.toggle("is-active", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav--open");
      burger.classList.remove("is-active");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

function getSliderStep(track) {
  const item = track.children[0];
  if (!item) return 0;

  const gap = parseFloat(window.getComputedStyle(track).gap || 0);
  return item.getBoundingClientRect().width + gap;
}

function updateSliderButtons(slider, track, index, maxIndex) {
  const prevBtn = document.querySelector(`[data-slider-prev="${slider.id}"]`);
  const nextBtn = document.querySelector(`[data-slider-next="${slider.id}"]`);

  if (prevBtn) prevBtn.disabled = index <= 0;
  if (nextBtn) nextBtn.disabled = index >= maxIndex;
}

function setupSlider(slider) {
  const track = slider.querySelector(".slider__track");
  if (!track || !track.children.length) return;

  let index = 0;

  const apply = () => {
    const step = getSliderStep(track);
    const viewport = slider.querySelector(".slider__viewport");
    const viewportWidth = viewport ? viewport.clientWidth : 0;
    const maxShift = Math.max(0, track.scrollWidth - viewportWidth);
    const desiredShift = Math.min(index * step, maxShift);

    track.style.transform = `translateX(-${desiredShift}px)`;

    const maxIndex = step > 0 ? Math.ceil(maxShift / step) : 0;
    if (index > maxIndex) index = maxIndex;

    updateSliderButtons(slider, track, index, maxIndex);
  };

  const prevBtn = document.querySelector(`[data-slider-prev="${slider.id}"]`);
  const nextBtn = document.querySelector(`[data-slider-next="${slider.id}"]`);

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      index = Math.max(0, index - 1);
      apply();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const step = getSliderStep(track);
      const viewport = slider.querySelector(".slider__viewport");
      const viewportWidth = viewport ? viewport.clientWidth : 0;
      const maxShift = Math.max(0, track.scrollWidth - viewportWidth);
      const maxIndex = step > 0 ? Math.ceil(maxShift / step) : 0;

      index = Math.min(maxIndex, index + 1);
      apply();
    });
  }

  window.addEventListener("resize", apply);
  apply();
}

function createReviewCard(review) {
  return `
    <article class="review-card">
      <h3 class="review-card__title">${review.author}</h3>
      <p class="review-card__text">${review.text}</p>
    </article>
  `;
}

function renderReviews() {
  const container = document.getElementById("reviews-list");
  if (!container || typeof reviewsData === "undefined") return;

  container.innerHTML = reviewsData.length
    ? reviewsData.map(createReviewCard).join("")
    : '<p class="slider__empty">Отзывы появятся позже.</p>';
}

function setupSliders() {
  document.querySelectorAll(".slider[id]").forEach(setupSlider);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest(".add-to-cart");
  if (!button) return;

  const product = {
    id: button.dataset.id,
    title: button.dataset.title,
    price: Number(button.dataset.price),
    image: button.dataset.image
  };

  addToCart(product);
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  setupBurgerMenu();
  renderPopularProducts();
  setupCatalogFilters();
  setupForms();
  setupProductPage();
  renderReviews();
  setupSliders();
  bgElement();
});