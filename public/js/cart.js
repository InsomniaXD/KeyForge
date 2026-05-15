document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cart-items-container");
  const grandTotalEl = document.getElementById("cart-grand-total-amount");
  const emptyMsg = document.getElementById("empty-cart-msg");
  const addressForm = document.getElementById("address-form");
  const addressDisplay = document.getElementById("address-display");
  const editBtn = document.getElementById("edit-address-btn");

  // --- 1. LOAD CART ---
  let cart = JSON.parse(localStorage.getItem("kf_cart") || "[]");

  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.style.display = "block";
    grandTotalEl.innerText = "£0.00";
  } else {
    if (emptyMsg) emptyMsg.style.display = "none";
    let grandTotal = 0;

    container.innerHTML = cart
      .map((build, index) => {
        grandTotal += build.totalPrice;
        return `
                <div class="cart-build-item" style="background: rgba(128, 128, 128, 0.05); border: 1px solid rgba(128, 128, 128, 0.1); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
                    <div class="build-header" style="display: flex; justify-content: space-between; font-weight: 900; border-bottom: 1px solid rgba(128, 128, 128, 0.1); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                        <span>Build #${index + 1}</span>
                        <button class="remove-btn" onclick="removeFromCart('${build.id}')" style="color: var(--color-accent); border: none; background: none; cursor: pointer; font-weight: 700;">Remove</button>
                    </div>
                    <div class="part-line" style="display: flex; justify-content: space-between; padding: 0.2rem 0;"><span>Kit: ${build.case.name}</span><span>£${build.case.price.toFixed(2)}</span></div>
                    <div class="part-line" style="display: flex; justify-content: space-between; padding: 0.2rem 0;"><span>Switch: ${build.switch.name}</span><span>£${build.switch.price.toFixed(2)}</span></div>
                    <div class="part-line" style="display: flex; justify-content: space-between; padding: 0.2rem 0;"><span>Keycaps: ${build.keycaps.name}</span><span>£${build.keycaps.price.toFixed(2)}</span></div>
                    <div class="build-subtotal" style="text-align: right; margin-top: 1rem; padding-top: 0.5rem; border-top: 1px dashed rgba(128, 128, 128, 0.2); font-weight: 900; color: var(--color-tertiary);">Build Total: £${build.totalPrice.toFixed(2)}</div>
                </div>`;
      })
      .join("");

    grandTotalEl.innerText = `£${grandTotal.toFixed(2)}`;
  }

  // --- 2. ADDRESS PERSISTENCE ---
  const loadAddress = () => {
    const saved = JSON.parse(localStorage.getItem("kf_shipping_address"));
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
    localStorage.setItem("kf_shipping_address", JSON.stringify(addressData));
    loadAddress();
    addressForm.style.display = "none";
    addressDisplay.style.display = "block";
    editBtn.innerText = "Edit";
  });
});

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("kf_cart") || "[]");
  localStorage.setItem(
    "kf_cart",
    JSON.stringify(cart.filter((item) => item.id !== id)),
  );
  window.location.reload();
}
