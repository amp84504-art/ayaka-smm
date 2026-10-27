// --- INTERSECTION OBSERVER ANIMASI SCROLL ---
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

// --- CORE NAVIGATION ---
function switchView(viewName) {
    document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.style.display = 'block';

    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.bottom-nav-item').forEach(el => el.classList.remove('active'));
    
    const navEl = document.getElementById(`nav-${viewName}`);
    if (navEl) navEl.classList.add('active');

    const sideEl = document.getElementById(`side-${viewName}`);
    if (sideEl) sideEl.classList.add('active');

    const bnavEl = document.getElementById(`bnav-${viewName}`);
    if (bnavEl) bnavEl.classList.add('active');

    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.classList.remove('active');

    if (viewName === 'dashboard') renderDashboard();
    if (viewName === 'admin') renderAdminPanel();

    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 50);
}

function toggleSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    sidebar.classList.toggle('active');
}

function toggleFaq(element) {
    element.classList.toggle('active');
}

// --- MODALS & TOASTS ---
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
