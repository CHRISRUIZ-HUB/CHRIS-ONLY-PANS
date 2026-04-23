const products = [
  {
    id: 1,
    name: "Classic Non-Stick Frying Pan",
    category: "Pans",
    price: 1299,
    image: "https://images.unsplash.com/photo-1584990347449-a9f6f5d4d1f3?auto=format&fit=crop&w=800&q=80",
    description: "A reliable non-stick pan for everyday frying and sautéing."
  },
  {
    id: 2,
    name: "Cast Iron Skillet",
    category: "Pans",
    price: 1899,
    image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80",
    description: "Heavy-duty skillet that delivers rich flavor and even heat."
  },
  {
    id: 3,
    name: "Stainless Sauce Pan",
    category: "Cookware",
    price: 1499,
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80",
    description: "Perfect for soups, sauces, and daily kitchen prep."
  },
  {
    id: 4,
    name: "Chef Cooking Pot",
    category: "Cookware",
    price: 2199,
    image: "https://images.unsplash.com/photo-1625944525533-473f1b3d54f6?auto=format&fit=crop&w=800&q=80",
    description: "Spacious and durable cooking pot for bigger meals."
  },
  {
    id: 5,
    name: "Silicone Kitchen Utensil Set",
    category: "Accessories",
    price: 899,
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80",
    description: "A flexible and stylish utensil set for modern kitchens."
  },
  {
    id: 6,
    name: "Glass Lid Pan Set",
    category: "Pans",
    price: 2499,
    image: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80",
    description: "Premium pan set with clear lids for easier cooking control."
  }
];

const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const overlay = document.getElementById("overlay");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

let selectedCategory = "All";
let cart = JSON.parse(localStorage.getItem("onlyPansCart")) || [];

function formatPrice(price) {
  return price.toFixed(2);
}

function renderProducts() {
  const searchTerm = searchInput.value.toLowerCase();

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  productsGrid.innerHTML = "";

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <p style="grid-column: 1 / -1; text-align: center; color: #666;">
        No products found.
      </p>
    `;
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">₱${formatPrice(product.price)}</span>
          <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    `;

    productsGrid.appendChild(card);
  });
}

function saveCart() {
  localStorage.setItem("onlyPansCart", JSON.stringify(cart));
}

function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
}

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    cartTotal.textContent = "0.00";
    cartCount.textContent = "0";
    return;
  }

  let total = 0;
  let totalItems = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    totalItems += item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>₱${formatPrice(item.price)}</p>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  cartTotal.textContent = formatPrice(total);
  cartCount.textContent = totalItems;
}

function changeQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }

  saveCart();
  renderCart();
}

function removeItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

function openCart() {
  cartSidebar.classList.add("open");
  overlay.classList.add("show");
}

function closeCart() {
  cartSidebar.classList.remove("open");
  overlay.classList.remove("show");
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    selectedCategory = button.dataset.category;
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);
cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  alert("Thank you for your order! This is a demo checkout only.");
  cart = [];
  saveCart();
  renderCart();
  closeCart();
});

renderProducts();
renderCart();
