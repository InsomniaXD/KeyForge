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

/// ===============================
/// AUTH (UNCHANGED)
/// ===============================
function syncAuthStatus() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const accountLinks = document.querySelectorAll("#account-link");
  const orderLinks = document.querySelectorAll(".nav-links a");

  if (!loggedInUser) return;

  accountLinks.forEach((link) => {
    link.textContent = "Account";
    link.href = "account.html";
  });

  orderLinks.forEach((link) => {
    if (link.textContent.trim() === "Orders") {
      link.href = "account.html";
      link.style.color = "var(--color-tertiary)";
      link.style.opacity = "1";
    }
  });
}

/// ===============================
/// ORDERS STORAGE
/// ===============================
function getOrders() {
  return JSON.parse(localStorage.getItem("kf_user_orders") || "[]");
}

function saveOrder(order) {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem("kf_user_orders", JSON.stringify(orders));
}

/// ===============================
/// MODALS
/// ===============================
function openOverlay(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "flex";
}

function closeOverlay(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

function placeOrder(build) {
  saveOrder({
    ...build,
    date: new Date().toLocaleDateString(),
    id: Math.floor(Math.random() * 90000) + 10000,
  });

  closeOverlay("checkout-overlay");
  openOverlay("success-overlay");
}

function finalizeOrder() {
  localStorage.removeItem("kf_current_build");
  window.location.href = "index.html";
}

/// ===============================
/// INIT (GLOBAL ONLY)
/// ===============================
document.addEventListener("DOMContentLoaded", () => {
  syncAuthStatus();
});
