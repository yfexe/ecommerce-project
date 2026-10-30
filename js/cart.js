// ShopNow — cart.js (Lab 5, Part A)
// The cart lives in localStorage, so it survives page changes and reloads.
// Loaded on every page, before app.js / product-detail.js.

// ---------- Helpers ----------
// Stops text coming from the database from being treated as HTML.
// (Moved here from app.js in Lab 5 so every page can use it.)
function escapeHTML(text) {
  return String(text ?? "").replace(/[&<>"']/g, ch => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));
}

// ---------- Step 1: cart helper functions ----------
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.product_id === product.product_id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  saveCart(getCart().filter(item => item.product_id !== productId));
}

function updateQuantity(productId, quantity) {
  // <input> values are strings: "2" + 1 would give "21", so convert first
  quantity = parseInt(quantity, 10) || 0;
  if (quantity <= 0) return removeFromCart(productId);
  const cart = getCart().map(item =>
    item.product_id === productId ? { ...item, quantity } : item
  );
  saveCart(cart);
}

// ---------- Step 2: "Add to Cart" by product id ----------
// The buttons only pass the id; the product is looked up in the products array
// already loaded on the page (app.js), or fetched from Supabase if it isn't there.
// This avoids putting JSON inside an onclick attribute (names with ' would break it).
async function addToCartById(productId, button) {
  let product = (typeof products !== "undefined")
    ? products.find(p => p.id === productId)
    : null;

  if (!product && supabaseClient) {
    const { data, error } = await supabaseClient
      .from("product")
      .select("product_id, name, price, stock")
      .eq("product_id", productId)
      .single();
    if (error || !data) return;
    product = { id: data.product_id, name: data.name, price: Number(data.price), stock: data.stock };
  }
  if (!product || product.stock === 0) return;

  // Only what the cart needs is stored, under the database column name product_id
  addToCart({ product_id: product.id, name: product.name, price: product.price });

  if (button) {
    const label = button.textContent;
    button.textContent = "Added ✓";
    setTimeout(() => { button.textContent = label; }, 900);
  }
}

// ---------- Step 3: render cart.html ----------
function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  const subtotalBox = document.getElementById("subtotal");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty. <a href="products.html">Browse products</a></p>';
    subtotalBox.textContent = "0.00";
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;
    return `
      <div class="cart-row">
        <span class="cart-name">${escapeHTML(item.name)}</span>
        <span class="cart-price">AED ${item.price.toFixed(2)}</span>
        <input type="number" min="0" value="${item.quantity}" aria-label="Quantity"
          onchange="updateQuantity(${item.product_id}, this.value); renderCart();">
        <span class="cart-line-total">AED ${lineTotal.toFixed(2)}</span>
        <button onclick="removeFromCart(${item.product_id}); renderCart();">Remove</button>
      </div>`;
  }).join("");

  subtotalBox.textContent = subtotal.toFixed(2);
}

// ---------- Item count next to "Cart" in the navbar ----------
function updateCartCount() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = count > 0 ? `(${count})` : "";
}

updateCartCount();
