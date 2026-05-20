const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const body = document.body;

const sunIcon = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

// Update theme icon based on current class
function updateThemeUI() {
  if (!themeIcon) return;
  themeIcon.innerHTML = body.classList.contains("dark") ? sunIcon : moonIcon;
}

// Initialize theme from local storage preference
if (localStorage.getItem("theme") === "dark") { body.classList.add("dark"); }
updateThemeUI();

// Handle theme toggle button clicks
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
    updateThemeUI();
  });
}

// Update navigation links if user is logged in
function syncAuthStatus() {
  const user = localStorage.getItem("loggedInUser");
  const accountLink = document.getElementById("account-link");
  if (user && accountLink) {
    accountLink.textContent = "Account";
    accountLink.href = "account.html";
  }
}

// Save placed order to database or cache fallback
async function saveOrder(order) {
  const email = localStorage.getItem("loggedInUser");
  if (!email) { alert("Please log in to save your build."); return; }

  const fullOrder = {
    ...order,
    userEmail: email,
    date: new Date().toLocaleDateString(),
    id: Math.floor(Math.random() * 90000) + 10000
  };

  try {
    // Send order data to database endpoint
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullOrder)
    });
    if (res.ok) console.log("Database updated.");
  } catch (err) {
    // Save locally if database is unreachable
    console.warn("DB offline. Saving to browser cache.");
    const orders = JSON.parse(localStorage.getItem("kf_user_orders") || "[]");
    orders.push(fullOrder);
    localStorage.setItem("kf_user_orders", JSON.stringify(orders));
  }
}

// Display overlay popup window
function openOverlay(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "flex";
}

// Hide overlay popup window
function closeOverlay(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

// Execute complete order flow sequence
function placeOrder(build) {
  saveOrder(build);
  closeOverlay("checkout-overlay");
  openOverlay("success-overlay");
}

// Get unique cart storage key matching current user globally
window.getUserCartKey = function() {
  const user = localStorage.getItem("loggedInUser");
  return user ? `kf_cart_${user}` : null;
};

// Compute and refresh cart item indicators in headers across all pages
window.updateCartCount = function() {
  const cartLink = document.getElementById("cart-link");
  if (!cartLink) return;
  
  const userKey = window.getUserCartKey();
  if (!userKey) {
    cartLink.innerText = `Cart (0)`;
    return;
  }
  const cart = JSON.parse(localStorage.getItem(userKey) || "[]");
  cartLink.innerText = `Cart (${cart.length})`;
};

// Fire initial state alignment routines on DOM readiness
document.addEventListener("DOMContentLoaded", () => {
  syncAuthStatus();
  window.updateCartCount();
});