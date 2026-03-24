/* GreenScape – main.js  |  ES6+ modular, no console.log in production */

//  Scroll Progress Bar 
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'gs-progress-bar';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

//  Navbar scroll shadow 
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
}

//  Mobile hamburger toggle 
const navToggle  = document.getElementById('navToggle');
const navLinks   = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    }
  });
}

//  Dark Mode toggle 
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('gs-dark', isDark ? '1' : '0');
  const btn = document.querySelector('.dark-toggle');
  if (btn) btn.textContent = isDark ? '\u2600\ufe0f' : '\ud83c\udf19';
}

// Auto-detect preference on load
(function initTheme() {
  const saved = localStorage.getItem('gs-dark');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === '1' || (saved === null && prefersDark)) {
    document.body.classList.add('dark');
    const btn = document.querySelector('.dark-toggle');
    if (btn) btn.textContent = '\u2600\ufe0f';
  }
})();

// ── RTL Toggle ───────────────────────────────────────────────
(function initRTL() {
  // 1. Dynamically inject rtl.css once
  if (!document.querySelector('link[href*="rtl.css"]')) {
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    // Resolve path relative to current page location
    const inPages = window.location.pathname.replace(/\\/g, '/').includes('/pages/');
    link.href = inPages ? '../assets/css/rtl.css' : 'assets/css/rtl.css';
    document.head.appendChild(link);
  }

  // 2. Inject RTL button into .nav-auth after .dark-toggle
  const navAuth = document.querySelector('.nav-auth');
  if (navAuth && !navAuth.querySelector('.rtl-toggle')) {
    const btn = document.createElement('button');
    btn.className  = 'rtl-toggle';
    btn.title      = 'Switch to Right-to-Left (Arabic / Hebrew)';
    btn.setAttribute('aria-label', 'Toggle RTL layout');
    btn.onclick    = toggleRTL;
    const darkBtn  = navAuth.querySelector('.dark-toggle');
    if (darkBtn) {
      darkBtn.insertAdjacentElement('afterend', btn);
    } else {
      navAuth.prepend(btn);
    }
  }

  // 3. Restore saved RTL preference
  if (localStorage.getItem('gs-rtl') === '1') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
  }

  // 4. Sync button label to current state
  _syncRTLBtn();
})();

function toggleRTL() {
  const html  = document.documentElement;
  const isRTL = html.getAttribute('dir') === 'rtl';
  if (isRTL) {
    html.setAttribute('dir',  'ltr');
    html.setAttribute('lang', 'en');
    localStorage.setItem('gs-rtl', '0');
  } else {
    html.setAttribute('dir',  'rtl');
    html.setAttribute('lang', 'ar');
    localStorage.setItem('gs-rtl', '1');
  }
  _syncRTLBtn();
}

function _syncRTLBtn() {
  const btn   = document.querySelector('.rtl-toggle');
  if (!btn) return;
  const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
  btn.textContent = isRTL ? 'LTR \u21C6' : 'RTL \u21C6';
  btn.title       = isRTL ? 'Switch back to Left-to-Right' : 'Switch to Right-to-Left (Arabic / Hebrew)';
  btn.classList.toggle('rtl-active', isRTL);
}

//  Scroll-reveal (IntersectionObserver) – all animation variants 
(function initScrollReveal() {
  const selectors = '.fade-up, .fade-left, .fade-right, .zoom-in';
  const els = document.querySelectorAll(selectors);
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.10 });
  els.forEach(el => io.observe(el));
})();

//  Auto-stagger direct children of grids 
(function initStagger() {
  const grids = document.querySelectorAll(
    '.cards-grid, .features-grid, .testimonials-grid, .blog-grid, .team-grid, .gallery-grid, .pricing-grid, .stats-grid'
  );
  grids.forEach(grid => {
    const children = [...grid.children];
    children.forEach((child, i) => {
      const delay = i * 0.1;
      child.style.transitionDelay = delay + 's';
    });
  });
})();

//  Counter animation 
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + (el.dataset.suffix || '');
    if (current >= target) clearInterval(timer);
  }, 16);
}
const counterEls = document.querySelectorAll('[data-target]');
if (counterEls.length) {
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); io2.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counterEls.forEach(el => io2.observe(el));
}

//  Lightbox for gallery 
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const src  = item.querySelector('img')?.src;
    const alt  = item.querySelector('img')?.alt || '';
    if (!src) return;
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `<div class="lb-backdrop"></div><div class="lb-content"><img src="${src}" alt="${alt}"><button class="lb-close" aria-label="Close">&times;</button></div>`;
    document.body.appendChild(lb);
    lb.querySelector('.lb-backdrop').addEventListener('click', () => lb.remove());
    lb.querySelector('.lb-close').addEventListener('click',    () => lb.remove());
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { lb.remove(); document.removeEventListener('keydown', esc); } });
  });
});

//  Toast helper 
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `gs-toast gs-toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 3000);
}

//  Generic form validation & submit 
document.querySelectorAll('form[data-validate]').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const err = field.parentElement.querySelector('.field-error');
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#e03131';
        if (err) err.style.display = 'block';
      } else {
        field.style.borderColor = '';
        if (err) err.style.display = 'none';
      }
    });
    if (valid) showToast(' Message sent successfully!');
  });
});

//  Smooth anchor links 
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// Hero parallax disabled — background-attachment:fixed handles it in CSS;

//  Typed text effect for hero h1 em 
(function initTyped() {
  const el = document.querySelector('.hero h1 em[data-typed]');
  if (!el) return;
  const phrases = el.dataset.typed.split('|');
  let pi = 0, ci = 0, deleting = false;
  // Reserve space: use non-breaking space when empty so line doesn't collapse
  function setText(t) {
    el.textContent = t || '\u00A0';
  }
  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      setText(phrase.slice(0, ci + 1));
      ci++;
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      ci--;
      setText(phrase.slice(0, ci));
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 55 : 90);
  }
  tick();
})();

// ── Auth Modal (Login / Sign Up in navbar) ─────────────────────
(function initAuthModal() {
  const navAuth = document.querySelector('.nav-auth');
  if (!navAuth) return;

  // ── 1. Inject modal HTML ──────────────────────────────────────
  const modalHTML = `
  <div id="auth-modal" style="display:none;position:fixed;inset:0;z-index:9999;align-items:center;justify-content:center" role="dialog" aria-modal="true" aria-label="Login / Sign Up">
    <div id="auth-backdrop" style="position:absolute;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(4px)"></div>
    <div style="position:relative;z-index:1;width:min(460px,95vw);background:var(--clr-bg,#f6f9f7);border-radius:18px;box-shadow:0 24px 80px rgba(0,0,0,.35);overflow:hidden">
      <!-- Tabs -->
      <div style="display:flex;background:var(--clr-primary-dk,#1a5c38)">
        <button class="auth-tab active" data-tab="login" style="flex:1;padding:16px;font-family:var(--ff-head);font-size:14px;font-weight:700;color:#fff;background:none;border:none;border-bottom:3px solid var(--clr-accent,#ffb703);cursor:pointer;letter-spacing:.5px">Sign In</button>
        <button class="auth-tab" data-tab="signup" style="flex:1;padding:16px;font-family:var(--ff-head);font-size:14px;font-weight:700;color:rgba(255,255,255,.6);background:none;border:none;border-bottom:3px solid transparent;cursor:pointer;letter-spacing:.5px">Create Account</button>
        <button id="auth-close" aria-label="Close" style="padding:0 18px;background:none;border:none;color:rgba(255,255,255,.7);font-size:22px;cursor:pointer;line-height:1">&times;</button>
      </div>
      <!-- Body -->
      <div style="padding:32px 36px 28px">
        <!-- LOGIN PANEL -->
        <div id="auth-panel-login">
          <h2 style="font-family:var(--ff-head);font-size:22px;font-weight:800;margin-bottom:4px">Welcome Back</h2>
          <p style="font-size:13px;color:var(--clr-text-muted);margin-bottom:24px">Sign in to manage your bookings.</p>
          <form id="modal-login-form" novalidate>
            <div class="form-group" style="margin-bottom:16px">
              <label for="ml-email" style="font-size:13px;font-weight:600;display:block;margin-bottom:6px">Email Address</label>
              <input type="email" id="ml-email" placeholder="you@example.com" required autocomplete="email"
                style="width:100%;padding:11px 14px;border:1.5px solid var(--clr-border,#dde8e2);border-radius:8px;font-size:14px;background:var(--clr-surface,#fff);color:var(--clr-text,#1e2d25);outline:none">
            </div>
            <div class="form-group" style="margin-bottom:8px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                <label for="ml-pwd" style="font-size:13px;font-weight:600;margin:0">Password</label>
                <a href="#" style="font-size:12px;color:var(--clr-primary,#2e8b57);font-weight:600">Forgot?</a>
              </div>
              <input type="password" id="ml-pwd" placeholder="Enter your password" required autocomplete="current-password"
                style="width:100%;padding:11px 14px;border:1.5px solid var(--clr-border,#dde8e2);border-radius:8px;font-size:14px;background:var(--clr-surface,#fff);color:var(--clr-text,#1e2d25);outline:none">
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
              <input type="checkbox" id="ml-remember" style="accent-color:var(--clr-primary,#2e8b57);width:15px;height:15px">
              <label for="ml-remember" style="font-size:13px;font-weight:400;margin:0;cursor:pointer">Remember me</label>
            </div>
            <button type="submit" style="width:100%;padding:12px;background:var(--clr-primary,#2e8b57);color:#fff;border:none;border-radius:8px;font-family:var(--ff-head);font-size:15px;font-weight:700;cursor:pointer">Sign In</button>
          </form>
          <div id="ml-msg" style="display:none;margin-top:12px;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:600"></div>
          <p style="text-align:center;margin-top:18px;font-size:13px;color:var(--clr-text-muted)">No account? <a href="#" class="auth-switch-tab" data-to="signup" style="color:var(--clr-primary,#2e8b57);font-weight:700">Create one free</a></p>
        </div>
        <!-- SIGNUP PANEL -->
        <div id="auth-panel-signup" style="display:none">
          <h2 style="font-family:var(--ff-head);font-size:22px;font-weight:800;margin-bottom:4px">Create Account</h2>
          <p style="font-size:13px;color:var(--clr-text-muted);margin-bottom:24px">Free. No credit card required.</p>
          <form id="modal-signup-form" novalidate>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
              <div>
                <label for="ms-first" style="font-size:13px;font-weight:600;display:block;margin-bottom:6px">First Name</label>
                <input type="text" id="ms-first" placeholder="Jane" required autocomplete="given-name"
                  style="width:100%;padding:11px 14px;border:1.5px solid var(--clr-border,#dde8e2);border-radius:8px;font-size:14px;background:var(--clr-surface,#fff);color:var(--clr-text,#1e2d25);outline:none">
              </div>
              <div>
                <label for="ms-last" style="font-size:13px;font-weight:600;display:block;margin-bottom:6px">Last Name</label>
                <input type="text" id="ms-last" placeholder="Doe" required autocomplete="family-name"
                  style="width:100%;padding:11px 14px;border:1.5px solid var(--clr-border,#dde8e2);border-radius:8px;font-size:14px;background:var(--clr-surface,#fff);color:var(--clr-text,#1e2d25);outline:none">
              </div>
            </div>
            <div class="form-group" style="margin-bottom:16px">
              <label for="ms-email" style="font-size:13px;font-weight:600;display:block;margin-bottom:6px">Email Address</label>
              <input type="email" id="ms-email" placeholder="you@example.com" required autocomplete="email"
                style="width:100%;padding:11px 14px;border:1.5px solid var(--clr-border,#dde8e2);border-radius:8px;font-size:14px;background:var(--clr-surface,#fff);color:var(--clr-text,#1e2d25);outline:none">
            </div>
            <div class="form-group" style="margin-bottom:20px">
              <label for="ms-pwd" style="font-size:13px;font-weight:600;display:block;margin-bottom:6px">Password</label>
              <input type="password" id="ms-pwd" placeholder="Min. 8 characters" required minlength="8" autocomplete="new-password"
                style="width:100%;padding:11px 14px;border:1.5px solid var(--clr-border,#dde8e2);border-radius:8px;font-size:14px;background:var(--clr-surface,#fff);color:var(--clr-text,#1e2d25);outline:none">
            </div>
            <button type="submit" style="width:100%;padding:12px;background:var(--clr-accent,#ffb703);color:var(--clr-primary-dk,#1a5c38);border:none;border-radius:8px;font-family:var(--ff-head);font-size:15px;font-weight:700;cursor:pointer">Create Free Account</button>
          </form>
          <div id="ms-msg" style="display:none;margin-top:12px;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:600"></div>
          <p style="text-align:center;margin-top:18px;font-size:13px;color:var(--clr-text-muted)">Already have an account? <a href="#" class="auth-switch-tab" data-to="login" style="color:var(--clr-primary,#2e8b57);font-weight:700">Sign in</a></p>
        </div>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal       = document.getElementById('auth-modal');
  const backdrop    = document.getElementById('auth-backdrop');
  const closeBtn    = document.getElementById('auth-close');
  const tabs        = document.querySelectorAll('.auth-tab');
  const switchLinks = document.querySelectorAll('.auth-switch-tab');

  // ── 2. Open / close helpers ───────────────────────────────────
  function openModal(tab) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    showTab(tab || 'login');
  }
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
  function showTab(name) {
    document.getElementById('auth-panel-login').style.display  = name === 'login'  ? '' : 'none';
    document.getElementById('auth-panel-signup').style.display = name === 'signup' ? '' : 'none';
    tabs.forEach(t => {
      const active = t.dataset.tab === name;
      t.style.color            = active ? '#fff' : 'rgba(255,255,255,.6)';
      t.style.borderBottomColor = active ? 'var(--clr-accent,#ffb703)' : 'transparent';
      t.classList.toggle('active', active);
    });
  }

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  tabs.forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));
  switchLinks.forEach(l => l.addEventListener('click', e => { e.preventDefault(); showTab(l.dataset.to); }));

  // ── 3. Wire the navbar Login button to open modal ─────────────
  const loginBtn = navAuth.querySelector('.btn-nav-outline');
  if (loginBtn && loginBtn.getAttribute('href') === 'login.html') {
    loginBtn.removeAttribute('href');
    loginBtn.tagName === 'A' && loginBtn.setAttribute('role', 'button');
    loginBtn.style.cursor = 'pointer';
    loginBtn.addEventListener('click', e => { e.preventDefault(); openModal('login'); });
  }

  // ── 4. Message helper ─────────────────────────────────────────
  function showMsg(id, text, ok) {
    const el = document.getElementById(id);
    el.textContent = text;
    el.style.display    = 'block';
    el.style.background = ok ? '#d1fae5' : '#fee2e2';
    el.style.color      = ok ? '#065f46' : '#991b1b';
    el.style.border     = '1px solid ' + (ok ? '#6ee7b7' : '#fca5a5');
  }

  // ── 5. Login form ─────────────────────────────────────────────
  document.getElementById('modal-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('ml-email').value.trim().toLowerCase();
    const pwd   = document.getElementById('ml-pwd').value;
    const users = JSON.parse(localStorage.getItem('gs_users') || '{}');
    if (!users[email]) { showMsg('ml-msg', 'No account found. Please create an account first.', false); return; }
    if (users[email].password !== pwd) { showMsg('ml-msg', 'Incorrect password. Try again.', false); return; }
    const session = { email, name: users[email].name };
    localStorage.setItem('gs_session', JSON.stringify(session));
    showMsg('ml-msg', 'Welcome back, ' + users[email].name.split(' ')[0] + '! Signing you in…', true);
    setTimeout(() => { closeModal(); updateNavAuth(); }, 700);
  });

  // ── 6. Sign-up form ───────────────────────────────────────────
  document.getElementById('modal-signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const first = document.getElementById('ms-first').value.trim();
    const last  = document.getElementById('ms-last').value.trim();
    const email = document.getElementById('ms-email').value.trim().toLowerCase();
    const pwd   = document.getElementById('ms-pwd').value;
    if (!first || !last) { showMsg('ms-msg', 'Please enter your first and last name.', false); return; }
    if (pwd.length < 8)  { showMsg('ms-msg', 'Password must be at least 8 characters.', false); return; }
    const users = JSON.parse(localStorage.getItem('gs_users') || '{}');
    if (users[email]) { showMsg('ms-msg', 'An account with this email already exists. Please sign in.', false); setTimeout(() => showTab('login'), 1500); return; }
    const name = first + ' ' + last;
    users[email] = { name, password: pwd };
    localStorage.setItem('gs_users', JSON.stringify(users));
    showMsg('ms-msg', '✅ Account created! Please sign in with your new credentials.', true);
    setTimeout(() => {
      document.getElementById('ms-msg').style.display = 'none';
      document.getElementById('modal-signup-form').reset();
      showTab('login');
      document.getElementById('ml-email').value = email;
    }, 1500);
  });

  // ── 7. Session-aware navbar state ─────────────────────────────
  function updateNavAuth() {
    const session = JSON.parse(localStorage.getItem('gs_session') || 'null');
    const loginEl = navAuth.querySelector('.btn-nav-outline, [data-auth="login"]');
    let   userEl  = navAuth.querySelector('[data-auth="user"]');

    if (session) {
      // Hide login button, show user pill
      if (loginEl) loginEl.style.display = 'none';
      if (!userEl) {
        userEl = document.createElement('div');
        userEl.dataset.auth = 'user';
        userEl.style.cssText = 'position:relative;display:inline-flex;align-items:center;gap:8px;cursor:pointer';
        userEl.innerHTML = `
          <button style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.3);color:#fff;padding:7px 14px;border-radius:var(--radius-md,12px);font-family:var(--ff-head);font-size:13px;font-weight:700;cursor:pointer">
            <span style="width:26px;height:26px;border-radius:50%;background:var(--clr-accent,#ffb703);color:var(--clr-primary-dk,#1a5c38);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0">${session.name.charAt(0).toUpperCase()}</span>
            <span class="user-display-name">${session.name.split(' ')[0]}</span>
            <span style="font-size:10px;opacity:.7">▾</span>
          </button>
          <div class="user-dropdown" style="display:none;position:absolute;top:calc(100% + 8px);right:0;background:var(--clr-surface,#fff);border:1px solid var(--clr-border,#dde8e2);border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,.15);min-width:160px;overflow:hidden;z-index:200">
            <a href="profile.html" style="display:block;padding:11px 16px;font-size:13px;font-weight:600;color:var(--clr-text,#1e2d25);border-bottom:1px solid var(--clr-border,#dde8e2)">👤 My Profile</a>
            <a href="dashboard.html" style="display:block;padding:11px 16px;font-size:13px;font-weight:600;color:var(--clr-text,#1e2d25);border-bottom:1px solid var(--clr-border,#dde8e2)">📊 Dashboard</a>
            <button data-auth="logout" style="display:block;width:100%;text-align:left;padding:11px 16px;font-size:13px;font-weight:600;color:#e03131;background:none;border:none;cursor:pointer">🚪 Log Out</button>
          </div>`;
        // insert before Book Now
        const bookBtn = navAuth.querySelector('.btn-nav-solid');
        bookBtn ? navAuth.insertBefore(userEl, bookBtn) : navAuth.appendChild(userEl);

        // Toggle dropdown
        userEl.querySelector('button').addEventListener('click', e => {
          e.stopPropagation();
          const dd = userEl.querySelector('.user-dropdown');
          dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
        });
        document.addEventListener('click', () => {
          const dd = userEl ? userEl.querySelector('.user-dropdown') : null;
          if (dd) dd.style.display = 'none';
        });
        // Logout
        userEl.querySelector('[data-auth="logout"]').addEventListener('click', () => {
          localStorage.removeItem('gs_session');
          userEl.remove();
          if (loginEl) loginEl.style.display = '';
        });
      } else {
        userEl.style.display = 'inline-flex';
        userEl.querySelector('.user-display-name').textContent = session.name.split(' ')[0];
      }
    } else {
      if (loginEl) loginEl.style.display = '';
      if (userEl)  userEl.style.display  = 'none';
    }
  }

  updateNavAuth();
})();
