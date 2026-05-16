document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cart-items-container");
  const grandTotalEl = document.getElementById("cart-grand-total-amount");
  const emptyMsg = document.getElementById("empty-cart-msg");
  const addressForm = document.getElementById("address-form");
  const addressDisplay = document.getElementById("address-display");
  const editBtn = document.getElementById("edit-address-btn");

  const userEmail = localStorage.getItem("loggedInUser");
  if (!userEmail) return;

  const CART_KEY = `kf_cart_${userEmail}`;
  const ADDRESS_KEY = `kf_shipping_address_${userEmail}`;

  let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.style.display = "block";
    grandTotalEl.innerText = "£0.00";
  } else {
    if (emptyMsg) emptyMsg.style.display = "none";
    let grandTotal = 0;

    container.innerHTML = cart
      .map((build, index) => {
        grandTotal += build.totalPrice;

        const modsHtml =
          build.mods && build.mods.length > 0
            ? build.mods
                .map(
                  (mod) =>
                    `<div class="part-line" style="display: flex; justify-content: space-between; padding: 0.2rem 0; color: var(--color-tertiary);"><span>Mod: ${mod.name}</span><span>£${mod.price.toFixed(2)}</span></div>`,
                )
                .join("")
            : `<div class="part-line" style="display: flex; justify-content: space-between; padding: 0.2rem 0; opacity: 0.5;"><span>Mods:</span><span>None</span></div>`;

        return `
            <div class="cart-build-item" style="background: rgba(128, 128, 128, 0.05); border: 1px solid rgba(128, 128, 128, 0.1); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
                <div class="build-header" style="display: flex; justify-content: space-between; font-weight: 900; border-bottom: 1px solid rgba(128, 128, 128, 0.1); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                    <span>Build #${index + 1}</span>
                    <button class="remove-btn" onclick="removeFromCart('${build.id}')" style="color: var(--color-accent); border: none; background: none; cursor: pointer; font-weight: 700;">Remove</button>
                </div>
                <div class="part-line" style="display: flex; justify-content: space-between; padding: 0.2rem 0;"><span>Kit: ${build.case.name}</span><span>£${build.case.price.toFixed(2)}</span></div>
                <div class="part-line" style="display: flex; justify-content: space-between; padding: 0.2rem 0;"><span>Switch: ${build.switch.name}</span><span>£${build.switch.price.toFixed(2)}</span></div>
                <div class="part-line" style="display: flex; justify-content: space-between; padding: 0.2rem 0;"><span>Keycaps: ${build.keycaps.name}</span><span>£${build.keycaps.price.toFixed(2)}</span></div>
                ${modsHtml}
                <div class="build-subtotal" style="text-align: right; margin-top: 1rem; padding-top: 0.5rem; border-top: 1px dashed rgba(128, 128, 128, 0.2); font-weight: 900; color: var(--color-tertiary);">Build Total: £${build.totalPrice.toFixed(2)}</div>
            </div>`;
      })
      .join("");

    grandTotalEl.innerText = `£${grandTotal.toFixed(2)}`;
  }

  const loadAddress = () => {
    const saved = JSON.parse(localStorage.getItem(ADDRESS_KEY));
    if (saved) {
      document.getElementById("display-street").innerText = saved.address;
      document.getElementById("display-city-zip").innerText =
        `${saved.city}, ${saved.postal}`;
      document.getElementById("input-address").value = saved.address;
      document.getElementById("input-city").value = saved.city;
      document.getElementById("input-postal").value = saved.postal;
    }
  };
  loadAddress();

  editBtn.addEventListener("click", () => {
    const isEditing = addressForm.style.display === "grid";
    addressForm.style.display = isEditing ? "none" : "grid";
    addressDisplay.style.display = isEditing ? "block" : "none";
    editBtn.innerText = isEditing ? "Edit" : "Cancel";
  });

  addressForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const addressData = {
      address: document.getElementById("input-address").value,
      city: document.getElementById("input-city").value,
      postal: document.getElementById("input-postal").value,
    };
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(addressData));
    loadAddress();
    addressForm.style.display = "none";
    addressDisplay.style.display = "block";
    editBtn.innerText = "Edit";
  });

  // --- CHECKOUT & PAYMENT FLOW ---
  document.querySelectorAll(".pay-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      // Do nothing if the cart is empty
      if (cart.length === 0) return;

      const shippingAddress = JSON.parse(localStorage.getItem(ADDRESS_KEY));
      const paymentMethod = e.target.textContent.trim();

      // PLACEHOLDERS: These variables are where you will insert the actual payment gateway links later.
      // E.g. let checkoutUrl = 'https://checkout.stripe.com/pay/...';
      let checkoutUrl = "account.html";

      try {
        // 1. Process the checkout behind the scenes
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail,
            items: cart,
            shipping: shippingAddress,
            paymentMethod,
          }),
        });

        if (!response.ok) throw new Error("Server error during checkout");

        // 2. Clear the cart
        localStorage.removeItem(CART_KEY);

        // 3. Redirect the user (Simulates opening external payment UI, currently goes to Orders)
        window.location.href = checkoutUrl;
      } catch (err) {
        console.error("Checkout failed:", err);
      }
    });
  });
});

function removeFromCart(id) {
  const userEmail = localStorage.getItem("loggedInUser");
  if (!userEmail) return;
  const CART_KEY = `kf_cart_${userEmail}`;

  let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart.filter((item) => item.id !== id)),
  );
  window.location.reload();
}
