// ShopNow — app.js
// Lab 2: search + category filter + price sort
// Lab 4: products now come from the Supabase database instead of a hard-coded array

// ---------- Helpers ----------
// Stops text coming from the database from being treated as HTML.
function escapeHTML(text) {
  return String(text ?? "").replace(/[&<>"']/g, ch => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));
}

// ---------- Data (filled by loadProducts) ----------
let products = [];

// ---------- Render products dynamically (same function as Lab 2) ----------
function renderProducts(list) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = "<p>No products match your search.</p>";
    return;
  }
  list.forEach(prod => {
    const stockLabel = prod.stock === 0 ? "Out of Stock"
                     : prod.stock <= 5 ? "Low Stock" : "In Stock";
    const stockClass = prod.stock === 0 ? "out" : prod.stock <= 5 ? "low" : "in";
    container.innerHTML += `
      <div class="product">
        <h3>${escapeHTML(prod.name)}</h3>
        <p>AED ${prod.price.toLocaleString()}</p>
        <p class="stock ${stockClass}">${stockLabel}</p>
        <a class="view-link" href="product-detail.html?id=${prod.id}">View details</a>
        <button ${prod.stock === 0 ? "disabled" : ""}>Add to Cart</button>
      </div>`;
  });
}

// ---------- Search + category + sort together ----------
const state = { term: "", category: "All", sort: "default" };

function applyFilters() {
  let result = products.filter(p =>
    (state.category === "All" || p.category === state.category) &&
    p.name.toLowerCase().includes(state.term)
  );
  if (state.sort === "low-high") result.sort((a, b) => a.price - b.price);
  if (state.sort === "high-low") result.sort((a, b) => b.price - a.price);

  renderProducts(result);

  const count = document.getElementById("result-count");
  if (count) count.textContent = `Showing ${result.length} of ${products.length} products`;
}

// ---------- Lab 4: load the products from Supabase ----------
async function loadProducts() {
  const container = document.getElementById("product-list");

  // config.js still has the placeholder values -> tell the user what to do
  if (typeof SUPABASE_URL === "undefined" || SUPABASE_URL.includes("YOUR-PROJECT-REF")) {
    container.innerHTML = "<p>Supabase is not set up yet. Open js/config.js and paste your Project URL and anon key.</p>";
    return;
  }
  if (!window.supabase) {
    container.innerHTML = "<p>The Supabase library did not load. Check the script tags in products.html (the CDN tag must come before js/app.js).</p>";
    return;
  }

  container.innerHTML = "<p>Loading products...</p>";
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data, error } = await supabaseClient
    .from("product")
    .select("*, category(category_name)")
    .order("name");

  if (error) {
    container.innerHTML = `<p>Could not load products: ${escapeHTML(error.message)}</p>`;
    return;
  }

  // Turn each database row into the simple shape the Lab 2 code expects.
  products = data.map(row => ({
    id: row.product_id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    stock: row.stock,
    category: row.category ? row.category.category_name : "Uncategorised"
  }));

  applyFilters(); // replaces the old Lab 2 "render the hard-coded array" call
}

// ---------- Wire up the controls (only on pages that have the catalogue) ----------
if (document.getElementById("product-list")) {
  document.getElementById("search-box").addEventListener("input", e => {
    state.term = e.target.value.toLowerCase().trim();
    applyFilters();
  });

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.category;
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    });
  });

  document.getElementById("sort-select").addEventListener("change", e => {
    state.sort = e.target.value;
    applyFilters();
  });

  loadProducts();
}
