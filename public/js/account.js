document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section");
  const signupSection = document.getElementById("signup-section");
  const accountSection = document.getElementById("account-section");

  // --- UI TOGGLE SWITCHES ---
  const showSignupBtn = document.getElementById("show-signup");
  if (showSignupBtn) {
    showSignupBtn.onclick = (e) => {
      e.preventDefault();
      loginSection.style.display = "none";
      signupSection.style.display = "block";
    };
  }

  const showLoginBtn = document.getElementById("show-login");
  if (showLoginBtn) {
    showLoginBtn.onclick = (e) => {
      e.preventDefault();
      signupSection.style.display = "none";
      loginSection.style.display = "block";
    };
  }

  // --- TAB NAVIGATION SYSTEMS ---
  const historyBtn = document.getElementById("tab-btn-history");
  const settingsBtn = document.getElementById("tab-btn-settings");

  if (historyBtn) {
    historyBtn.addEventListener("click", () => switchTab("history"));
  }
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => switchTab("settings"));
  }

  function switchTab(tab) {
    document.getElementById("tab-history").style.display =
      tab === "history" ? "block" : "none";
    document.getElementById("tab-settings").style.display =
      tab === "settings" ? "block" : "none";

    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.toggle(
        "active",
        btn.textContent.toLowerCase().includes(tab)
      );
    });
  }

  // --- SIGNUP LOGIC ---
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.onsubmit = (e) => {
      e.preventDefault();
      const email = document.getElementById("signup-email").value;
      let users = JSON.parse(localStorage.getItem("kf_users") || "[]");

      if (users.find((u) => u.email === email)) {
        alert("Email already in use.");
        return;
      }

      const newUser = {
        firstName: document.getElementById("signup-firstname").value,
        lastName: document.getElementById("signup-lastname").value,
        email: email,
        password: document.getElementById("signup-password").value,
      };

      users.push(newUser);
      localStorage.setItem("kf_users", JSON.stringify(users));
      loginUser(newUser);
    };
  }

  // --- LOGIN LOGIC ---
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.onsubmit = (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const pass = document.getElementById("login-password").value;

      let users = JSON.parse(localStorage.getItem("kf_users") || "[]");
      const user = users.find(
        (u) => u.email === email && u.password === pass
      );

      if (user) {
        loginUser(user);
      } else {
        alert("Invalid credentials.");
      }
    };
  }

  function loginUser(user) {
    localStorage.setItem("loggedInUser", user.email);
    localStorage.setItem("kf_user_data", JSON.stringify(user));
    showAccount(user);
  }

  function showAccount(user) {
    loginSection.style.display = "none";
    signupSection.style.display = "none";
    accountSection.style.display = "block";

    document.getElementById("p-full-name").textContent =
      `${user.firstName} ${user.lastName}`;
    document.getElementById("p-email").textContent = user.email;
    document.getElementById("edit-firstname").value = user.firstName;
    document.getElementById("edit-lastname").value = user.lastName;

    renderOrders();
  }

  function renderOrders() {
    const list = document.getElementById("orders-list");
    const email = localStorage.getItem("loggedInUser");
    const allOrders = JSON.parse(localStorage.getItem("kf_orders") || "[]");
    const myOrders = allOrders.filter((o) => o.userEmail === email);

    if (myOrders.length === 0) {
      list.innerHTML = `<p class="no-builds-text">No builds saved yet.</p>`;
      return;
    }

    list.innerHTML = myOrders
      .reverse()
      .map((o) => {
        const formattedId = String(o.displayId || o.id || "1").padStart(7, "0");
        
        const itemsHtml = o.items.map((item, idx) => `
          <div style="margin-top: 0.8rem; padding-top: 0.8rem; border-top: 1px dashed rgba(128,128,128,0.2); text-align: left;">
              <p><strong>Build ${idx + 1}: ${item.case.name}</strong></p>
              <p class="order-card-switch-caps">${item.switch.name} • ${item.keycaps.name}</p>
          </div>
        `).join("");

        return `
            <div class="order-card">
                <div class="order-meta">
                  <span style="font-weight: 900; color: var(--color-tertiary);">Order: #${formattedId}</span>
                  <span>${o.date || ""}</span>
                </div>
                ${itemsHtml}
                <p class="order-card-total" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(128,128,128,0.2); text-align: right; font-size: 1.1rem;">
                  Grand Total: £${(o.totalPrice || 0).toFixed(2)}
                </p>
            </div>
        `;
      })
      .join("");
  }

  // --- EDIT PROFILE LOGIC ---
  const editProfileForm = document.getElementById("edit-profile-form");
  if (editProfileForm) {
    editProfileForm.onsubmit = (e) => {
      e.preventDefault();
      const email = localStorage.getItem("loggedInUser");
      let users = JSON.parse(localStorage.getItem("kf_users") || "[]");
      const idx = users.findIndex((u) => u.email === email);

      if (idx !== -1) {
        users[idx].firstName =
          document.getElementById("edit-firstname").value;
        users[idx].lastName = document.getElementById("edit-lastname").value;
        localStorage.setItem("kf_users", JSON.stringify(users));
        localStorage.setItem("kf_user_data", JSON.stringify(users[idx]));
        alert("Settings saved!");
        showAccount(users[idx]);
      }
    };
  }

  // --- SESSION LOAD HANDLING ---
  if (localStorage.getItem("loggedInUser")) {
    showAccount(JSON.parse(localStorage.getItem("kf_user_data")));
  }

  // --- LOGOUT LOGIC ---
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("kf_user_data");
      window.location.reload();
    };
  }
});