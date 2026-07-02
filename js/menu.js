/* =============================================
   ONUR ÇAY EVİ — MENÜ JAVASCRIPT
   ============================================= */

'use strict';

// ── VERİ KATMANI ──────────────────────────────────────────────────────────
const DB = {
  KEY_SETTINGS: 'ocayevi_settings',
  KEY_CATS:     'ocayevi_categories',
  KEY_PRODUCTS: 'ocayevi_products',

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
    {
      id: 'p_1', categoryId: 'cat_1',
      name: 'Türk Çayı', price: 15,
      description: 'Doğu Karadeniz\'den özel seçim, demlik çayımız.',
      image: '', badge: ''
    },
    {
      id: 'p_2', categoryId: 'cat_1',
      name: 'Bitki Çayı', price: 25,
      description: 'Nane, papatya, ıhlamur karışımı aromalı çay.',
      image: '', badge: 'Popüler'
    },
    {
      id: 'p_3', categoryId: 'cat_1',
      name: 'Earl Grey', price: 30,
      description: 'Bergamot aromalı özel çay karışımı.',
      image: '', badge: ''
    },
    {
      id: 'p_4', categoryId: 'cat_1',
      name: 'Yeşil Çay', price: 25,
      description: 'Japon tarzı hafif yeşil çay, antioksidan zengin.',
      image: '', badge: ''
    },
    {
      id: 'p_5', categoryId: 'cat_2',
      name: 'Türk Kahvesi', price: 35,
      description: 'Geleneksel yöntemle hazırlanan köpüklü Türk kahvesi.',
      image: '', badge: 'Özel'
    },
    {
      id: 'p_6', categoryId: 'cat_2',
      name: 'Filtre Kahve', price: 40,
      description: 'Öğütülmüş taze filtre kahve, sade veya sütlü.',
      image: '', badge: ''
    },
    {
      id: 'p_7', categoryId: 'cat_2',
      name: 'Sütlü Kahve', price: 45,
      description: 'Kremalı köpüklü süt ve espresso karışımı.',
      image: '', badge: 'Popüler'
    },
    {
      id: 'p_8', categoryId: 'cat_3',
      name: 'Limonata', price: 35,
      description: 'Taze sıkılmış limon, nane ile tazeleyici limonata.',
      image: '', badge: ''
    },
    {
      id: 'p_9', categoryId: 'cat_3',
      name: 'Ayran', price: 20,
      description: 'Ev yapımı, tuzsuz ya da tuzlu seçenekli ayran.',
      image: '', badge: ''
    },
    {
      id: 'p_10', categoryId: 'cat_3',
      name: 'Meyve Suyu', price: 30,
      description: 'Taze portakal, elma veya vişne meyve suyu.',
      image: '', badge: ''
    },
    {
      id: 'p_11', categoryId: 'cat_4',
      name: 'Simit', price: 15,
      description: 'Taze fırın simidi, susam kaplı geleneksel lezzet.',
      image: '', badge: ''
    },
    {
      id: 'p_12', categoryId: 'cat_4',
      name: 'Poğaça', price: 20,
      description: 'Peynirli ya da zeytinli ev yapımı poğaça.',
      image: '', badge: 'Popüler'
    },
    {
      id: 'p_13', categoryId: 'cat_4',
      name: 'Kurabiye', price: 18,
      description: 'Çeşitli ev yapımı kurabiyeler, günlük taze.',
      image: '', badge: ''
    }
  ],

  getSettings()   { return JSON.parse(localStorage.getItem(this.KEY_SETTINGS) || 'null') || this.defaultSettings; },
  getCategories() { return JSON.parse(localStorage.getItem(this.KEY_CATS)     || 'null') || [...this.defaultCategories]; },
  getProducts()   { return JSON.parse(localStorage.getItem(this.KEY_PRODUCTS) || 'null') || [...this.defaultProducts]; }
};

// ── YARDIMCI FONKSIYONLAR ─────────────────────────────────────────────────
function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

function formatPrice(price) {
  return Number(price).toFixed(0);
}

// ── ANA UYGULAMA ──────────────────────────────────────────────────────────
const App = {
  settings:   null,
  categories: [],
  products:   [],
  activeCategory: 'all',
  searchQuery: '',

  init() {
    this.settings   = DB.getSettings();
    this.categories = DB.getCategories();
    this.products   = DB.getProducts();

    this.applySettings();
    this.renderCategoryTabs();
    this.renderMenu();
    this.bindSearch();
  },

  applySettings() {
    const s = this.settings;
    // Brand name
    document.querySelectorAll('[data-setting="name"]').forEach(el => el.textContent = s.name);
    document.querySelectorAll('[data-setting="subtitle"]').forEach(el => el.textContent = s.subtitle || '');

    // Contact info
    if (s.phone) {
      const phoneEl = document.getElementById('hero-phone');
      if (phoneEl) { phoneEl.textContent = s.phone; phoneEl.closest('.hero-info-item').style.display = 'flex'; }
    }
    if (s.address) {
      const addrEl = document.getElementById('hero-address');
      if (addrEl) { addrEl.textContent = s.address; addrEl.closest('.hero-info-item').style.display = 'flex'; }
    }
    if (s.hours) {
      const hoursEl = document.getElementById('hero-hours');
      if (hoursEl) { hoursEl.textContent = s.hours; hoursEl.closest('.hero-info-item').style.display = 'flex'; }
    }

    // Footer
    const footerBrand = document.getElementById('footer-brand');
    if (footerBrand) footerBrand.textContent = s.name;

    const footerPhone = document.getElementById('footer-phone');
    if (footerPhone && s.phone) { footerPhone.textContent = s.phone; footerPhone.href = 'tel:' + s.phone.replace(/\s/g,''); }
    else if (footerPhone) footerPhone.closest('.footer-contact-item')?.remove();

    const footerAddr = document.getElementById('footer-address');
    if (footerAddr && s.address) footerAddr.textContent = s.address;
    else if (footerAddr) footerAddr.closest('.footer-contact-item')?.remove();

    // Logo
    if (s.logo) {
      const logoIconEl = document.getElementById('logo-icon');
      if (logoIconEl) {
        logoIconEl.innerHTML = `<img src="${s.logo}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
      }
    }

    // Page title
    document.title = s.name + ' — Menü';
  },

  renderCategoryTabs() {
    const nav = document.getElementById('category-nav');
    if (!nav) return;

    // "Tümü" butonu
    const allBtn = document.createElement('button');
    allBtn.className = 'cat-tab all-tab active';
    allBtn.dataset.catId = 'all';
    allBtn.innerHTML = `<span class="cat-icon">🍽️</span> Tümü`;
    allBtn.addEventListener('click', () => this.filterByCategory('all', allBtn));
    nav.appendChild(allBtn);

    // Kategori butonları
    const sorted = [...this.categories].sort((a, b) => (a.order || 0) - (b.order || 0));
    sorted.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'cat-tab';
      btn.dataset.catId = cat.id;
      btn.innerHTML = `<span class="cat-icon">${escapeHtml(cat.icon)}</span> ${escapeHtml(cat.name)}`;
      btn.addEventListener('click', () => this.filterByCategory(cat.id, btn));
      nav.appendChild(btn);
    });
  },

  filterByCategory(catId, btnEl) {
    this.activeCategory = catId;
    this.searchQuery = '';
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    // Aktif tab güncelle
    document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    // Sections göster/gizle
    if (catId === 'all') {
      document.querySelectorAll('.menu-section').forEach(s => s.classList.remove('hidden'));
    } else {
      document.querySelectorAll('.menu-section').forEach(s => {
        s.classList.toggle('hidden', s.dataset.catId !== catId);
      });
    }

    this.checkEmpty();
  },

  renderMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;
    container.innerHTML = '';

    const sorted = [...this.categories].sort((a, b) => (a.order || 0) - (b.order || 0));

    sorted.forEach((cat, idx) => {
      const prods = this.products.filter(p => p.categoryId === cat.id);
      if (prods.length === 0) return;

      const section = document.createElement('section');
      section.className = 'menu-section';
      section.dataset.catId = cat.id;
      section.style.animationDelay = `${idx * 0.08}s`;

      const title = document.createElement('h2');
      title.className = 'section-title';
      title.textContent = `${cat.icon}  ${cat.name}`;

      const grid = document.createElement('div');
      grid.className = 'product-grid';

      prods.forEach((prod, pIdx) => {
        const card = this.createCard(prod, cat, pIdx);
        grid.appendChild(card);
      });

      section.appendChild(title);
      section.appendChild(grid);
      container.appendChild(section);
    });

    this.checkEmpty();
  },

  createCard(prod, cat, idx) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.prodId = prod.id;
    card.dataset.search = `${prod.name} ${prod.description || ''}`.toLowerCase();
    card.style.animationDelay = `${idx * 0.06}s`;

    const imageHtml = prod.image
      ? `<img class="card-image" src="${prod.image}" alt="${escapeHtml(prod.name)}" loading="lazy">`
      : `<div class="card-image-placeholder"><span>${escapeHtml(cat.icon)}</span></div>`;

    const badgeHtml = prod.badge
      ? `<span class="card-badge">${escapeHtml(prod.badge)}</span>`
      : '';

    const descHtml = prod.description
      ? `<p class="card-desc">${escapeHtml(prod.description)}</p>`
      : '';

    card.innerHTML = `
      <div class="card-image-wrap">
        ${imageHtml}
        ${badgeHtml}
      </div>
      <div class="card-body">
        <h3 class="card-name">${escapeHtml(prod.name)}</h3>
        ${descHtml}
        <div class="card-footer">
          <span class="card-price">${formatPrice(prod.price)}<span class="card-price-currency">₺</span></span>
          <span class="card-tag">${escapeHtml(cat.name)}</span>
        </div>
      </div>
    `;
    return card;
  },

  bindSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;

    input.addEventListener('input', () => {
      this.searchQuery = input.value.trim().toLowerCase();
      this.runSearch();
    });
  },

  runSearch() {
    const q = this.searchQuery;

    if (!q) {
      // Arama temizlendi, kategori filtresine dön
      document.querySelectorAll('.product-card').forEach(c => c.style.display = '');
      this.filterByCategory(this.activeCategory, null);
      document.querySelectorAll('.cat-tab').forEach(b => {
        b.classList.toggle('active', b.dataset.catId === this.activeCategory);
      });
      return;
    }

    // Tüm kategorileri göster, ürünleri filtrele
    document.querySelectorAll('.menu-section').forEach(s => s.classList.remove('hidden'));
    document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));

    let anyVisible = false;
    document.querySelectorAll('.product-card').forEach(card => {
      const match = card.dataset.search.includes(q);
      card.style.display = match ? '' : 'none';
      if (match) anyVisible = true;
    });

    // Boş section'ları gizle
    document.querySelectorAll('.menu-section').forEach(section => {
      const visible = [...section.querySelectorAll('.product-card')].some(c => c.style.display !== 'none');
      section.classList.toggle('hidden', !visible);
    });

    const nr = document.getElementById('no-results');
    if (nr) nr.classList.toggle('visible', !anyVisible);
  },

  checkEmpty() {
    const nr = document.getElementById('no-results');
    if (!nr) return;
    const visibleSections = [...document.querySelectorAll('.menu-section')].filter(s => !s.classList.contains('hidden'));
    nr.classList.toggle('visible', visibleSections.length === 0);
  }
};

// ── BAŞLAT ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
