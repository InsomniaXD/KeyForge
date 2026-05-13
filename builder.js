const products = [
  // CASES (Step 1)
  {
    id: 1,
    category: "case",
    name: "Chillkey ND75 Elegant Purple",
    price: 85.0,
    desc: "75% 1.6mm PCB ISO Barebones Kit",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/nd75prpl.png?v=1728039628",
  },
  {
    id: 2,
    category: "case",
    name: "Chillkey ND75 Mountain Blue",
    price: 85.0,
    desc: "75% 1.6mm PCB ISO Barebones Kit",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/nd75blu.png?v=1728039636",
  },
  {
    id: 3,
    category: "case",
    name: "Glorious GMMK 2 Black",
    price: 70.0,
    desc: "65% ANSI Keyboard Barebones Kit",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/products/GMMK265bareboneANSI004.jpg?v=1656929772",
  },
  {
    id: 4,
    category: "case",
    name: "Zuoya GMK67S Black",
    price: 55.0,
    desc: "65% ANSI Keyboard Barebones Kit",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/9_1800x1800_ed3dc5de-0118-4a28-b01b-87dc94f59e0b.webp?v=1727359744",
  },
  {
    id: 5,
    category: "case",
    name: "Zuoya GMK67S White",
    price: 55.0,
    desc: "65% ANSI Keyboard Barebones Kit",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/10_1800x1800_52d2913d-7bcc-4e98-8623-0f64e85bb0e4.webp?v=1727360085",
  },
  {
    id: 6,
    category: "case",
    name: "Keychron Q4 QMK Navy Blue",
    price: 120.0,
    desc: "60% Aluminium RGB ANSI Barebones",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/Keychron-Q4-60-Percent-Layout-QMK-Mechanical-Keyboard-barebone-blue-ANSI_1800x1800_1800x1800_bc897d54-81ac-41d5-9fdb-8ac356508206.webp?v=1689424690",
  },
  {
    id: 7,
    category: "case",
    name: "Keychron Q4 QMK Silver",
    price: 120.0,
    desc: "60% Aluminium RGB ANSI Barebones",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/Keychron-Q4-60-Percent-Layout-QMK-Mechanical-Keyboard---grey---ANSI_1800x1800_1800x1800_9f061808-a814-40d8-8c18-1f66ae7404f8.webp?v=1689424664",
  },

  // SWITCHES (Step 2)
  {
    id: 8,
    category: "switch",
    name: "Akko POM Silver",
    price: 35.0,
    desc: "90g Actuation Force Linear switch.",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/products/POM-Silver.jpg?v=1659550178",
  },
  {
    id: 9,
    category: "switch",
    name: "C³Equalz Banana Split",
    price: 42.0,
    desc: "90g Actuation Force Linear switch.",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/products/Ha0e0b2b3a29b4454b1361f41a8f79fe5S.png?v=1653908419",
  },
  {
    id: 10,
    category: "switch",
    name: "C³Equalz Tangerine Dark Green",
    price: 45.0,
    desc: "67g Actuation Force Linear Switch",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/products/c3equalz-x-tkc-tangerine-linear-switches-145416_fc2d09fc-0ca6-4550-bd1d-22b97c799759.jpg?v=1653847522",
  },
  {
    id: 11,
    category: "switch",
    name: "Akko POM Brown",
    price: 35.0,
    desc: "90g Actuation Force Tactile switch.",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/products/POM-Brown.jpg?v=1659550253",
  },
  {
    id: 12,
    category: "switch",
    name: "Feker Holy Panda",
    price: 50.0,
    desc: "90g Actuation Force Tactile Switch",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/4_1080x1080_95cb8d75-c944-4acd-9edc-7a754e2b9dcc.png?v=1704625245",
  },
  {
    id: 13,
    category: "switch",
    name: "Gateron Beer",
    price: 38.0,
    desc: "90g Actuation Force Tactile Pre-Lubed Switch.",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/c4cec3c15f.jpg?v=1704975252",
  },
  {
    id: 14,
    category: "switch",
    name: "Chilkey EF Dopamine",
    price: 40.0,
    desc: "90g Actuation Force Blue Linear Switch",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/ND75_Switches_01.webp?v=1737198130",
  },
  {
    id: 15,
    category: "switch",
    name: "Gateron Baby Raccoon",
    price: 42.0,
    desc: "90g Actuation Force Linear Pre-Lubed Switch.",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/products/Hdcb86d9d03324d2aa8d4e48ce3905b6ct.png_960x960_1c261cab-90b8-4200-a319-5b7783337068.webp?v=1675605831",
  },
  {
    id: 16,
    category: "switch",
    name: "Gateron Black KS-9",
    price: 25.0,
    desc: "90g Actuation Force Linear Switch",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/products/1_540x_887967a1-778e-46e5-86b8-c4e445fe08c9.webp?v=1652022725",
  },
  {
    id: 17,
    category: "switch",
    name: "JWK Nylon T1",
    price: 30.0,
    desc: "90g Actuation Force Tactile Switches",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/jwk-black-t1-tactile-switches-173172.webp?v=1769684491",
  },
  {
    id: 18,
    category: "switch",
    name: "Wuque Studio WS",
    price: 48.0,
    desc: "105g Heavy Tactile Switch",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/wuque-ws-heavy-tactile-switches-536726_503125a8-e1e9-4827-b65e-2858f265f2b1.webp?v=1713964805",
  },
  {
    id: 19,
    category: "switch",
    name: "Gateron Melodic",
    price: 40.0,
    desc: "90g Clicky Pre-Lubed Switch",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/e0a0b55e42.jpg?v=1704974707",
  },

  // KEYCAPS (Step 3)
  {
    id: 20,
    category: "keycaps",
    name: "DaYe Classic Red Cherry Profile",
    price: 45.0,
    desc: "ABS | Cherry | ANSI | ISO",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/Keycaps_9.png?v=1727521232",
  },
  {
    id: 21,
    category: "keycaps",
    name: "DaYe Lime Cherry Profile",
    price: 45.0,
    desc: "ABS | Cherry | ANSI | ISO",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/variant-image-20.jpg?v=1727357078",
  },
  {
    id: 22,
    category: "keycaps",
    name: "DaYe Nuke Data Cherry Profile",
    price: 45.0,
    desc: "ABS | Cherry | ANSI | ISO",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/rn-image_picker_lib_temp_65a129ed-af29-41d9-a5a9-963530efde89.webp?v=1727377362",
  },
  {
    id: 23,
    category: "keycaps",
    name: "TAI-HAO Sandy Beach",
    price: 50.0,
    desc: "PBT | OEM | ANSI | ISO",
    img: "https://cdn.shopify.com/s/files/1/0562/7713/9620/files/variant-image-19.jpg?v=1727521224",
  },

  // MODS (Step 4)
  {
    id: 24,
    category: "mods",
    name: "Foam",
    price: 15.0,
    desc: "Sound dampening for deeper sound profile.",
    img: "images/foam.jpg",
  },
  {
    id: 25,
    category: "mods",
    name: "Lube",
    price: 10.0,
    desc: "Smooths switches for better typing feel.",
    img: "images/lube.jpg",
  },
  {
    id: 26,
    category: "mods",
    name: "Wireless",
    price: 25.0,
    desc: "Adds Bluetooth connectivity to your board.",
    img: "images/wireless.jpg",
  },
];

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
