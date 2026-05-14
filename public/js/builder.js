const products = [
  // CASES (Step 1)
  { id: 1,  category: "case",    name: "Chillkey ND75 Elegant Purple",     price: 85.0,  desc: "75% 1.6mm PCB ISO Barebones Kit",            img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/nd75prpl.png?v=1728039628" },
  { id: 2,  category: "case",    name: "Chillkey ND75 Mountain Blue",       price: 85.0,  desc: "75% 1.6mm PCB ISO Barebones Kit",            img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/nd75blu.png?v=1728039636" },
  { id: 3,  category: "case",    name: "Glorious GMMK 2 Black",             price: 70.0,  desc: "65% ANSI Keyboard Barebones Kit",            img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/products/GMMK265bareboneANSI004.jpg?v=1656929772" },
  { id: 4,  category: "case",    name: "Zuoya GMK67S Black",                price: 55.0,  desc: "65% ANSI Keyboard Barebones Kit",            img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/9_1800x1800_ed3dc5de-0118-4a28-b01b-87dc94f59e0b.webp?v=1727359744" },
  { id: 5,  category: "case",    name: "Zuoya GMK67S White",                price: 55.0,  desc: "65% ANSI Keyboard Barebones Kit",            img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/10_1800x1800_52d2913d-7bcc-4e98-8623-0f64e85bb0e4.webp?v=1727360085" },
  { id: 6,  category: "case",    name: "Keychron Q4 QMK Navy Blue",         price: 120.0, desc: "60% Aluminium RGB ANSI Barebones",           img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/Keychron-Q4-60-Percent-Layout-QMK-Mechanical-Keyboard-barebone-blue-ANSI_1800x1800_1800x1800_bc897d54-81ac-41d5-9fdb-8ac356508206.webp?v=1689424690" },
  { id: 7,  category: "case",    name: "Keychron Q4 QMK Silver",            price: 120.0, desc: "60% Aluminium RGB ANSI Barebones",           img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/Keychron-Q4-60-Percent-Layout-QMK-Mechanical-Keyboard---grey---ANSI_1800x1800_1800x1800_9f061808-a814-40d8-8c18-1f66ae7404f8.webp?v=1689424664" },

  // SWITCHES (Step 2)
  { id: 8,  category: "switch",  name: "Akko POM Silver",                   price: 35.0,  desc: "90g Actuation Force Linear switch.",         img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/products/POM-Silver.jpg?v=1659550178" },
  { id: 9,  category: "switch",  name: "C³Equalz Banana Split",             price: 42.0,  desc: "90g Actuation Force Linear switch.",         img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/products/Ha0e0b2b3a29b4454b1361f41a8f79fe5S.png?v=1653908419" },
  { id: 10, category: "switch",  name: "C³Equalz Tangerine Dark Green",     price: 45.0,  desc: "67g Actuation Force Linear Switch",          img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/products/c3equalz-x-tkc-tangerine-linear-switches-145416_fc2d09fc-0ca6-4550-bd1d-22b97c799759.jpg?v=1653847522" },
  { id: 11, category: "switch",  name: "Akko POM Brown",                    price: 35.0,  desc: "90g Actuation Force Tactile switch.",        img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/products/POM-Brown.jpg?v=1659550253" },
  { id: 12, category: "switch",  name: "Feker Holy Panda",                  price: 50.0,  desc: "90g Actuation Force Tactile Switch",         img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/4_1080x1080_95cb8d75-c944-4acd-9edc-7a754e2b9dcc.png?v=1704625245" },
  { id: 13, category: "switch",  name: "Gateron Beer",                      price: 38.0,  desc: "90g Actuation Force Tactile Pre-Lubed.",     img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/c4cec3c15f.jpg?v=1704975252" },
  { id: 14, category: "switch",  name: "Chilkey EF Dopamine",               price: 40.0,  desc: "90g Actuation Force Blue Linear Switch",     img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/ND75_Switches_01.webp?v=1737198130" },
  { id: 15, category: "switch",  name: "Gateron Baby Raccoon",              price: 42.0,  desc: "90g Actuation Force Linear Pre-Lubed.",      img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/products/Hdcb86d9d03324d2aa8d4e48ce3905b6ct.png_960x960_1c261cab-90b8-4200-a319-5b7783337068.webp?v=1675605831" },
  { id: 16, category: "switch",  name: "Gateron Black KS-9",                price: 25.0,  desc: "90g Actuation Force Linear Switch",          img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/products/1_540x_887967a1-778e-46e5-86b8-c4e445fe08c9.webp?v=1652022725" },
  { id: 17, category: "switch",  name: "JWK Nylon T1",                      price: 30.0,  desc: "90g Actuation Force Tactile Switches",       img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/jwk-black-t1-tactile-switches-173172.webp?v=1769684491" },
  { id: 18, category: "switch",  name: "Wuque Studio WS",                   price: 48.0,  desc: "105g Heavy Tactile Switch",                  img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/wuque-ws-heavy-tactile-switches-536726_503125a8-e1e9-4827-b65e-2858f265f2b1.webp?v=1713964805" },
  { id: 19, category: "switch",  name: "Gateron Melodic",                   price: 40.0,  desc: "90g Clicky Pre-Lubed Switch",                img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/e0a0b55e42.jpg?v=1704974707" },

  // KEYCAPS (Step 3)
  { id: 20, category: "keycaps", name: "DaYe Classic Red Cherry Profile",   price: 45.0,  desc: "ABS | Cherry | ANSI | ISO",                 img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/Keycaps_9.png?v=1727521232" },
  { id: 21, category: "keycaps", name: "DaYe Lime Cherry Profile",          price: 45.0,  desc: "ABS | Cherry | ANSI | ISO",                 img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/variant-image-20.jpg?v=1727357078" },
  { id: 22, category: "keycaps", name: "DaYe Nuke Data Cherry Profile",     price: 45.0,  desc: "ABS | Cherry | ANSI | ISO",                 img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/rn-image_picker_lib_temp_65a129ed-af29-41d9-a5a9-963530efde89.webp?v=1727377362" },
  { id: 23, category: "keycaps", name: "TAI-HAO Sandy Beach",               price: 50.0,  desc: "PBT | OEM | ANSI | ISO",                    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/variant-image-19.jpg?v=1727521224" },

  // MODS (Step 4)
  { id: 24, category: "mods",    name: "Foam",                              price: 15.0,  desc: "Sound dampening for deeper sound profile.",  img: "images/foam.jpg" },
  { id: 25, category: "mods",    name: "Lube",                              price: 10.0,  desc: "Smooths switches for better typing feel.",   img: "images/lube.jpg" },
  { id: 26, category: "mods",    name: "Wireless",                          price: 25.0,  desc: "Adds Bluetooth connectivity to your board.", img: "images/wireless.jpg" },
];

/// ===============================
/// THEME SYSTEM
/// ===============================
const themeToggle = document.getElementById("theme-toggle");
const themeIcon   = document.getElementById("theme-icon");
const body        = document.body;

const sunIcon  = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

function updateThemeUI() {
  if (!themeIcon) return;
  themeIcon.innerHTML = body.classList.contains("dark") ? sunIcon : moonIcon;
}

if (localStorage.getItem("theme") === "dark") { body.classList.add("dark"); }
updateThemeUI();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
    updateThemeUI();
  });
}

/// ===============================
/// AUTH SYNC
/// ===============================
function syncAuthStatus() {
  const user        = localStorage.getItem("loggedInUser");
  const accountLink = document.getElementById("account-link");
  if (user && accountLink) {
    accountLink.textContent = "Account";
    accountLink.href        = "account.html";
  }
}
syncAuthStatus();

/// ===============================
/// BUILD STATE
/// ===============================
let currentStep = 1;
const steps         = document.querySelectorAll(".step");
const progressSteps = document.querySelectorAll(".progress-step");
const stepMap       = { 1: "case", 2: "switch", 3: "keycaps", 4: "mods" };

let build = {
  case:    { id: null, name: "-", price: 0, selected: false },
  switch:  { id: null, name: "-", price: 0, selected: false },
  keycaps: { id: null, name: "-", price: 0, selected: false },
  mods:    [],
};

/// ===============================
/// RENDER GRIDS
/// ===============================
function renderGrid(category) {
  const container = document.getElementById(`grid-${category}`);
  if (!container) return;
  const filtered = products.filter(p => p.category === category);
  container.innerHTML = filtered.map(product => `
    <div class="option-card" data-id="${product.id}" data-category="${product.category}">
      <img src="${product.img}" alt="${product.name}" onerror="this.style.display='none'" />
      <h4>${product.name}</h4>
      <p class="desc">${product.desc}</p>
      <p class="price">£${product.price.toFixed(2)}</p>
    </div>
  `).join("");
}
["case", "switch", "keycaps", "mods"].forEach(renderGrid);

/// ===============================
/// SHOW STEP
/// ===============================
function showStep(step) {
  steps.forEach(s => s.classList.remove("active"));
  const target = document.getElementById(`step-${step}`);
  if (target) target.classList.add("active");
  currentStep = step;
  const titles = { 1: "Choose Kit", 2: "Choose Switches", 3: "Choose Keycaps", 4: "Choose Mods" };
  const titleEl = document.getElementById("step-title");
  if (titleEl) titleEl.innerText = titles[step] || "Build";
  updateProgress();
}

/// ===============================
/// PROGRESS
/// ===============================
function updateProgress() {
  progressSteps.forEach(p => {
    const step = Number(p.dataset.progress);
    const key  = stepMap[step];
    const done = key === "mods" ? build.mods.length > 0 : build[key].selected;
    p.classList.toggle("active", step === currentStep || done);
    if (step > 1) {
      const unlocked = build[stepMap[step - 1]].selected;
      p.style.pointerEvents = unlocked ? "auto" : "none";
      p.style.opacity       = unlocked ? "1"    : "0.3";
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
    el.innerHTML = data.length ? data.map(item => `<div>${item.name}</div>`).join("") : `<span class="empty">Not selected</span>`;
    return;
  }
  el.innerHTML = data.selected ? `<div>${data.name}</div>` : `<span class="empty">Not selected</span>`;
}

function getTotal() {
  return (build.case.price    || 0) +
         (build.switch.price  || 0) +
         (build.keycaps.price || 0) +
         build.mods.reduce((sum, m) => sum + (m.price || 0), 0);
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
document.addEventListener("click", e => {
  const card = e.target.closest(".option-card");
  if (!card) return;
  const productId   = parseInt(card.dataset.id);
  const category    = card.dataset.category;
  const productData = products.find(p => p.id === productId);
  if (!productData) return;

  if (category === "mods") {
    const index = build.mods.findIndex(m => m.id === productId);
    if (index > -1) {
      build.mods.splice(index, 1);
      card.classList.remove("selected");
    } else {
      build.mods.push({ id: productData.id, name: productData.name, price: productData.price, selected: true });
      card.classList.add("selected");
    }
  } else {
    build[category] = { id: productData.id, name: productData.name, price: productData.price, selected: true };
    card.parentElement.querySelectorAll(".option-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
  }

  syncSummary();
  updateProgress();
});

/// ===============================
/// NAV BUTTONS
/// ===============================
document.querySelectorAll(".back-btn").forEach(btn => {
  btn.addEventListener("click", () => { if (currentStep > 1) showStep(currentStep - 1); });
});
document.querySelectorAll(".next-btn").forEach(btn => {
  btn.addEventListener("click", () => { if (currentStep < steps.length) showStep(currentStep + 1); });
});
progressSteps.forEach(p => {
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
      case:    { id: null, name: "-", price: 0, selected: false },
      switch:  { id: null, name: "-", price: 0, selected: false },
      keycaps: { id: null, name: "-", price: 0, selected: false },
      mods:    [],
    };
    document.querySelectorAll(".option-card").forEach(c => c.classList.remove("selected"));
    showStep(1);
    syncSummary();
    updateProgress();
  });
}

/// ===============================
/// CHECKOUT OVERLAY
/// ===============================
const checkoutBtn     = document.getElementById("checkout-btn");
const checkoutOverlay = document.getElementById("checkout-overlay");
const successOverlay  = document.getElementById("success-overlay");

// Open checkout overlay — populate summary
checkoutBtn.addEventListener("click", () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    alert("Please log in to save your build.");
    window.location.href = "account.html";
    return;
  }
  if (!build.case.selected || !build.switch.selected || !build.keycaps.selected) {
    alert("Please select a Kit, Switch, and Keycaps before checking out.");
    return;
  }

  // Populate overlay
  document.getElementById("co-case").textContent    = `${build.case.name} — £${build.case.price.toFixed(2)}`;
  document.getElementById("co-switch").textContent  = `${build.switch.name} — £${build.switch.price.toFixed(2)}`;
  document.getElementById("co-keycaps").textContent = `${build.keycaps.name} — £${build.keycaps.price.toFixed(2)}`;
  document.getElementById("co-mods").textContent    = build.mods.length ? build.mods.map(m => m.name).join(", ") : "None";
  document.getElementById("co-total").textContent   = `£${getTotal().toFixed(2)}`;

  checkoutOverlay.classList.add("open");
});

// Cancel
document.getElementById("checkout-cancel").addEventListener("click", () => {
  checkoutOverlay.classList.remove("open");
});

// Close overlay if clicking backdrop
checkoutOverlay.addEventListener("click", e => {
  if (e.target === checkoutOverlay) checkoutOverlay.classList.remove("open");
});

// Confirm — save to server / localStorage
document.getElementById("checkout-confirm").addEventListener("click", async () => {
  const loggedInUser = localStorage.getItem("loggedInUser");

  const orderData = {
    userEmail: loggedInUser,
    date:      new Date().toLocaleDateString(),
    id:        Math.floor(Math.random() * 90000) + 10000,
    case:      build.case,
    switch:    build.switch,
    keycaps:   build.keycaps,
    mods:      build.mods,
    total:     `£${getTotal().toFixed(2)}`,
  };

  try {
    const res = await fetch("/api/orders", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error();
  } catch {
    // Server offline — fall back to localStorage
    const existing = JSON.parse(localStorage.getItem("kf_orders") || "[]");
    existing.push(orderData);
    localStorage.setItem("kf_orders", JSON.stringify(existing));
  }

  checkoutOverlay.classList.remove("open");
  successOverlay.classList.add("open");
});

/// ===============================
/// INIT
/// ===============================
showStep(1);
syncSummary();