// ShopNow — app.js
// Lab 2: dynamic product catalogue (search + category filter + price sort)

// ---------- Part A: products as data ----------
const products = [
  { id: 1,  name: "Dell Laptop",                 category: "Computers",   price: 3499, stock: 10 },
  { id: 2,  name: "Wireless Mouse",              category: "Accessories", price: 129,  stock: 25 },
  { id: 3,  name: "Smartphone X",                category: "Phones",      price: 2499, stock: 0  },
  { id: 4,  name: "Lenovo ThinkPad",             category: "Computers",   price: 4199, stock: 6  },
  { id: 5,  name: "HP Pavilion Desktop",         category: "Computers",   price: 2799, stock: 4  },
  { id: 6,  name: "Gaming Laptop",               category: "Computers",   price: 5999, stock: 3  },
  { id: 7,  name: "27-inch Monitor",             category: "Computers",   price: 1199, stock: 14 },
  { id: 8,  name: "Mini PC",                     category: "Computers",   price: 1599, stock: 0  },
  { id: 9,  name: "Tablet 10-inch",              category: "Computers",   price: 1099, stock: 9  },
  { id: 10, name: "Mechanical Keyboard",         category: "Accessories", price: 349,  stock: 18 },
  { id: 11, name: "Noise-Cancelling Headphones", category: "Accessories", price: 599,  stock: 7  },
  { id: 12, name: "USB-C Hub",                   category: "Accessories", price: 149,  stock: 30 },
  { id: 13, name: "Webcam HD 1080p",             category: "Accessories", price: 199,  stock: 2  },
  { id: 14, name: "Laptop Backpack",             category: "Accessories", price: 179,  stock: 12 },
  { id: 15, name: "Bluetooth Speaker",           category: "Accessories", price: 259,  stock: 0  },
  { id: 16, name: "Power Bank 20000mAh",         category: "Accessories", price: 119,  stock: 40 },
  { id: 17, name: "Smartphone Lite",             category: "Phones",      price: 1299, stock: 22 },
  { id: 18, name: "Flagship Phone Pro",          category: "Phones",      price: 4299, stock: 5  },
  { id: 19, name: "Budget Phone",                category: "Phones",      price: 599,  stock: 35 },
  { id: 20, name: "Foldable Phone",              category: "Phones",      price: 5499, stock: 2  }
];

// ---------- Part B: render products dynamically ----------
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
        <h3>${prod.name}</h3>
        <p>AED ${prod.price.toLocaleString()}</p>
        <p class="stock ${stockClass}">${stockLabel}</p>
        <button ${prod.stock === 0 ? "disabled" : ""}>Add to Cart</button>
      </div>`;
  });
}

// ---------- Part C + Challenge: search, category filter and sort together ----------
// One shared state object remembers all three controls, so changing one
// does not reset the others.
const state = { term: "", category: "All", sort: "default" };

function applyFilters() {
  // 1) filter: keep only products that match BOTH the category and the search term.
  //    .filter() returns a NEW array, so the original `products` is never changed.
  let result = products.filter(p =>
    (state.category === "All" || p.category === state.category) &&
    p.name.toLowerCase().includes(state.term)
  );

  // 2) sort: re-order what is left (sorting `result`, a copy, not `products`)
  if (state.sort === "low-high") result.sort((a, b) => a.price - b.price);
  if (state.sort === "high-low") result.sort((a, b) => b.price - a.price);

  renderProducts(result);

  const count = document.getElementById("result-count");
  if (count) count.textContent = `Showing ${result.length} of ${products.length} products`;
}

// ---------- Wire up the controls (only on pages that have the catalogue) ----------
if (document.getElementById("product-list")) {
  // Search box
  document.getElementById("search-box").addEventListener("input", e => {
    state.term = e.target.value.toLowerCase().trim();
    applyFilters();
  });

  // Category buttons
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.category;
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    });
  });

  // Price sort
  document.getElementById("sort-select").addEventListener("change", e => {
    state.sort = e.target.value;
    applyFilters();
  });

  applyFilters(); // first render
}
