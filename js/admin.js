/* =============================================
   ONUR ÇAY EVİ — ADMİN PANEL JAVASCRIPT
   ============================================= */

'use strict';

// ── KONFİGÜRASYON ─────────────────────────────────────────────────────────
const ADMIN_CONFIG = {
  username: 'admin',
  password: 'onur2024'
};

// ── VERİ KATMANI ──────────────────────────────────────────────────────────
const DB = {
  KEY_SETTINGS: 'ocayevi_settings',
  KEY_CATS:     'ocayevi_categories',
  KEY_PRODUCTS: 'ocayevi_products',
  KEY_AUTH:     'ocayevi_auth',

  defaultSettings: {
    name:     'Onur Çay Evi',
    subtitle: 'Geleneksel Türk Çayı',
    phone:    '',
    address:  '',
    hours:    '',
    logo:     '',
    cover:    ''
  },

  defaultCategories: [
    { id: 'cat_1', name: 'Çaylar',            icon: '🍵', order: 1 },
    { id: 'cat_2', name: 'Kahveler',           icon: '☕', order: 2 },
    { id: 'cat_3', name: 'Soğuk İçecekler',   icon: '🥤', order: 3 },
    { id: 'cat_4', name: 'Atıştırmalıklar',   icon: '🍪', order: 4 }
  ],

  defaultProducts: [
    { id:'p_1',  categoryId:'cat_1', name:'Türk Çayı',        price:15, description:'Doğu Karadeniz\'den özel seçim, demlik çayımız.', image:'', badge:'' },
    { id:'p_2',  categoryId:'cat_1', name:'Bitki Çayı',        price:25, description:'Nane, papatya, ıhlamur karışımı aromalı çay.', image:'', badge:'Popüler' },
    { id:'p_3',  categoryId:'cat_1', name:'Earl Grey',          price:30, description:'Bergamot aromalı özel çay karışımı.', image:'', badge:'' },
    { id:'p_4',  categoryId:'cat_1', name:'Yeşil Çay',          price:25, description:'Japon tarzı hafif yeşil çay, antioksidan zengin.', image:'', badge:'' },
    { id:'p_5',  categoryId:'cat_2', name:'Türk Kahvesi',        price:35, description:'Geleneksel yöntemle hazırlanan köpüklü Türk kahvesi.', image:'', badge:'Özel' },
    { id:'p_6',  categoryId:'cat_2', name:'Filtre Kahve',        price:40, description:'Öğütülmüş taze filtre kahve, sade veya sütlü.', image:'', badge:'' },
    { id:'p_7',  categoryId:'cat_2', name:'Sütlü Kahve',         price:45, description:'Kremalı köpüklü süt ve espresso karışımı.', image:'', badge:'Popüler' },
    { id:'p_8',  categoryId:'cat_3', name:'Limonata',            price:35, description:'Taze sıkılmış limon, nane ile tazeleyici limonata.', image:'', badge:'' },
    { id:'p_9',  categoryId:'cat_3', name:'Ayran',               price:20, description:'Ev yapımı, tuzsuz ya da tuzlu seçenekli ayran.', image:'', badge:'' },
    { id:'p_10', categoryId:'cat_3', name:'Meyve Suyu',          price:30, description:'Taze portakal, elma veya vişne meyve suyu.', image:'', badge:'' },
    { id:'p_11', categoryId:'cat_4', name:'Simit',               price:15, description:'Taze fırın simidi, susam kaplı geleneksel lezzet.', image:'', badge:'' },
    { id:'p_12', categoryId:'cat_4', name:'Poğaça',              price:20, description:'Peynirli ya da zeytinli ev yapımı poğaça.', image:'', badge:'Popüler' },
    { id:'p_13', categoryId:'cat_4', name:'Kurabiye',            price:18, description:'Çeşitli ev yapımı kurabiyeler, günlük taze.', image:'', badge:'' }
  ],

  load(key, def) {
    try { return JSON.parse(localStorage.getItem(key)) || def; }
    catch { return def; }
  },
  save(key, data) { localStorage.setItem(key, JSON.stringify(data)); },

  getSettings()   { return this.load(this.KEY_SETTINGS, {...this.defaultSettings}); },
  getCategories() { return this.load(this.KEY_CATS,     [...this.defaultCategories]); },
  getProducts()   { return this.load(this.KEY_PRODUCTS, [...this.defaultProducts]); },

  saveSettings(d)   { this.save(this.KEY_SETTINGS, d); },
  saveCategories(d) { this.save(this.KEY_CATS, d); },
  saveProducts(d)   { this.save(this.KEY_PRODUCTS, d); }
};

// ── YARDIMCI ──────────────────────────────────────────────────────────────
function uid() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}

function showToast(msg, type = 'success') {
  let t = document.getElementById('admin-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'admin-toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> ${escHtml(msg)}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ── AUTH ──────────────────────────────────────────────────────────────────
const Auth = {
  isLoggedIn() { return sessionStorage.getItem(DB.KEY_AUTH) === 'true'; },
  login()      { sessionStorage.setItem(DB.KEY_AUTH, 'true'); },
  logout()     { sessionStorage.removeItem(DB.KEY_AUTH); }
};

// ── ADMIN UYGULAMASI ─────────────────────────────────────────────────────
const Admin = {
  settings:    null,
  categories:  [],
  products:    [],
  editingProd: null,

  /* ---- INIT ---- */
  init() {
    if (Auth.isLoggedIn()) {
      this.showAdmin();
    } else {
      this.showLogin();
    }
    this.bindLoginForm();
  },

  showLogin() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('admin-page').classList.remove('active');
  },

  showAdmin() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('admin-page').classList.add('active');
    this.loadData();
    this.bindNav();
    this.bindSidebar();
    this.showPanel('dashboard');
  },

  loadData() {
    this.settings   = DB.getSettings();
    this.categories = DB.getCategories();
    this.products   = DB.getProducts();
  },

  /* ---- LOGIN ---- */
  bindLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const user = document.getElementById('login-user').value.trim();
      const pass = document.getElementById('login-pass').value;
      const err  = document.getElementById('login-error');

      if (user === ADMIN_CONFIG.username && pass === ADMIN_CONFIG.password) {
        Auth.login();
        this.showAdmin();
      } else {
        err.classList.add('show');
        err.textContent = 'Kullanıcı adı veya şifre hatalı.';
        setTimeout(() => err.classList.remove('show'), 3000);
      }
    });
  },

  /* ---- NAVIGATION ---- */
  bindNav() {
    document.querySelectorAll('.nav-item[data-panel]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showPanel(btn.dataset.panel);
        this.closeSidebar();
      });
    });

    document.getElementById('logout-btn')?.addEventListener('click', () => {
      Auth.logout();
      this.showLogin();
    });

    // Menüye git
    document.getElementById('goto-menu-btn')?.addEventListener('click', () => {
      window.open('index.html', '_blank');
    });
  },

  bindSidebar() {
    const ham = document.getElementById('hamburger-btn');
    const overlay = document.getElementById('sidebar-overlay');
    ham?.addEventListener('click', () => {
      document.getElementById('admin-sidebar').classList.toggle('open');
      overlay?.classList.toggle('show');
    });
    overlay?.addEventListener('click', () => this.closeSidebar());
  },

  closeSidebar() {
    document.getElementById('admin-sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('show');
  },

  showPanel(id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

    const panel = document.getElementById(`panel-${id}`);
    if (panel) panel.classList.add('active');

    const navBtn = document.querySelector(`.nav-item[data-panel="${id}"]`);
    if (navBtn) navBtn.classList.add('active');

    const topTitle = document.getElementById('topbar-title');
    const titles = {
      dashboard:  'Dashboard',
      products:   'Ürün Yönetimi',
      categories: 'Kategori Yönetimi',
      settings:   'Ayarlar',
      qr:         'QR Kod'
    };
    if (topTitle) topTitle.textContent = titles[id] || '';

    // Panel'e özel render
    if (id === 'dashboard')  this.renderDashboard();
    if (id === 'products')   this.renderProducts();
    if (id === 'categories') this.renderCategories();
    if (id === 'settings')   this.renderSettings();
    if (id === 'qr')         this.renderQR();
  },

  /* ════════════════ DASHBOARD ════════════════ */
  renderDashboard() {
    const el = id => document.getElementById(id);
    if (el('stat-products'))   el('stat-products').textContent   = this.products.length;
    if (el('stat-categories')) el('stat-categories').textContent = this.categories.length;
    if (el('stat-name'))       el('stat-name').textContent       = this.settings.name;

    // Son ürünler
    const tbody = el('recent-products-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const recent = [...this.products].slice(-5).reverse();
    recent.forEach(prod => {
      const cat = this.categories.find(c => c.id === prod.categoryId);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="td-product">
            <div class="table-img">${cat?.icon || '🍽️'}</div>
            <div>
              <div class="td-name">${escHtml(prod.name)}</div>
              <div class="td-desc">${escHtml(prod.description || '')}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-cat">${escHtml(cat?.name || 'Bilinmiyor')}</span></td>
        <td><span class="badge badge-price">${Number(prod.price).toFixed(0)}₺</span></td>
      `;
      tbody.appendChild(tr);
    });
  },

  /* ════════════════ ÜRÜNLER ════════════════ */
  renderProducts() {
    this.buildCategoryOptions('prod-category');
    this.bindProductForm();
    this.renderProductTable();
  },

  buildCategoryOptions(selectId) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = '<option value="">— Kategori Seç —</option>';
    const sorted = [...this.categories].sort((a,b) => a.order - b.order);
    sorted.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = `${cat.icon} ${cat.name}`;
      sel.appendChild(opt);
    });
  },

  bindProductForm() {
    const form = document.getElementById('product-form');
    if (!form || form.dataset.bound === '1') return;
    form.dataset.bound = '1';

    // Fotoğraf yükleme
    const uploadArea = document.getElementById('prod-img-area');
    const fileInput  = document.getElementById('prod-img-input');
    const preview    = document.getElementById('prod-img-preview');

    uploadArea?.addEventListener('click', () => fileInput?.click());
    uploadArea?.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('dragover'); });
    uploadArea?.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea?.addEventListener('drop', async e => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        await this.loadImagePreview(file, preview, uploadArea);
      }
    });

    fileInput?.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (file) await this.loadImagePreview(file, preview, uploadArea);
    });

    // Form gönder
    form.addEventListener('submit', async e => {
      e.preventDefault();
      await this.saveProduct();
    });

    // İptal
    document.getElementById('prod-cancel-btn')?.addEventListener('click', () => {
      this.resetProductForm();
    });
  },

  async loadImagePreview(file, previewEl, areaEl) {
    const b64 = await fileToBase64(file);
    if (previewEl) { previewEl.src = b64; previewEl.style.display = 'block'; }
    const uploadContent = areaEl?.querySelector('.upload-content');
    if (uploadContent) uploadContent.style.display = 'none';
    const overlay = areaEl?.querySelector('.image-preview-overlay');
    if (overlay) overlay.style.display = 'flex';
    areaEl.dataset.imageData = b64;
  },

  async saveProduct() {
    const getValue = id => document.getElementById(id)?.value?.trim() || '';
    const name  = getValue('prod-name');
    const price = getValue('prod-price');
    const catId = getValue('prod-category');
    const desc  = getValue('prod-desc');
    const badge = getValue('prod-badge');
    const imgArea = document.getElementById('prod-img-area');
    const imageData = imgArea?.dataset.imageData || '';

    if (!name)  { showToast('Ürün adı zorunludur.', 'error'); return; }
    if (!price) { showToast('Fiyat zorunludur.', 'error'); return; }
    if (!catId) { showToast('Kategori seçiniz.', 'error'); return; }

    if (this.editingProd) {
      // Güncelle
      const idx = this.products.findIndex(p => p.id === this.editingProd);
      if (idx !== -1) {
        this.products[idx] = {
          ...this.products[idx],
          name, price: Number(price), categoryId: catId,
          description: desc, badge,
          ...(imageData ? { image: imageData } : {})
        };
        showToast('Ürün güncellendi!');
      }
    } else {
      // Yeni ekle
      this.products.push({
        id: uid(), categoryId: catId, name,
        price: Number(price), description: desc,
        badge, image: imageData
      });
      showToast('Ürün eklendi!');
    }

    DB.saveProducts(this.products);
    this.resetProductForm();
    this.renderProductTable();
    this.renderDashboard();
  },

  resetProductForm() {
    this.editingProd = null;
    document.getElementById('product-form')?.reset();
    const imgArea = document.getElementById('prod-img-area');
    if (imgArea) {
      imgArea.dataset.imageData = '';
      const preview = document.getElementById('prod-img-preview');
      if (preview) { preview.style.display = 'none'; preview.src = ''; }
      const content = imgArea.querySelector('.upload-content');
      if (content) content.style.display = '';
    }
    const saveBtn = document.getElementById('prod-save-btn');
    if (saveBtn) saveBtn.textContent = '💾 Ürün Ekle';
    document.getElementById('prod-cancel-btn')?.style && (document.getElementById('prod-cancel-btn').style.display = 'none');
  },

  renderProductTable() {
    const tbody = document.getElementById('products-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (this.products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:rgba(255,255,255,0.3);padding:40px">Henüz ürün eklenmedi.</td></tr>';
      return;
    }

    this.products.forEach(prod => {
      const cat = this.categories.find(c => c.id === prod.categoryId);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="td-product">
            <div class="table-img">
              ${prod.image
                ? `<img src="${prod.image}" alt="${escHtml(prod.name)}">`
                : `<span style="font-size:22px">${cat?.icon || '🍽️'}</span>`}
            </div>
            <div>
              <div class="td-name">${escHtml(prod.name)}</div>
              <div class="td-desc">${escHtml(prod.description || '')}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-cat">${escHtml(cat?.name || '—')}</span></td>
        <td><span class="badge badge-price">${Number(prod.price).toFixed(0)}₺</span></td>
        <td>${prod.badge ? `<span class="badge" style="background:rgba(212,160,23,.15);color:var(--gold-300);border:1px solid rgba(212,160,23,.25)">${escHtml(prod.badge)}</span>` : '—'}</td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-success" onclick="Admin.editProduct('${prod.id}')">✏️ Düzenle</button>
            <button class="btn btn-danger"  onclick="Admin.deleteProduct('${prod.id}')">🗑️ Sil</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  editProduct(id) {
    const prod = this.products.find(p => p.id === id);
    if (!prod) return;
    this.editingProd = id;

    document.getElementById('prod-name').value     = prod.name;
    document.getElementById('prod-price').value    = prod.price;
    document.getElementById('prod-category').value = prod.categoryId;
    document.getElementById('prod-desc').value     = prod.description || '';
    document.getElementById('prod-badge').value    = prod.badge || '';

    if (prod.image) {
      const imgArea = document.getElementById('prod-img-area');
      const preview = document.getElementById('prod-img-preview');
      if (imgArea)  imgArea.dataset.imageData = prod.image;
      if (preview)  { preview.src = prod.image; preview.style.display = 'block'; }
      const content = imgArea?.querySelector('.upload-content');
      if (content) content.style.display = 'none';
    }

    const saveBtn = document.getElementById('prod-save-btn');
    if (saveBtn) saveBtn.textContent = '💾 Güncelle';
    const cancelBtn = document.getElementById('prod-cancel-btn');
    if (cancelBtn) cancelBtn.style.display = '';

    document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  deleteProduct(id) {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    this.products = this.products.filter(p => p.id !== id);
    DB.saveProducts(this.products);
    this.renderProductTable();
    this.renderDashboard();
    showToast('Ürün silindi.');
  },

  /* ════════════════ KATEGORİLER ════════════════ */
  renderCategories() {
    this.renderCategoryList();
    this.bindCategoryForm();
  },

  bindCategoryForm() {
    const form = document.getElementById('category-form');
    if (!form || form.dataset.bound === '1') return;
    form.dataset.bound = '1';

    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('cat-name')?.value.trim();
      const icon = document.getElementById('cat-icon')?.value.trim() || '🍽️';

      if (!name) { showToast('Kategori adı zorunludur.', 'error'); return; }

      this.categories.push({
        id: uid(), name, icon,
        order: this.categories.length + 1
      });
      DB.saveCategories(this.categories);
      form.reset();
      this.renderCategoryList();
      this.buildCategoryOptions('prod-category');
      showToast('Kategori eklendi!');
    });
  },

  renderCategoryList() {
    const list = document.getElementById('category-list');
    if (!list) return;
    list.innerHTML = '';

    if (this.categories.length === 0) {
      list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,.3);padding:32px">Henüz kategori eklenmedi.</p>';
      return;
    }

    const sorted = [...this.categories].sort((a,b) => a.order - b.order);
    sorted.forEach(cat => {
      const prodCount = this.products.filter(p => p.categoryId === cat.id).length;
      const item = document.createElement('div');
      item.className = 'cat-item';
      item.innerHTML = `
        <div class="cat-item-icon">${escHtml(cat.icon)}</div>
        <div class="cat-item-name">${escHtml(cat.name)}</div>
        <div class="cat-item-count">${prodCount} ürün</div>
        <div class="actions-cell">
          <button class="btn btn-danger" onclick="Admin.deleteCategory('${cat.id}')">🗑️ Sil</button>
        </div>
      `;
      list.appendChild(item);
    });
  },

  deleteCategory(id) {
    const prodCount = this.products.filter(p => p.categoryId === id).length;
    if (prodCount > 0) {
      if (!confirm(`Bu kategoride ${prodCount} ürün var. Silmek istediğinizden emin misiniz? Ürünler kategorisiz kalacak.`)) return;
    } else {
      if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    }
    this.categories = this.categories.filter(c => c.id !== id);
    DB.saveCategories(this.categories);
    this.renderCategoryList();
    this.buildCategoryOptions('prod-category');
    this.renderDashboard();
    showToast('Kategori silindi.');
  },

  /* ════════════════ AYARLAR ════════════════ */
  renderSettings() {
    const s = this.settings;
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };

    setVal('set-name',     s.name);
    setVal('set-subtitle', s.subtitle);
    setVal('set-phone',    s.phone);
    setVal('set-address',  s.address);
    setVal('set-hours',    s.hours);

    this.bindSettingsForm();
    this.bindLogoUpload();
    this.bindPasswordForm();
  },

  bindSettingsForm() {
    const form = document.getElementById('settings-form');
    if (!form || form.dataset.bound === '1') return;
    form.dataset.bound = '1';

    form.addEventListener('submit', e => {
      e.preventDefault();
      const getV = id => document.getElementById(id)?.value.trim() || '';
      this.settings = {
        ...this.settings,
        name:     getV('set-name') || 'Onur Çay Evi',
        subtitle: getV('set-subtitle'),
        phone:    getV('set-phone'),
        address:  getV('set-address'),
        hours:    getV('set-hours')
      };
      DB.saveSettings(this.settings);
      showToast('Ayarlar kaydedildi!');
    });
  },

  bindLogoUpload() {
    const logoInput = document.getElementById('logo-file-input');
    const logoPrev  = document.getElementById('logo-preview');
    if (!logoInput) return;

    // Mevcut logo
    if (this.settings.logo && logoPrev) {
      logoPrev.innerHTML = `<img src="${this.settings.logo}" style="max-height:100%;max-width:100%;border-radius:50%">`;
    }

    logoInput.addEventListener('change', async () => {
      const file = logoInput.files[0];
      if (!file) return;
      const b64 = await fileToBase64(file);
      this.settings.logo = b64;
      DB.saveSettings(this.settings);
      if (logoPrev) logoPrev.innerHTML = `<img src="${b64}" style="max-height:100%;max-width:100%;border-radius:50%">`;
      showToast('Logo güncellendi!');
    });
  },

  bindPasswordForm() {
    const form = document.getElementById('password-form');
    if (!form || form.dataset.bound === '1') return;
    form.dataset.bound = '1';

    form.addEventListener('submit', e => {
      e.preventDefault();
      const oldPass  = document.getElementById('old-pass')?.value;
      const newPass  = document.getElementById('new-pass')?.value;
      const newPass2 = document.getElementById('new-pass2')?.value;

      if (oldPass !== ADMIN_CONFIG.password) {
        showToast('Mevcut şifre yanlış.', 'error'); return;
      }
      if (!newPass || newPass.length < 4) {
        showToast('Yeni şifre en az 4 karakter olmalı.', 'error'); return;
      }
      if (newPass !== newPass2) {
        showToast('Şifreler eşleşmiyor.', 'error'); return;
      }
      ADMIN_CONFIG.password = newPass;
      showToast('Şifre güncellendi!');
      form.reset();
    });
  },

  /* ════════════════ QR KOD ════════════════ */
  renderQR() {
    const container = document.getElementById('qr-canvas-container');
    if (!container) return;
    container.innerHTML = '';

    const url = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
    document.getElementById('qr-url-display')?.setAttribute('href', url);
    document.getElementById('qr-url-display')?.textContent = url;

    // QRCode.js kütüphanesiyle oluştur
    if (typeof QRCode !== 'undefined') {
      new QRCode(container, {
        text: url,
        width: 256,
        height: 256,
        colorDark: '#1a0a00',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
    } else {
      // Fallback: QR API
      const img = document.createElement('img');
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(url)}&color=1a0a00&bgcolor=ffffff`;
      img.alt = 'QR Kod';
      img.style.cssText = 'width:256px;height:256px;display:block';
      container.appendChild(img);
    }

    // İndir butonu
    const dlBtn = document.getElementById('qr-download-btn');
    if (dlBtn) {
      dlBtn.onclick = () => {
        const canvas = container.querySelector('canvas');
        if (canvas) {
          const a = document.createElement('a');
          a.download = 'onur-cayevi-qr.png';
          a.href = canvas.toDataURL();
          a.click();
        } else {
          const img = container.querySelector('img');
          if (img) { window.open(img.src, '_blank'); }
        }
      };
    }
  }
};

// ── BAŞLAT ────────────────────────────────────────────────────────────────
window.Admin = Admin;
document.addEventListener('DOMContentLoaded', () => Admin.init());
