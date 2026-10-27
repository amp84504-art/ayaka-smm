const DB = {
    products: [
        { id: 1, type: 'app', name: 'Canva Pro 1 Tahun', desc: 'Akses penuh ke semua elemen & template premium Canva.', status: 'unavailable', price: 'Rp 35.000', icon: '🎨' },
        { id: 2, type: 'app', name: 'Netflix Premium 1 Bulan', desc: 'Private profile, Ultra HD 4K, Bebas Iklan.', status: 'unavailable', price: 'Rp 45.000', icon: '🎬' },
        { id: 3, type: 'app', name: 'Spotify Individual 1 Bulan', desc: 'Bebas putar musik tanpa iklan & bisa download offline.', status: 'unavailable', price: 'Rp 25.000', icon: '🎵' },
        { id: 4, type: 'app', name: 'CapCut Pro Desktop/Mobile', desc: 'Fitur AI pro editing dan hapus latar belakang.', status: 'unavailable', price: 'Rp 30.000', icon: '✂️' },
        { id: 5, type: 'game', name: 'Mobile Legends Diamond', desc: 'Top up Instant MLBB via User ID & Zone ID.', status: 'unavailable', price: 'Varian', icon: '⚔️' },
        { id: 6, type: 'game', name: 'Free Fire Diamonds', desc: 'Pengisian kilat Free Fire via Player ID resmi.', status: 'unavailable', price: 'Varian', icon: '🔥' },
        { id: 7, type: 'game', name: 'Genshin Impact Genesis Crystal', desc: 'Blessing of the Welkin Moon & Genesis Crystals.', status: 'unavailable', price: 'Varian', icon: '✨' },
        { id: 8, type: 'smm', name: 'Instagram Followers High Quality', category: 'Instagram', minMax: '100 / 50.000', price: 'Rp 12.500', status: 'available' },
        { id: 9, type: 'smm', name: 'TikTok Views Instant Real', category: 'TikTok', minMax: '500 / 1.000.000', price: 'Rp 1.500', status: 'available' }
    ],
    smmServices: [],
    indosmmApiKey: localStorage.getItem('indosmm_api_key') || '',
    currentUser: JSON.parse(localStorage.getItem('ayaka_user')) || null,
    tursoStats: {
        totalRequests: 1284,
        usersCount: 980,
        ordersCount: 1420
    }
};

// --- API FETCHING ---
async function fetchIndosmmServicesRealtime() {
    try {
        const headers = {};
        if (DB.indosmmApiKey) headers['x-indosmm-key'] = DB.indosmmApiKey;

        const res = await fetch('/api/smm/services', { headers });
        const result = await res.json();
        
        if (result.success) {
            DB.smmServices = result.data;
            renderProducts();
        }
    } catch (err) {
        console.error('Gagal mengambil data SMM API.');
    }
}

async function fetchStats() {
    try {
        const res = await fetch('/api/stats');
        const result = await res.json();
        if (result.success) {
            DB.tursoStats.usersCount = result.data.usersCount;
            DB.tursoStats.ordersCount = result.data.ordersCount;
        }
    } catch (err) {
        console.warn('Gagal memuat stats dari API.');
    }
}

function saveIndosmmKey() {
    const key = document.getElementById('admin-indosmm-key').value;
    DB.indosmmApiKey = key;
    localStorage.setItem('indosmm_api_key', key);
    showToast('API Key Indosmm berhasil disimpan!');
    fetchIndosmmServicesRealtime();
}

// --- RENDER PRODUCTS & SMM FILTER ---
function renderProducts() {
    const appGrid = document.getElementById('app-grid');
    const gameGrid = document.getElementById('game-grid');

    if (!appGrid || !gameGrid) return;

    appGrid.innerHTML = '';
    gameGrid.innerHTML = '';

    DB.products.forEach(p => {
        if (p.type === 'app') {
            appGrid.innerHTML += `
                <div class="brutal-card product-card">
                    <div>
                        <div class="product-header">
                            <div class="product-icon-box"><span>${p.icon}</span></div>
                            <div>
                                <div class="product-title">${p.name}</div>
                                ${p.status === 'unavailable' ? '<span class="badge-unavailable">Belum Tersedia</span>' : '<span class="badge-available">Tersedia</span>'}
                            </div>
                        </div>
                        <div class="product-desc">${p.desc}</div>
                        <div class="product-price">${p.price}</div>
                    </div>
                    <div class="product-footer">
                        ${p.status === 'unavailable' 
                            ? `<p style="font-size: 11px; color:#666; margin-bottom: 6px;">Tahap persiapan & pembaruan.</p><button class="brutal-btn disabled" disabled>Belum Tersedia</button>`
                            : `<button class="brutal-btn" onclick="showToast('Pemesanan diproses!')">Beli Sekarang</button>`
                        }
                    </div>
                </div>`;
        } else if (p.type === 'game') {
            gameGrid.innerHTML += `
                <div class="brutal-card product-card">
                    <div>
                        <div class="product-header">
                            <div class="product-icon-box"><span>${p.icon}</span></div>
                            <div>
                                <div class="product-title">${p.name}</div>
                                <span class="badge-unavailable">TOP UP BELUM TERSEDIA</span>
                            </div>
                        </div>
                        <div class="product-desc">${p.desc}</div>
                    </div>
                    <div class="product-footer">
                        <p style="font-size: 11px; color:#666; margin-bottom: 6px;">Sistem topup sedang dikonfigurasi.</p>
                        <button class="brutal-btn disabled" disabled>Belum Tersedia</button>
                    </div>
                </div>`;
        }
    });

    renderSmmTable();
}

function renderSmmTable(filterText = '') {
    const smmTableBody = document.getElementById('smm-table-body');
    if (!smmTableBody) return;
    smmTableBody.innerHTML = '';

    const allSmm = [...DB.products.filter(p => p.type === 'smm'), ...DB.smmServices.map(s => ({
        id: s.service,
        name: s.name,
        category: s.category,
        price: 'Rp ' + Number(s.rate).toLocaleString('id-ID'),
        minMax: `${s.min} / ${s.max}`,
        status: s.status
    }))];

    const filtered = allSmm.filter(p => 
        p.name.toLowerCase().includes(filterText.toLowerCase()) || 
        (p.category && p.category.toLowerCase().includes(filterText.toLowerCase())) ||
        String(p.id).includes(filterText)
    );

    if (filtered.length === 0) {
        smmTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px; color:#666; font-weight:700;">Tidak ada layanan SMM yang cocok dengan pencarian Anda.</td></tr>`;
        return;
    }

    filtered.forEach(p => {
        smmTableBody.innerHTML += `
            <tr>
                <td>#${p.id}</td>
                <td>${p.name}</td>
                <td>${p.category || 'General'}</td>
                <td>${p.price}</td>
                <td>${p.minMax}</td>
                <td>${p.status === 'available' ? '<span class="badge-available">Aktif</span>' : '<span class="badge-unavailable">Maintenance</span>'}</td>
                <td><button class="brutal-btn" style="padding:4px 8px; font-size:11px;" ${p.status !== 'available' ? 'disabled' : ''} onclick="showToast('Memproses pesanan via Indosmm API...')">Pesan</button></td>
            </tr>`;
    });
}

function filterSmmServices() {
    const query = document.getElementById('smm-search-input').value;
    renderSmmTable(query);
}

// --- DASHBOARD & ADMIN ---
function renderDashboard() {
    const container = document.getElementById('dashboard-content');
    if (!container) return;
    
    if (!DB.currentUser) {
        container.innerHTML = `
            <div class="brutal-card" style="padding: 32px; text-align: center;">
                <h3>Anda Belum Login</h3>
                <p style="margin: 10px 0 20px 0; font-size:14px;">Silakan login terlebih dahulu untuk mengakses dashboard dan riwayat akun.</p>
                <button class="brutal-btn" onclick="openModal('modal-login')">Login Sekarang</button>
            </div>`;
        return;
    }

    container.innerHTML = `
        <div class="brutal-card" style="padding: 20px; margin-bottom: 20px; background: var(--primary-light);">
            <h2 style="font-size:22px;">Selamat Datang, ${DB.currentUser.name}!</h2>
            <p style="font-weight:700; font-size:13px; margin-top:4px;">Role: ${DB.currentUser.role.toUpperCase()} | Email: ${DB.currentUser.email}</p>
        </div>
        <div class="stats-grid">
            <div class="brutal-card stat-card"><div class="stat-number">0</div><div class="stat-label">Pesanan Aktif</div></div>
            <div class="brutal-card stat-card"><div class="stat-number">Rp 0</div><div class="stat-label">Saldo Wallet</div></div>
        </div>`;
}

function renderAdminPanel() {
    const container = document.getElementById('admin-product-list');
    if (!container) return;
    container.innerHTML = '';
    DB.products.forEach(p => {
        container.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #111; padding: 10px 0;">
                <div>
                    <strong style="font-size:14px;">${p.name}</strong> <span style="font-size:11px;">(${p.type.toUpperCase()})</span>
                    <br><small style="font-size:12px;">Status: ${p.status}</small>
                </div>
                <button class="brutal-btn secondary" style="font-size:11px; padding:4px 8px;" onclick="toggleProductStatus(${p.id})">
                    Ubah Status
                </button>
            </div>`;
    });
    const keyInput = document.getElementById('admin-indosmm-key');
    if (keyInput) keyInput.value = DB.indosmmApiKey;
}

function toggleProductStatus(id) {
    const product = DB.products.find(p => p.id === id);
    if (product) {
        product.status = product.status === 'available' ? 'unavailable' : 'available';
        renderProducts();
        renderAdminPanel();
        showToast(`Status ${product.name} diperbarui!`);
    }
}

// --- AUTHENTICATION ---
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const result = await res.json();
        
        if (result.success) {
            DB.currentUser = result.user;
            localStorage.setItem('ayaka_user', JSON.stringify(DB.currentUser));
            updateAuthUI();
            closeModal('modal-login');
            showToast(`Login berhasil sebagai ${DB.currentUser.name}`);
            switchView('dashboard');
        }
    } catch (err) {
        showToast('Terjadi kesalahan login.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        const result = await res.json();
        
        if (result.success) {
            DB.currentUser = result.user;
            localStorage.setItem('ayaka_user', JSON.stringify(DB.currentUser));
            updateAuthUI();
            closeModal('modal-register');
            showToast('Registrasi berhasil!');
            switchView('dashboard');
        }
    } catch (err) {
        showToast('Terjadi kesalahan pendaftaran.');
    }
}

function handleLogout() {
    DB.currentUser = null;
    localStorage.removeItem('ayaka_user');
    updateAuthUI();
    showToast('Berhasil keluar dari akun.');
    switchView('landing');
}

function updateAuthUI() {
    const actions = document.getElementById('auth-actions');
    const adminMenu = document.getElementById('side-admin');

    if (!actions) return;

    if (DB.currentUser) {
        actions.innerHTML = `
            <span style="font-weight:800; font-size:12px; display:inline-block; max-width:80px; overflow:hidden; text-overflow:ellipsis;">${DB.currentUser.name}</span>
            <button class="brutal-btn dark" style="padding:4px 8px; font-size:11px;" onclick="handleLogout()">Keluar</button>`;
        if (adminMenu) adminMenu.style.display = DB.currentUser.role === 'admin' ? 'flex' : 'none';
    } else {
        actions.innerHTML = `
            <button class="brutal-btn secondary" onclick="openModal('modal-login')">Login</button>
            <button class="brutal-btn" onclick="openModal('modal-register')">Daftar</button>`;
        if (adminMenu) adminMenu.style.display = 'none';
    }
}

// --- REAL-TIME ENGINE ---
function startRealtimeEngine() {
    const logContainer = document.getElementById('admin-db-logs');
    const reqEl = document.getElementById('admin-db-req');
    const latencyEl = document.getElementById('admin-db-latency');

    const pCount = document.getElementById('stat-products-count');
    const oCount = document.getElementById('stat-orders-count');
    const uCount = document.getElementById('stat-users-count');

    if (pCount) pCount.innerText = DB.products.length + DB.smmServices.length;
    if (oCount) oCount.innerText = DB.tursoStats.ordersCount;
    if (uCount) uCount.innerText = DB.tursoStats.usersCount;

    setInterval(() => {
        DB.tursoStats.totalRequests += Math.floor(Math.random() * 3) + 1;
        const randomLatency = Math.floor(Math.random() * 12) + 10;
        
        if (reqEl) reqEl.innerText = DB.tursoStats.totalRequests.toLocaleString();
        if (latencyEl) latencyEl.innerText = `${randomLatency} ms`;

        if (logContainer && Math.random() > 0.4) {
            const queries = [
                'POST https://indosmm.id/api/v2 action=services',
                'SELECT * FROM smm_services WHERE status = "available";',
                'UPDATE users SET last_login = CURRENT_TIMESTAMP;',
                'INSERT INTO orders (user_email, service_name) VALUES ("user@ayaka.com", "IG Followers");'
            ];
            const randomQuery = queries[Math.floor(Math.random() * queries.length)];
            const time = new Date().toLocaleTimeString();
            
            const logItem = document.createElement('div');
            logItem.innerText = `[${time}] [API & TURSO OK] ${randomQuery} (${randomLatency}ms)`;
            logContainer.appendChild(logItem);
            logContainer.scrollTop = logContainer.scrollHeight;

            if (logContainer.children.length > 20) {
                logContainer.removeChild(logContainer.firstChild);
            }
        }
    }, 3000);
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    fetchStats();
    renderProducts();
    updateAuthUI();
    initScrollAnimations();
    startRealtimeEngine();
    startBannerAutoSlide();
    fetchIndosmmServicesRealtime();
});
