/// ===============================
/// THEME SYSTEM
/// ===============================
let products = [];
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const body = document.body;

const sunIcon = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

function updateThemeUI() {
  if (!themeIcon) return;
  themeIcon.innerHTML = body.classList.contains("dark") ? sunIcon : moonIcon;
}

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
}
updateThemeUI();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      body.classList.contains("dark") ? "dark" : "light",
    );
    updateThemeUI();
  });
}

/// ===============================
/// AUTH SYNC
/// ===============================
function syncAuthStatus() {
  const user = localStorage.getItem("loggedInUser");
  const accountLink = document.getElementById("account-link");
  if (user && accountLink) {
    accountLink.textContent = "Account";
    accountLink.href = "account.html";
  }
}
syncAuthStatus();

/// ===============================
/// BUILD STATE
/// ===============================
let currentStep = 1;
const steps = document.querySelectorAll(".step");
const progressSteps = document.querySelectorAll(".progress-step");
const stepMap = { 1: "case", 2: "switch", 3: "keycaps", 4: "mods" };

let build = {
  case: { id: null, name: "-", price: 0, selected: false },
  switch: { id: null, name: "-", price: 0, selected: false },
  keycaps: { id: null, name: "-", price: 0, selected: false },
  mods: [],
};

/// ===============================
/// RENDER GRIDS
/// ===============================
function renderGrid(category) {
  const container = document.getElementById(`grid-${category}`);
  if (!container) return;
  const filtered = products.filter((p) => p.category === category);
  container.innerHTML = filtered
    .map(
      (product) => `
    <div class="option-card" data-id="${product.id}" data-category="${product.category}">
      <img src="${product.img}" alt="${product.name}" onerror="this.style.display='none'" />
      <h4>${product.name}</h4>
      <p class="desc">${product.desc}</p>
      <p class="price">£${product.price.toFixed(2)}</p>
    </div>
  `,
    )
    .join("");
}

/// ===============================
/// SHOW STEP
/// ===============================
function showStep(step) {
  steps.forEach((s) => s.classList.remove("active"));
  const target = document.getElementById(`step-${step}`);
  if (target) target.classList.add("active");
  currentStep = step;
  const titles = {
    1: "Choose Kit",
    2: "Choose Switches",
    3: "Choose Keycaps",
    4: "Choose Mods",
  };
  const titleEl = document.getElementById("step-title");
  if (titleEl) titleEl.innerText = titles[step] || "Build";
  updateProgress();
}

/// ===============================
/// PROGRESS
/// ===============================
function updateProgress() {
  progressSteps.forEach((p) => {
    const step = Number(p.dataset.progress);
    const key = stepMap[step];
    const done = key === "mods" ? build.mods.length > 0 : build[key].selected;
    p.classList.toggle("active", step === currentStep || done);
    if (step > 1) {
      const unlocked = build[stepMap[step - 1]].selected;
      p.style.pointerEvents = unlocked ? "auto" : "none";
      p.style.opacity = unlocked ? "1" : "0.3";
    }
  });
}

/// ===============================
/// SUMMARY
/// ===============================
function renderSummaryItem(id, data, isMulti = false) {
  const el = document.getElementById(id);
  if (!el) return;
  if (isMulti) {
    el.innerHTML = data.length
      ? data.map((item) => `<div>${item.name}</div>`).join("")
      : `<span class="empty">Not selected</span>`;
    return;
  }
  el.innerHTML = data.selected
    ? `<div>${data.name}</div>`
    : `<span class="empty">Not selected</span>`;
}

function getTotal() {
  return (
    (build.case.price || 0) +
    (build.switch.price || 0) +
    (build.keycaps.price || 0) +
    build.mods.reduce((sum, m) => sum + (m.price || 0), 0)
  );
}

function syncSummary() {
  renderSummaryItem("summary-1", build.case);
  renderSummaryItem("summary-2", build.switch);
  renderSummaryItem("summary-3", build.keycaps);
  renderSummaryItem("summary-4", build.mods, true);
  const totalEl = document.getElementById("total-price");
  if (totalEl) totalEl.innerText = `£${getTotal().toFixed(2)}`;
}

/// ===============================
/// CARD CLICK (delegated)
/// ===============================
document.addEventListener("click", (e) => {
  const card = e.target.closest(".option-card");
  if (!card) return;
  const productId = parseInt(card.dataset.id);
  const category = card.dataset.category;
  const productData = products.find((p) => p.id === productId);
  if (!productData) return;

  if (category === "mods") {
    const index = build.mods.findIndex((m) => m.id === productId);
    if (index > -1) {
      build.mods.splice(index, 1);
      card.classList.remove("selected");
    } else {
      build.mods.push({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        selected: true,
      });
      card.classList.add("selected");
    }
  } else {
    build[category] = {
      id: productData.id,
      name: productData.name,
      price: productData.price,
      selected: true,
    };
    card.parentElement
      .querySelectorAll(".option-card")
      .forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
  }

  syncSummary();
  updateProgress();
});

/// ===============================
/// NAV BUTTONS
/// ===============================
document.querySelectorAll(".back-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep > 1) showStep(currentStep - 1);
  });
});
document.querySelectorAll(".next-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep < steps.length) showStep(currentStep + 1);
  });
});
progressSteps.forEach((p) => {
  p.addEventListener("click", () => {
    const step = Number(p.dataset.progress);
    if (step > 1 && !build[stepMap[step - 1]].selected) return;
    showStep(step);
  });
});

/// ===============================
/// CLEAR BUILD
/// ===============================
const clearBtn = document.getElementById("clear-build-btn");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    build = {
      case: { id: null, name: "-", price: 0, selected: false },
      switch: { id: null, name: "-", price: 0, selected: false },
      keycaps: { id: null, name: "-", price: 0, selected: false },
      mods: [],
    };
    document
      .querySelectorAll(".option-card")
      .forEach((c) => c.classList.remove("selected"));
    showStep(1);
    syncSummary();
    updateProgress();
  });
}

/// ===============================
/// CART LOGIC
/// ===============================
const addToCartBtn = document.getElementById("add-to-cart-btn");
const cartToast = document.getElementById("cart-toast");

// Updates the number in the Navbar: "Cart (2)"
function updateCartCount() {
  const cartLink = document.getElementById("cart-link");
  if (!cartLink) return;
  const cart = JSON.parse(localStorage.getItem("kf_cart") || "[]");
  cartLink.innerText = `Cart (${cart.length})`;
}

// Check cart count as soon as the page loads
document.addEventListener("DOMContentLoaded", updateCartCount);

if (addToCartBtn) {
  addToCartBtn.addEventListener("click", () => {
    // 1. Prevent adding incomplete builds
    if (
      !build.case.selected ||
      !build.switch.selected ||
      !build.keycaps.selected
    ) {
      alert(
        "Please select a Kit, Switch, and Keycaps before adding to your cart.",
      );
      return;
    }

    // 2. Package the current build into an object
    const cartItem = {
      id: Math.random().toString(36).substr(2, 9), // Generates a random ID for this build
      case: build.case,
      switch: build.switch,
      keycaps: build.keycaps,
      mods: build.mods,
      totalPrice: getTotal(),
    };

    // 3. Save to LocalStorage array (so cart.html can read it)
    const cart = JSON.parse(localStorage.getItem("kf_cart") || "[]");
    cart.push(cartItem);
    localStorage.setItem("kf_cart", JSON.stringify(cart));

    // 4. Update the Navbar counter
    updateCartCount();

    // 5. Show the success Toast Notification
    if (cartToast) {
      cartToast.classList.add("show");
      setTimeout(() => {
        cartToast.classList.remove("show");
      }, 3000); // Hides after 3 seconds
    }

    // 6. Reset the builder for the next keyboard
    if (clearBtn) clearBtn.click();
  });
}

/// ===============================
/// INIT & DATA FETCH
/// ===============================
async function init() {
  try {
    const response = await fetch("/api/products");
    products = await response.json();

    ["case", "switch", "keycaps", "mods"].forEach(renderGrid);

    showStep(1);
    syncSummary();
  } catch (err) {
    console.error("Init failed:", err);
  }
}

init();
