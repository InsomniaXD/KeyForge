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
  mods: { name: "-", selected: false },
};

/* =========================
   SHOW STEP
========================= */
function showStep(step) {
  steps.forEach((s) => s.classList.remove("active"));

  const target = document.getElementById(`step-${step}`);
  if (target) target.classList.add("active");

  currentStep = step;

  updateProgress();
}

/* =========================
   PROGRESS BAR
========================= */
function updateProgress() {
  progressSteps.forEach((p) => {
    const step = Number(p.dataset.progress);
    const key = stepMap[step];

    const done = build[key] !== null;

    p.classList.toggle("active", step === currentStep || done);

    // lock future steps if previous not done
    if (step > 1) {
      const prevKey = stepMap[step - 1];
      p.style.pointerEvents = build[prevKey] ? "auto" : "none";
      p.style.opacity = build[prevKey] ? "1" : "0.3";
    }
  });
}

function syncSummary() {
  document.getElementById("summary-1").innerText = build.case.name;
  document.getElementById("summary-2").innerText = build.switch.name;
  document.getElementById("summary-3").innerText = build.keycaps.name;
  document.getElementById("summary-4").innerText = build.mods.name;
}

/* =========================
   CARD CLICK
========================= */
cards.forEach((card) => {
  card.addEventListener("click", () => {
    const stepEl = card.closest(".step");
    const step = Number(stepEl.id.replace("step-", ""));
    const key = stepMap[step];

    // remove selection in same step
    stepEl.querySelectorAll(".option-card").forEach((c) => {
      c.classList.remove("selected");
    });

    card.classList.add("selected");

    const name = card.querySelector("h4")?.innerText || "Unknown";

    build[key] = {
      name: name,
      selected: true,
    };

    updateProgress();
    syncSummary();
  });
});

/* =========================
   NEXT BUTTON
========================= */
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
   INIT
========================= */
showStep(1);
