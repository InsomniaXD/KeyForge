document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section");
  const signupSection = document.getElementById("signup-section");
  const accountSection = document.getElementById("account-section");
  const authAlert = document.getElementById("auth-alert");

  // Parse URL params for auth guards
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("msg") === "login_required" && authAlert) {
    authAlert.style.display = "block";
  }

  // --- UI TOGGLE SWITCHES ---
  document.getElementById("show-signup").onclick = (e) => {
    e.preventDefault();
    loginSection.style.display = "none";
    signupSection.style.display = "block";
  };

  document.getElementById("show-login").onclick = (e) => {
    e.preventDefault();
    signupSection.style.display = "none";
    loginSection.style.display = "block";
  };

  document.getElementById("tab-history-btn").onclick = () =>
    switchTab("history");
  document.getElementById("tab-settings-btn").onclick = () =>
    switchTab("settings");

  function switchTab(tab) {
    document.getElementById("tab-history").style.display =
      tab === "history" ? "block" : "none";
    document.getElementById("tab-settings").style.display =
      tab === "settings" ? "block" : "none";
    document
      .getElementById("tab-history-btn")
      .classList.toggle("active", tab === "history");
    document
      .getElementById("tab-settings-btn")
      .classList.toggle("active", tab === "settings");
  }

  // --- SIGNUP LOGIC ---
  document.getElementById("signup-btn").onclick = async () => {
    const firstName = document.getElementById("signup-firstname").value.trim();
    const lastName = document.getElementById("signup-lastname").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    if (!firstName || !lastName || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      if (res.status === 409) return alert("Email already in use.");
      if (!res.ok) throw new Error();
      loginUser(await res.json());
    } catch {
      let users = JSON.parse(localStorage.getItem("kf_users") || "[]");
      if (users.find((u) => u.email === email))
        return alert("Email already in use.");

      const newUser = { firstName, lastName, email, password };
      users.push(newUser);
      localStorage.setItem("kf_users", JSON.stringify(users));
      loginUser(newUser);
    }
  };

  // --- LOGIN LOGIC ---
  document.getElementById("login-btn").onclick = async () => {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) return alert("Please fill in all fields.");

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 401) return alert("Invalid email or password.");
      if (!res.ok) throw new Error();
      loginUser(await res.json());
    } catch {
      const users = JSON.parse(localStorage.getItem("kf_users") || "[]");
      const user = users.find(
        (u) => u.email === email && u.password === password,
      );
      if (!user) return alert("Invalid email or password.");
      loginUser(user);
    }
  };

  // --- SHARED ---
  function loginUser(user) {
    localStorage.setItem("loggedInUser", user.email);
    localStorage.setItem("kf_user_data", JSON.stringify(user));

    const redirectTarget = urlParams.get("redirect");
    if (redirectTarget === "builder") window.location.href = "builder.html";
    else if (redirectTarget === "cart") window.location.href = "cart.html";
    else showAccount(user);
  }

  function showAccount(user) {
    if (authAlert) authAlert.style.display = "none";
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

  // --- ORDERS RENDERING ---
  async function renderOrders() {
    const list = document.getElementById("orders-list");
    if (!list) return;
    const email = localStorage.getItem("loggedInUser");
    let myOrders = [];

    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error();
      myOrders = await res.json();
    } catch {
      const allOrders = JSON.parse(localStorage.getItem("kf_orders") || "[]");
      myOrders = allOrders.filter((o) => o.userEmail === email);
    }

    if (!myOrders || !myOrders.length) {
      list.innerHTML = `<p style="opacity:0.5; text-align: center; margin-top: 1rem;">No builds ordered yet.</p>`;
      return;
    }

    try {
      list.innerHTML = [...myOrders]
        .reverse()
        .map((o) => {
          const formattedId = String(o.displayId || o.id || "1").padStart(
            7,
            "0",
          );

          // Safe data normalization layers
          let orderItems = o.items || o.builds || o.products;

          if (!orderItems || !Array.isArray(orderItems)) {
            if (o.case || o.switch || o.keycaps) {
              orderItems = [
                {
                  case: o.case,
                  switch: o.switch,
                  keycaps: o.keycaps,
                  mods: o.mods || [],
                  totalPrice: o.totalPrice || o.price || 0,
                },
              ];
            } else {
              orderItems = [];
            }
          }

          // Safety mapping for addresses
          let shippingHtml = "";
          const addr = o.shippingAddress || o.shipping;
          if (addr && addr.address) {
            shippingHtml = `
              <div style="margin-top: 0.5rem; margin-bottom: 1rem; font-size: 0.85rem; opacity: 0.8; line-height: 1.4;">
                 <strong style="color: var(--color-tertiary);">Shipping Address:</strong><br>
                 ${addr.address}<br>
                 ${addr.city || ""}, ${addr.postal || ""}
              </div>`;
          } else {
            shippingHtml = `<div style="margin-top: 0.5rem; margin-bottom: 1rem; font-size: 0.85rem; opacity: 0.5; font-style: italic;">No shipping address recorded.</div>`;
          }

          const itemsHtml = orderItems
            .map((item, idx) => {
              if (!item) return "";
              const modsList = item.mods || [];
              const modsHtml =
                modsList.length > 0
                  ? modsList
                      .map((m) => (typeof m === "string" ? m : m.name || ""))
                      .filter(Boolean)
                      .join(", ")
                  : "None";

              const caseName = item.case?.name || "Custom Kit";
              const switchName = item.switch?.name || "Custom Switches";
              const keycapName = item.keycaps?.name || "Custom Keycaps";

              let displayPrice = "Included";
              if (item.totalPrice !== undefined)
                displayPrice = `£${Number(item.totalPrice).toFixed(2)}`;
              else if (item.price !== undefined)
                displayPrice = `£${Number(item.price).toFixed(2)}`;

              return `
              <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed rgba(128,128,128,0.1);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                    <strong>Build ${idx + 1}: ${caseName}</strong>
                    <span style="font-weight: 700; color: var(--color-tertiary);">${displayPrice}</span>
                  </div>
                  <p style="font-size:0.85rem; opacity:0.7; margin-bottom: 0.2rem;">Switch: ${switchName}</p>
                  <p style="font-size:0.85rem; opacity:0.7; margin-bottom: 0.2rem;">Keycaps: ${keycapName}</p>
                  <p style="font-size:0.85rem; opacity:0.9; color: var(--color-tertiary);">Mods: ${modsHtml}</p>
              </div>
            `;
            })
            .join("");

          return `
              <div class="order-card" style="margin-bottom: 1.5rem; background: rgba(128,128,128,0.05); padding: 1.5rem; border-radius: 8px; border: 1px solid rgba(128,128,128,0.1);">
                  <div class="order-meta" style="display:flex; justify-content:space-between; margin-bottom: 0.5rem; border-bottom: 1px solid rgba(128,128,128,0.1); padding-bottom: 0.5rem;">
                      <span style="font-weight: 900; color: var(--color-tertiary);">Order #${formattedId}</span>
                      <span style="opacity: 0.6; font-size: 0.85rem;">${o.date || "Just now"} &bull; ${o.paymentMethod || "Card"}</span>
                  </div>
                  
                  ${shippingHtml}
                  ${itemsHtml}

                  <div style="margin-top:1.5rem; padding-top:1rem; border-top: 1px solid rgba(128,128,128,0.2); display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.9rem; opacity: 0.7;">${orderItems.length} Items</span>
                    <span style="font-weight:900; font-size: 1.2rem; color: var(--color-tertiary);">Grand Total: £${Number(o.totalPrice || 0).toFixed(2)}</span>
                  </div>
              </div>
          `;
        })
        .join("");
    } catch (e) {
      console.error(e);
      list.innerHTML = `<p style="opacity:0.5; color: var(--color-accent);">Error loading layout components.</p>`;
    }
  }

  // --- EDIT PROFILE ---
  document.getElementById("save-profile-btn").onclick = async () => {
    const email = localStorage.getItem("loggedInUser");
    const firstName = document.getElementById("edit-firstname").value.trim();
    const lastName = document.getElementById("edit-lastname").value.trim();

    if (!firstName || !lastName) return alert("Name fields cannot be empty.");

    try {
      await fetch("/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName }),
      });
    } catch {
      let users = JSON.parse(localStorage.getItem("kf_users") || "[]");
      const idx = users.findIndex((u) => u.email === email);
      if (idx !== -1) {
        users[idx].firstName = firstName;
        users[idx].lastName = lastName;
        localStorage.setItem("kf_users", JSON.stringify(users));
      }
    }
    const user = {
      ...JSON.parse(localStorage.getItem("kf_user_data")),
      firstName,
      lastName,
    };
    localStorage.setItem("kf_user_data", JSON.stringify(user));
    alert("Settings saved!");
    showAccount(user);
  };

  // --- LOGOUT LOGIC ---
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("kf_user_data");
      window.location.href = "index.html";
    };
  }

  // --- AUTO-LOGIN ---
  if (localStorage.getItem("loggedInUser")) {
    showAccount(JSON.parse(localStorage.getItem("kf_user_data")));
  }
});
