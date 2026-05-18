/* ============================================================
   APEX MINING - Shared JavaScript (script.js)
   Authentication, Market Data, Modals, Protected Pages, etc.
   ============================================================ */

/* ── AUTH STATE ── */
const AUTH_KEY = 'apex_auth';
const USER_KEY = 'apex_user';

function getAuth() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)); }
    catch (e) { return null; }
}

function setAuth(data) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
}

function getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); }
    catch (e) { return null; }
}

function setUser(data) {
    localStorage.setItem(USER_KEY, JSON.stringify(data));
}

function isLoggedIn() {
    const auth = getAuth();
    return !!(auth && auth.loggedIn && auth.email);
}

function getUserName() {
    const user = getUser();
    return user ? user.fullName : null;
}

/* ── MODAL SYSTEM ── */
function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => {
        m.classList.add('hidden');
        m.classList.remove('flex');
    });
    document.body.style.overflow = '';
}

/* ── TOAST NOTIFICATIONS ── */
function showToast(message, type = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed top-24 right-6 z-[9999] flex flex-col gap-2';
        document.body.appendChild(toastContainer);
    }
    const toast = document.createElement('div');
    const colors = type === 'error' ? 'bg-red-600' : type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500';
    const icon = type === 'error' ? 'fa-circle-xmark' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-check';
    toast.className = `${colors} text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 min-w-[280px] transform translate-x-full transition-all duration-300`;
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span class="font-medium">${message}</span>`;
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full');
    });
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* ── COPY TO CLIPBOARD ── */
function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`${label} copied to clipboard!`);
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(`${label} copied to clipboard!`);
    });
}

/* ── AUTH FORM HANDLERS ── */
function initAuthForms() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullName = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const phone = document.getElementById('signup-phone').value.trim();
            const country = document.getElementById('signup-country').value;
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;

            if (!fullName || !email || !phone || !country || !password || !confirm) {
                showToast('Please fill in all fields.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }
            if (password.length < 6) {
                showToast('Password must be at least 6 characters.', 'error');
                return;
            }
            if (password !== confirm) {
                showToast('Passwords do not match.', 'error');
                return;
            }

            setUser({ fullName, email, phone, country });
            setAuth({ loggedIn: true, email, fullName });
            closeAllModals();
            updateAuthUI();
            showToast(`Welcome, ${fullName}! Account created successfully.`);
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            if (!email || !password) {
                showToast('Please enter email and password.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            const user = getUser();
            if (user && user.email === email) {
                setAuth({ loggedIn: true, email, fullName: user.fullName });
            } else {
                setUser({ fullName: email.split('@')[0], email, phone: '', country: 'US' });
                setAuth({ loggedIn: true, email, fullName: email.split('@')[0] });
            }

            closeAllModals();
            updateAuthUI();
            showToast('Login successful! Welcome back.');
        });
    }

    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    if (showSignup) {
        showSignup.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('login-modal');
            openModal('signup-modal');
        });
    }
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('signup-modal');
            openModal('login-modal');
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clearAuth();
            updateAuthUI();
            showToast('You have been logged out.');
            const protectedPages = ['mining.html', 'dashboard.html', 'withdrawal'];
            const current = window.location.pathname.split('/').pop();
            if (protectedPages.includes(current)) {
                window.location.href = './index.html';
            }
        });
    }
}

/* ── UPDATE AUTH UI ACROSS PAGES ── */
function updateAuthUI() {
    const loggedIn = isLoggedIn();
    const userName = getUserName();

    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    if (authButtons && userMenu) {
        if (loggedIn) {
            authButtons.classList.add('hidden');
            userMenu.classList.remove('hidden');
            const nameEl = document.getElementById('user-name-display');
            if (nameEl) nameEl.textContent = userName || 'User';
        } else {
            authButtons.classList.remove('hidden');
            userMenu.classList.add('hidden');
        }
    }

    const miningProfileName = document.getElementById('mining-profile-name');
    if (miningProfileName) {
        miningProfileName.textContent = loggedIn && userName ? `Welcome back, ${userName}` : 'Welcome back, Guest';
    }

    const dashboardWelcome = document.getElementById('dashboard-welcome');
    if (dashboardWelcome) {
        dashboardWelcome.textContent = loggedIn && userName ? `Welcome, ${userName}` : 'Welcome, Guest';
    }
}

/* ── PROTECTED PAGE CHECK ── */
function checkProtectedPage() {
    const protectedPages = ['mining.html', 'dashboard.html'];
    const current = window.location.pathname.split('/').pop();
    if (protectedPages.includes(current) && !isLoggedIn()) {
        const modal = document.getElementById('login-modal');
        const msg = document.getElementById('login-required-msg');
        if (msg) msg.classList.remove('hidden');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
        const mainContent = document.querySelector('main');
        if (mainContent) mainContent.style.display = 'none';
    }
}

/* ── COINGECKO MARKET DATA ── */
const COINS = ['bitcoin', 'ethereum', 'tether', 'solana', 'litecoin', 'cardano', 'polkadot', 'chainlink', 'matic-network', 'avalanche-2'];
const COIN_SYMBOLS = { 'bitcoin': 'BTC', 'ethereum': 'ETH', 'tether': 'USDT', 'solana': 'SOL', 'litecoin': 'LTC', 'cardano': 'ADA', 'polkadot': 'DOT', 'chainlink': 'LINK', 'matic-network': 'MATIC', 'avalanche-2': 'AVAX' };

let marketData = [];

async function fetchMarketData() {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.join(',')}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
        );
        if (!response.ok) throw new Error('API Error');
        marketData = await response.json();
        updateMarketUI();
        return marketData;
    } catch (err) {
        console.error('Market data fetch failed:', err);
        marketData = getFallbackMarketData();
        updateMarketUI();
        return marketData;
    }
}

function getFallbackMarketData() {
    return [
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 104320, price_change_percentage_24h: 2.34, market_cap: 2065000000000, total_volume: 42000000000 },
        { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 2580, price_change_percentage_24h: -1.12, market_cap: 310000000000, total_volume: 18000000000 },
        { id: 'tether', symbol: 'usdt', name: 'Tether', current_price: 1.00, price_change_percentage_24h: 0.01, market_cap: 142000000000, total_volume: 65000000000 },
        { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 168.50, price_change_percentage_24h: 5.67, market_cap: 82000000000, total_volume: 5200000000 },
        { id: 'litecoin', symbol: 'ltc', name: 'Litecoin', current_price: 92.40, price_change_percentage_24h: 0.85, market_cap: 6900000000, total_volume: 420000000 },
        { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.72, price_change_percentage_24h: -2.15, market_cap: 25500000000, total_volume: 890000000 },
        { id: 'polkadot', symbol: 'dot', name: 'Polkadot', current_price: 4.85, price_change_percentage_24h: 1.23, market_cap: 7200000000, total_volume: 310000000 },
        { id: 'chainlink', symbol: 'link', name: 'Chainlink', current_price: 15.20, price_change_percentage_24h: 3.45, market_cap: 9500000000, total_volume: 580000000 },
        { id: 'matic-network', symbol: 'matic', name: 'Polygon', current_price: 0.42, price_change_percentage_24h: -0.78, market_cap: 4200000000, total_volume: 250000000 },
        { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', current_price: 26.80, price_change_percentage_24h: 4.12, market_cap: 11200000000, total_volume: 720000000 }
    ];
}

function updateMarketUI() {
    updateHeaderTicker();
    updateMarketsTable();
    updateMarketCards();
}

function updateHeaderTicker() {
    const ticker = document.getElementById('header-ticker');
    if (!ticker || !marketData.length) return;
    const items = marketData.slice(0, 5).map(c => {
        const change = c.price_change_percentage_24h || 0;
        const color = change >= 0 ? 'text-emerald-400' : 'text-red-400';
        const arrow = change >= 0 ? '▲' : '▼';
        return `<span class="whitespace-nowrap">${c.symbol.toUpperCase()} $${formatPrice(c.current_price)} <span class="${color}">${arrow} ${Math.abs(change).toFixed(2)}%</span></span>`;
    }).join(' <span class="text-slate-600 mx-2">|</span> ');
    ticker.innerHTML = items;
}

function updateMarketsTable() {
    const tbody = document.getElementById('markets-table-body');
    if (!tbody || !marketData.length) return;
    tbody.innerHTML = marketData.map((coin, i) => {
        const change = coin.price_change_percentage_24h || 0;
        const color = change >= 0 ? 'text-emerald-400' : 'text-red-400';
        const arrow = change >= 0 ? '▲' : '▼';
        const vol = formatLargeNumber(coin.total_volume);
        const mcap = formatLargeNumber(coin.market_cap);
        return `
        <tr class="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
            <td class="py-4 px-4 text-slate-400">${i + 1}</td>
            <td class="py-4 px-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">${coin.symbol.toUpperCase()[0]}</div>
                    <div>
                        <div class="font-semibold text-white">${coin.name}</div>
                        <div class="text-xs text-slate-500">${coin.symbol.toUpperCase()}</div>
                    </div>
                </div>
            </td>
            <td class="py-4 px-4 text-white font-mono">$${formatPrice(coin.current_price)}</td>
            <td class="py-4 px-4 ${color} font-mono">${arrow} ${Math.abs(change).toFixed(2)}%</td>
            <td class="py-4 px-4 text-slate-300 font-mono">$${vol}</td>
            <td class="py-4 px-4 text-slate-300 font-mono">$${mcap}</td>
            <td class="py-4 px-4">
                <button class="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors border border-cyan-500/20">Trade</button>
            </td>
        </tr>`;
    }).join('');
}

function updateMarketCards() {
    const cards = document.querySelectorAll('[data-coin-id]');
    cards.forEach(card => {
        const coinId = card.getAttribute('data-coin-id');
        const coin = marketData.find(c => c.id === coinId);
        if (!coin) return;
        const priceEl = card.querySelector('.coin-price');
        const changeEl = card.querySelector('.coin-change');
        if (priceEl) priceEl.textContent = '$' + formatPrice(coin.current_price);
        if (changeEl) {
            const change = coin.price_change_percentage_24h || 0;
            changeEl.textContent = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
            changeEl.className = 'coin-change text-sm font-mono ' + (change >= 0 ? 'text-emerald-400' : 'text-red-400');
        }
    });
}

function formatPrice(price) {
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

function formatLargeNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toLocaleString();
}

/* ── WITHDRAWAL FLOW ── */
function initWithdrawalFlow() {
    const withdrawForm = document.getElementById('withdrawal-form');
    if (!withdrawForm) return;

    const methodSelect = document.getElementById('withdraw-method');
    const bankFields = document.getElementById('bank-fields');
    const cashappFields = document.getElementById('cashapp-fields');
    const cryptoFields = document.getElementById('crypto-fields');

    if (methodSelect) {
        methodSelect.addEventListener('change', function() {
            if (bankFields) bankFields.classList.add('hidden');
            if (cashappFields) cashappFields.classList.add('hidden');
            if (cryptoFields) cryptoFields.classList.add('hidden');

            if (this.value === 'bank' && bankFields) bankFields.classList.remove('hidden');
            if (this.value === 'cashapp' && cashappFields) cashappFields.classList.remove('hidden');
            if (this.value === 'crypto' && cryptoFields) cryptoFields.classList.remove('hidden');
        });
    }

    withdrawForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const amount = document.getElementById('withdraw-amount').value;
        const method = document.getElementById('withdraw-method').value;
        if (!amount || amount <= 0) {
            showToast('Please enter a valid amount.', 'error');
            return;
        }
        if (!method) {
            showToast('Please select a withdrawal method.', 'error');
            return;
        }
        const modal = document.getElementById('withdrawal-verification-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
    });

    const fundBtn = document.getElementById('fund-compliance-btn');
    if (fundBtn) {
        fundBtn.addEventListener('click', function() {
            window.location.href = './payment.html';
        });
    }

    const closeVerif = document.getElementById('close-verification-modal');
    if (closeVerif) {
        closeVerif.addEventListener('click', function() {
            const modal = document.getElementById('withdrawal-verification-modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = '';
            }
        });
    }
}

/* ── PAYMENT PAGE ── */
function initPaymentPage() {
    const options = document.querySelectorAll('.payment-option');
    const detailSection = document.getElementById('payment-detail');

    const walletData = {
        btc: { name: 'Bitcoin (BTC)', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', instructions: 'Send exactly $800 worth of BTC to the address above. Include your email in the transaction memo. Network: Bitcoin Mainnet.' },
        usdt: { name: 'Tether (USDT)', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', instructions: 'Send exactly $800 worth of USDT to the address above. Network: Ethereum (ERC-20). Do NOT send on other networks.' },
        eth: { name: 'Ethereum (ETH)', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', instructions: 'Send exactly $800 worth of ETH to the address above. Network: Ethereum Mainnet. Include your email in the transaction data.' },
        ltc: { name: 'Litecoin (LTC)', address: 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', instructions: 'Send exactly $800 worth of LTC to the address above. Network: Litecoin Mainnet. Confirm the address before sending.' }
    };

    options.forEach(opt => {
        opt.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const data = walletData[type];
            if (!data || !detailSection) return;

            options.forEach(o => o.classList.remove('ring-2', 'ring-cyan-400', 'bg-slate-700'));
            this.classList.add('ring-2', 'ring-cyan-400', 'bg-slate-700');

            detailSection.classList.remove('hidden');
            detailSection.innerHTML = `
                <div class="bg-slate-800/80 border border-slate-700 rounded-xl p-6 animate-fade-in">
                    <h3 class="text-xl font-bold text-white mb-2">${data.name}</h3>
                    <p class="text-slate-400 mb-4 text-sm">${data.instructions}</p>
                    <div class="bg-slate-900 rounded-lg p-4 mb-4 border border-slate-700">
                        <div class="text-xs text-slate-500 mb-1 uppercase tracking-wider">Wallet Address</div>
                        <div class="flex items-center gap-3">
                            <code class="text-cyan-400 font-mono text-sm break-all flex-1">${data.address}</code>
                            <button onclick="copyToClipboard('${data.address}', '${data.name} Address')" class="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/20 transition-colors border border-cyan-500/20 whitespace-nowrap">
                                <i class="fa-regular fa-copy mr-1"></i> Copy
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 text-amber-400 text-sm">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span>Amount Required: <strong>$800.00</strong> — Send the exact amount to avoid delays.</span>
                    </div>
                </div>
            `;
        });
    });
}

/* ── MOBILE MENU ── */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function() {
        menu.classList.toggle('hidden');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => menu.classList.add('hidden'));
    });
}

/* ── DASHBOARD CHART ── */
function initDashboardChart() {
    const chartContainer = document.getElementById('dashboard-chart');
    if (!chartContainer) return;
    const data = [
        { label: 'BTC', value: 45, color: 'bg-amber-500' },
        { label: 'ETH', value: 25, color: 'bg-cyan-500' },
        { label: 'SOL', value: 15, color: 'bg-purple-500' },
        { label: 'USDT', value: 10, color: 'bg-emerald-500' },
        { label: 'Other', value: 5, color: 'bg-slate-500' }
    ];
    chartContainer.innerHTML = data.map(d => `
        <div class="flex flex-col items-center gap-2 flex-1">
            <div class="w-full bg-slate-800 rounded-t-lg relative overflow-hidden" style="height: 120px;">
                <div class="absolute bottom-0 w-full ${d.color} rounded-t-lg transition-all duration-1000" style="height: 0%; animation: growBar 1s ease-out forwards; animation-delay: ${Math.random() * 0.5}s;"></div>
            </div>
            <span class="text-xs text-slate-400">${d.label}</span>
            <span class="text-xs font-bold text-white">${d.value}%</span>
        </div>
    `).join('');
}

/* ── INITIALIZATION ── */
document.addEventListener('DOMContentLoaded', function() {
    initAuthForms();
    updateAuthUI();
    checkProtectedPage();
    initMobileMenu();
    initWithdrawalFlow();
    initPaymentPage();
    initDashboardChart();

    fetchMarketData();
    setInterval(fetchMarketData, 60000);

    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeAllModals();
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllModals();
    });
});

/* ── ANIMATION KEYFRAMES ── */
const style = document.createElement('style');
style.textContent = `
    @keyframes growBar {
        from { height: 0%; }
        to { height: 100%; }
    }
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
