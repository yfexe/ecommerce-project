// ShopNow — product-detail.js (Lab 4, Step 5)
// Reads ?id=... from the URL and shows that one product from Supabase.

function escapeHTML(text) {
  return String(text ?? "").replace(/[&<>"']/g, ch => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));
}

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const detailBox = document.getElementById("detail");

async function loadProduct() {
  // The id must be a whole number, e.g. product-detail.html?id=3
  if (!productId || !/^\d+$/.test(productId)) {
    detailBox.innerHTML = '<p>Product not found.</p><a class="back-link" href="products.html">&larr; Back to products</a>';
    return;
  }
  if (typeof SUPABASE_URL === "undefined" || SUPABASE_URL.includes("YOUR-PROJECT-REF")) {
    detailBox.innerHTML = "<p>Supabase is not set up yet. Open js/config.js and paste your Project URL and anon key.</p>";
    return;
  }
  if (!window.supabase) {
    detailBox.innerHTML = "<p>The Supabase library did not load. Check the script tags in product-detail.html.</p>";
    return;
  }

  detailBox.innerHTML = "<p>Loading...</p>";
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data: product, error } = await supabaseClient
    .from("product")
    .select("*, category(category_name)")
    .eq("product_id", productId)
    .single();

  // .single() returns an error when no row matches, so "no row" and "real error" are separated
  if (error && error.code !== "PGRST116") {
    detailBox.innerHTML = `<p>Could not load the product: ${escapeHTML(error.message)}</p>`;
    return;
  }
  if (!product) {
    detailBox.innerHTML = '<p>Product not found.</p><a class="back-link" href="products.html">&larr; Back to products</a>';
    return;
  }

  const stockLabel = product.stock === 0 ? "Out of Stock"
                   : product.stock <= 5 ? "Low Stock" : "In Stock";
  const stockClass = product.stock === 0 ? "out" : product.stock <= 5 ? "low" : "in";
  const categoryName = product.category ? product.category.category_name : "Uncategorised";

  document.title = `${product.name} — ShopNow`;
  detailBox.innerHTML = `
    <div class="detail-card">
      <h2>${escapeHTML(product.name)}</h2>
      <p>${escapeHTML(product.description)}</p>
      <p class="detail-price">AED ${Number(product.price).toLocaleString()}</p>
      <p>Category: ${escapeHTML(categoryName)}</p>
      <p class="stock ${stockClass}">${stockLabel}</p>
      <a class="back-link" href="products.html">&larr; Back to products</a>
    </div>`;
}

loadProduct();
