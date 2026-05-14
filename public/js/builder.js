/// ===============================
/// THEME SYSTEM
/// ===============================
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

const sunIcon = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

function updateThemeUI() {
  if (!themeIcon) return;
  themeIcon.innerHTML = body.classList.contains("dark") ? sunIcon : moonIcon;
}

function initTheme() {
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
}

/// ===============================
/// STATE
/// ===============================
let currentStep = 1;
let products = [];

let build = {
  case: { id: null, name: "-", price: 0, selected: false },
  switch: { id: null, name: "-", price: 0, selected: false },
  keycaps: { id: null, name: "-", price: 0, selected: false },
  mods: [],
};

const stepMap = {
  1: "case",
  2: "switch",
  3: "keycaps",
  4: "mods",
};

const steps = () => document.querySelectorAll(".step");
const progressSteps = () => document.querySelectorAll(".progress-step");

/// ===============================
/// STEP SYSTEM
/// ===============================
function showStep(step) {
  steps().forEach((s) => s.classList.remove("active"));

  const target = document.getElementById(`step-${step}`);
  if (target) target.classList.add("active");

  currentStep = step;

  const title = document.getElementById("step-title");
  const titles = {
    1: "Choose Kit",
    2: "Choose Switches",
    3: "Choose Keycaps",
    4: "Choose Mods",
  };

  if (title) title.innerText = titles[step];

  updateProgress();
}

/// ===============================
/// PROGRESS
/// ===============================
function updateProgress() {
  progressSteps().forEach((p) => {
    const step = Number(p.dataset.progress);
    const key = stepMap[step];

    const done = key === "mods" ? build.mods.length > 0 : build[key].selected;

    p.classList.toggle("active", step === currentStep || done);

    if (step > 1) {
      const prevKey = stepMap[step - 1];
      const unlocked = build[prevKey].selected;

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
    if (!data.length) {
      el.innerHTML = `<span class="empty">Not selected</span>`;
      return;
    }
    el.innerHTML = data.map((m) => `<div>${m.name}</div>`).join("");
    return;
  }

  if (!data.selected) {
    el.innerHTML = `<span class="empty">Not selected</span>`;
    return;
  }

  el.innerHTML = `<div>${data.name}</div>`;
}

function syncSummary() {
  renderSummaryItem("summary-1", build.case);
  renderSummaryItem("summary-2", build.switch);
  renderSummaryItem("summary-3", build.keycaps);
  renderSummaryItem("summary-4", build.mods, true);

  const total =
    (build.case.price || 0) +
    (build.switch.price || 0) +
    (build.keycaps.price || 0) +
    build.mods.reduce((s, m) => s + (m.price || 0), 0);

  const totalEl = document.getElementById("total-price");
  if (totalEl) totalEl.innerText = `£${total.toFixed(2)}`;
}

/// ===============================
/// PRODUCTS
/// ===============================
async function loadProducts() {
  console.log("Loading products...");

  const res = await fetch("/api/products");
  products = await res.json();

  console.log("Products loaded:", products.length);

  ["case", "switch", "keycaps", "mods"].forEach(renderGrid);
}

function renderGrid(category) {
  const container = document.getElementById(`grid-${category}`);
  if (!container) return;

  const filtered = products.filter((p) => p.category === category);

  container.innerHTML = filtered
    .map(
      (p) => `
      <div class="option-card" data-id="${p.id}" data-category="${p.category}">
        <img src="${p.img}" />
        <h4>${p.name}</h4>
        <p class="desc">${p.desc}</p>
        <p class="price">£${p.price.toFixed(2)}</p>
      </div>
    `,
    )
    .join("");
}

/// ===============================
/// CLICK HANDLER
/// ===============================
document.addEventListener("click", (e) => {
  const card = e.target.closest(".option-card");
  if (!card) return;

  const id = Number(card.dataset.id);
  const category = card.dataset.category;
  const product = products.find((p) => p.id === id);

  if (!product) return;

  if (category === "mods") {
    const index = build.mods.findIndex((m) => m.id === id);

    if (index > -1) {
      build.mods.splice(index, 1);
      card.classList.remove("selected");
    } else {
      build.mods.push({
        id: product.id,
        name: product.name,
        price: product.price,
        selected: true,
      });
      card.classList.add("selected");
    }
  } else {
    build[category] = {
      id: product.id,
      name: product.name,
      price: product.price,
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
/// NAV
/// ===============================
document.querySelectorAll(".back-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep > 1) showStep(currentStep - 1);
  });
});

document.querySelectorAll(".next-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep < 4) showStep(currentStep + 1);
  });
});

progressSteps().forEach((p) => {
  p.addEventListener("click", () => {
    const step = Number(p.dataset.progress);

    if (step > 1 && !build[stepMap[step - 1]].selected) return;

    showStep(step);
  });
});

/// ===============================
/// CLEAR
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
/// CHECKOUT
/// ===============================
const checkoutBtn = document.getElementById("checkout-btn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", async () => {
    const user = localStorage.getItem("loggedInUser");

    if (!user) {
      alert("Login required.");
      window.location.href = "account.html";
      return;
    }

    const orderData = {
      userEmail: user,
      date: new Date().toISOString(),
      case: build.case,
      switch: build.switch,
      keycaps: build.keycaps,
      mods: build.mods,
      total: document.getElementById("total-price").innerText,
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (res.ok) {
      alert("Order saved!");
      window.location.href = "account.html";
    } else {
      alert("Failed to save order.");
    }
  });
}

/// ===============================
/// INIT (IMPORTANT FIX)
/// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await loadProducts();
  showStep(1);
  syncSummary();
});
