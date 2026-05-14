const products = [
  

/// ===============================
/// THEME SYSTEM
/// ===============================
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

let currentStep = 1;

const steps = document.querySelectorAll(".step");
const cards = document.querySelectorAll(".option-card");
const progressSteps = document.querySelectorAll(".progress-step");

const stepMap = {
  1: "case",
  2: "switch",
  3: "keycaps",
  4: "mods",
};

let build = {
  case: { name: "-", selected: false },
  switch: { name: "-", selected: false },
  keycaps: { name: "-", selected: false },
  mods: [],
};

/* =========================
   SHOW STEP
========================= */
function showStep(step) {
  steps.forEach((s) => s.classList.remove("active"));

  const target = document.getElementById(`step-${step}`);
  if (target) target.classList.add("active");

  currentStep = step;
  const title = document.getElementById("step-title");

  const titles = {
    1: "Choose Kit",
    2: "Choose Switches",
    3: "Choose Keycapas",
    4: "Choose Mods",
  };
  if (title) {
    title.innerText = titles[step] || "Build";
  }
  updateProgress();
}

/* =========================
   PROGRESS BAR
========================= */
/* =========================
   LEFT SIDEBAR PROGRESS
   - current step highlights
   - completed steps stay highlighted
   - locked steps not clickable
========================= */

function updateProgress() {
  progressSteps.forEach((p) => {
    const step = Number(p.dataset.progress);

    // converts step number into build key
    // 1 -> case
    // 2 -> switch
    // etc.
    const key = stepMap[step];

    const done = key === "mods" ? build.mods.length > 0 : build[key].selected;

    // ACTIVE RULES:
    // - current step always active
    // - completed steps remain active
    p.classList.toggle("active", step === currentStep || done);

    /* =========================
       LOCK FUTURE STEPS
       cannot click next step
       unless previous step done
    ========================= */

    if (step > 1) {
      const prevKey = stepMap[step - 1];

      const unlocked = build[prevKey].selected;

      p.style.pointerEvents = unlocked ? "auto" : "none";

      p.style.opacity = unlocked ? "1" : "0.3";
    }
  });
}
function renderSummaryItem(id, data, isMulti = false) {
  const el = document.getElementById(id);

  if (!el) return;

  // MULTI (mods)
  if (isMulti) {
    if (!data.length) {
      el.innerHTML = `<span class="empty">Not selected</span>`;
      return;
    }

    el.innerHTML = data.map((item) => `<div>${item.name}</div>`).join("");

    return;
  }

  // SINGLE
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

  // Calculate Total Price
  const casePrice = build.case.price || 0;
  const switchPrice = build.switch.price || 0;
  const keycapPrice = build.keycaps.price || 0;
  const modsPrice = build.mods.reduce((sum, mod) => sum + mod.price, 0);

  const total = casePrice + switchPrice + keycapPrice + modsPrice;

  const totalEl = document.getElementById("total-price"); // Add this ID to your HTML summary
  if (totalEl) {
    totalEl.innerText = `£${total.toFixed(2)}`;
  }
}

/* =========================
   CARD CLICK
========================= */

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const stepEl = card.closest(".step");
    const step = Number(stepEl.id.replace("step-", ""));
    const key = stepMap[step];
    const name = card.querySelector("h4")?.innerText || "Unknown";

    /* =========================
       MODS = MULTI SELECT
    ========================= */

    if (key === "mods") {
      card.classList.toggle("selected");

      const exists = build.mods.find((mod) => mod.name === name);

      // remove if already selected
      if (exists) {
        build.mods = build.mods.filter((mod) => mod.name !== name);
      }

      // add if not selected
      else {
        build.mods.push({
          name: name,
          selected: true,
        });
      }
    } else {
      /* =========================
       NORMAL SINGLE SELECT
    ========================= */
      // remove previous selection
      stepEl.querySelectorAll(".option-card").forEach((c) => {
        c.classList.remove("selected");
      });

      card.classList.add("selected");

      build[key] = {
        name: name,
        selected: true,
      };
    }

    updateProgress();
    syncSummary();
  });
});

/* =========================
   NEXT BUTTON
========================= */
document.querySelectorAll(".back-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  });
});
document.querySelectorAll(".next-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep < steps.length) {
      showStep(currentStep + 1);
    }
  });
});

/* =========================
   PROGRESS CLICK NAV
========================= */
progressSteps.forEach((p) => {
  p.addEventListener("click", () => {
    const step = Number(p.dataset.progress);
    const key = stepMap[step];

    // block skipping if not unlocked
    if (step > 1 && !build[stepMap[step - 1]]) return;

    showStep(step);
  });
});

/* =========================
   CLEAR BUILD
========================= */
const clearBtn = document.getElementById("clear-build-btn");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    // 1. Reset the build object
    build = {
      case: { id: null, name: "-", price: 0, selected: false },
      switch: { id: null, name: "-", price: 0, selected: false },
      keycaps: { id: null, name: "-", price: 0, selected: false },
      mods: [],
    };

    // 2. Query cards dynamically to remove selected class
    document
      .querySelectorAll(".option-card")
      .forEach((c) => c.classList.remove("selected"));

    showStep(1);
    syncSummary();
    updateProgress();
  });
}

// 1. Function to build the HTML for each card
function renderGrid(category) {
  const container = document.getElementById(`grid-${category}`);
  if (!container) return;

  const filtered = products.filter((p) => p.category === category);

  container.innerHTML = filtered
    .map(
      (product) => `
    <div class="option-card" data-id="${product.id}" data-category="${product.category}">
      <img src="${product.img}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p class="desc">${product.desc}</p>
      <p class="price">£${product.price.toFixed(2)}</p>
    </div>
  `,
    )
    .join("");
}

// 2. Initialize all grids on page load
["case", "switch", "keycaps", "mods"].forEach(renderGrid);

// 3. Update your click listener to use the ID
document.addEventListener("click", (e) => {
  const card = e.target.closest(".option-card");
  if (!card) return;

  const productId = parseInt(card.dataset.id);
  const category = card.dataset.category;
  const productData = products.find((p) => p.id === productId);

  if (category === "mods") {
    const index = build.mods.findIndex((m) => m.id === productId);
    if (index > -1) {
      build.mods.splice(index, 1);
      card.classList.remove("selected");
    } else {
      build.mods.push({
        id: productData.id,
        name: productData.name,
        selected: true,
      });
      card.classList.add("selected");
    }
  } else {
    // Single select logic
    build[category] = {
      id: productData.id,
      name: productData.name,
      selected: true,
    };

    // UI Update
    card.parentElement
      .querySelectorAll(".option-card")
      .forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
  }

  syncSummary();
  updateProgress();
});

/* =========================
   INIT
========================= */

showStep(1);
/* =========================

/* =========================
    CHECKOUT - SAVE BUILD TO LOCALSTORAGE
========================= */
document.getElementById("checkout-btn").addEventListener("click", () => {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    alert("Please log in to your account to save this build!");
    window.location.href = "account.html";
    return;
  }

  const orderData = {
    userEmail: loggedInUser,
    date: new Date().toLocaleDateString(),
    id: Math.floor(Math.random() * 90000) + 10000,
    case: build.case,
    switch: build.switch,
    keycaps: build.keycaps,
    mods: build.mods,
    total: document.getElementById("total-price").innerText
  };

  // Get existing orders from localStorage
  const existingOrders = JSON.parse(localStorage.getItem("kf_orders") || "[]");
  
  // Add new order
  existingOrders.push(orderData);
  
  // Save back to localStorage
  localStorage.setItem("kf_orders", JSON.stringify(existingOrders));

  alert("Build saved to your account!");
  window.location.href = "account.html";
});