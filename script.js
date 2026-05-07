// --- STATE ---
let build = {
    case: { name: '-', price: 0, selected: false },
    switch: { name: '-', price: 0, selected: false },
    keycaps: { name: '-', price: 0, selected: false },
    mods: { name: 'None', price: 0, selected: false }
};

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

const sunIcon = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

// --- INITIAL LOAD & UI SYNC ---
function syncUI() {
    Object.keys(build).forEach(key => {
        const label = document.getElementById(`display-${key}`);
        if (label) {
            if (!build[key].selected) {
                label.innerText = (key === 'case') ? "Select a Case" : "None";
            } else {
                label.innerText = build[key].name;
            }
        }
    });

    const total = build.case.price + build.switch.price + build.keycaps.price + build.mods.price;
    const totalDisplay = document.getElementById('total-price');
    if (totalDisplay) totalDisplay.innerText = total;

    validateBuild();
}

function loadSavedBuild() {
    const saved = localStorage.getItem('kf_current_build');
    if (saved) {
        build = JSON.parse(saved);
        syncUI();
    }
}

// --- GLOBAL AUTH & NAV SYNC ---
function syncAuthStatus() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const accountLinks = document.querySelectorAll('#account-link');
    const orderLinks = document.querySelectorAll('.nav-links a');

    if (loggedInUser) {
        accountLinks.forEach(link => {
            link.textContent = "Account";
            link.href = "account.html";
        });

        orderLinks.forEach(link => {
            if (link.textContent.trim() === "Orders") {
                link.href = "account.html"; // Redirects to the orders section on profile
                link.style.opacity = "1";
                link.style.color = "var(--color-tertiary)";
            }
        });
    }
}

// --- THEME ---
function updateThemeUI() {
    if (!themeIcon) return;
    themeIcon.innerHTML = body.classList.contains('dark') ? sunIcon : moonIcon;
}

if (localStorage.getItem('theme') === 'dark') body.classList.add('dark');
updateThemeUI();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
        updateThemeUI();
    });
}

// --- BUILDER LOGIC ---
function validateBuild() {
    const checkoutBtn = document.getElementById('checkout-btn');
    const isComplete = build.case.selected && build.switch.selected && build.keycaps.selected;
    if (checkoutBtn) checkoutBtn.disabled = !isComplete;
}

function updateBuild(category, name, price) {
    build[category] = { name, price, selected: true };
    localStorage.setItem('kf_current_build', JSON.stringify(build));
    syncUI();

    const currentStep = document.querySelector(`[onclick*="'${category}'"]`).closest('.step');
    const nextStepNum = parseInt(currentStep.dataset.step) + 1;
    const nextStep = document.querySelector(`.step[data-step="${nextStepNum}"]`);
    if (nextStep) openStep(nextStep);
}

function openStep(stepElement) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    stepElement.classList.add('active');
}

document.querySelectorAll('.step-header').forEach(header => {
    header.addEventListener('click', () => openStep(header.closest('.step')));
});

// --- MODALS & ORDERS ---
function clearBuild() {
    document.getElementById('clear-overlay').style.display = 'flex';
}

function closeClearModal() {
    document.getElementById('clear-overlay').style.display = 'none';
}

function confirmClear() {
    localStorage.removeItem('kf_current_build');
    window.location.reload();
}

function showCheckout() {
    document.getElementById('sum-case').innerText = build.case.name;
    document.getElementById('sum-switch').innerText = build.switch.name;
    document.getElementById('sum-keycaps').innerText = build.keycaps.name;
    document.getElementById('sum-mods').innerText = build.mods.name;
    document.getElementById('final-price').innerText = document.getElementById('total-price').innerText;
    document.getElementById('checkout-overlay').style.display = 'flex';
}

function closeCheckout() {
    document.getElementById('checkout-overlay').style.display = 'none';
}

function placeOrder() {
    // Save build to Order History
    const orders = JSON.parse(localStorage.getItem('kf_user_orders') || "[]");
    orders.push({
        ...build,
        date: new Date().toLocaleDateString(),
        id: Math.floor(Math.random() * 90000) + 10000
    });
    localStorage.setItem('kf_user_orders', JSON.stringify(orders));

    closeCheckout();
    document.getElementById('success-overlay').style.display = 'flex';
}

function finalizeOrder() {
    localStorage.removeItem('kf_current_build');
    window.location.href = "index.html"; 
}

// RUN
document.addEventListener('DOMContentLoaded', () => {
    loadSavedBuild();
    syncAuthStatus();
});