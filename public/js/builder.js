let products = [];

// Generate unique ID string for cart builds
function generateSafeId() {
  return window.crypto && crypto.randomUUID
    ? crypto.randomUUID()
    : "kf_" + Date.now().toString(36) + Math.random().toString(36).substring(2);
}

let currentStep = 1;
const steps = document.querySelectorAll(".step");
const progressSteps = document.querySelectorAll(".progress-step");
const stepMap = { 1: "case", 2: "switch", 3: "keycaps", 4: "mods" };

// Hold temporary states of current hardware choices
let build = {
  case: { id: null, name: "-", price: 0, selected: false },
  switch: { id: null, name: "-", price: 0, selected: false },
  keycaps: { id: null, name: "-", price: 0, selected: false },
  mods: [],
};

// Render custom product options inside catalog card grids
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
    </div>`,
    )
    .join("");
}

// Render selected progressive step view configuration
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

// Control step wizard locks and navigation styles
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

// Display specific item row configurations in breakdown widget
function renderSummaryItem(id, data, isMulti = false) {
  const el = document.getElementById(id);
  if (!el) return;
  if (isMulti) {
    el.innerHTML = data.length
      ? data
          .map(
            (item) =>
              `<div style="display:flex; justify-content:space-between;"><span>${item.name}</span><span>£${item.price.toFixed(2)}</span></div>`,
          )
          .join("")
      : `<span class="empty">Not selected</span>`;
    return;
  }
  el.innerHTML = data.selected
    ? `<div style="display:flex; justify-content:space-between;"><span>${data.name}</span><span>£${data.price.toFixed(2)}</span></div>`
    : `<span class="empty">Not selected</span>`;
}

// Compute total price of current selected hardware bundle
function getTotal() {
  return (
    (build.case.price || 0) +
    (build.switch.price || 0) +
    (build.keycaps.price || 0) +
    build.mods.reduce((sum, m) => sum + (m.price || 0), 0)
  );
}

// Sync pricing breakdown display widget metrics
function syncSummary() {
  renderSummaryItem("summary-1", build.case);
  renderSummaryItem("summary-2", build.switch);
  renderSummaryItem("summary-3", build.keycaps);
  renderSummaryItem("summary-4", build.mods, true);
  const totalEl = document.getElementById("total-price");
  if (totalEl) totalEl.innerText = `£${getTotal().toFixed(2)}`;
}

// Handle layout selection click triggers across product lists
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

// Go back to the previous workspace view
document.querySelectorAll(".back-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep > 1) showStep(currentStep - 1);
  });
});

// Validate selection targets and step forward in wizard flow
document.querySelectorAll(".next-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep < steps.length) {
      const requiredKey = stepMap[currentStep];
      if (currentStep < 4 && !build[requiredKey].selected) {
        alert("Please select a part before proceeding to the next step.");
        return;
      }
      showStep(currentStep + 1);
    }
  });
});

// Handle jumps from click handlers inside left step bars
progressSteps.forEach((p) => {
  p.addEventListener("click", () => {
    const step = Number(p.dataset.progress);
    if (step > 1 && !build[stepMap[step - 1]].selected) return;
    showStep(step);
  });
});

// Reset configuration workflow settings entirely
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

const addToCartBtn = document.getElementById("add-to-cart-btn");
const cartToast = document.getElementById("cart-toast");

// Add completed assembly structure into local storage cart list
if (addToCartBtn) {
  addToCartBtn.addEventListener("click", () => {
    // Check if script.js globally loaded this function successfully
    if (typeof getUserCartKey !== "function" || typeof updateCartCount !== "function") {
      alert("System utilities are still loading. Please refresh and try again.");
      return;
    }

    const userKey = getUserCartKey();
    if (!userKey) {
      alert("Please log in to add items to your cart.");
      window.location.href = "account.html?redirect=builder";
      return;
    }

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

    const cartItem = {
      id: generateSafeId(),
      case: build.case,
      switch: build.switch,
      keycaps: build.keycaps,
      mods: build.mods,
      totalPrice: getTotal(),
    };

    const cart = JSON.parse(localStorage.getItem(userKey) || "[]");
    cart.push(cartItem);
    localStorage.setItem(userKey, JSON.stringify(cart));

    updateCartCount();

    if (cartToast) {
      cartToast.classList.add("show");
      setTimeout(() => cartToast.classList.remove("show"), 3000);
    }

    if (clearBtn) clearBtn.click();
  });
}

// Fetch products data catalog items and kick off builder view
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