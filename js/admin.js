/* =============================================
   ONUR ÇAY EVİ — ADMİN PANEL JS
   ============================================= */

// ── KONFİGÜRASYON ─────────────────────────────────────────────────────────
var ADMIN_PASS = 'onur2024';
var ADMIN_USER = 'admin';

// ── VERİ YARDIMCISI ───────────────────────────────────────────────────────
var Store = {
  K: {
    settings:  'ocayevi_settings_v2',
    cats:      'ocayevi_categories_v2',
    products:  'ocayevi_products_v2'
  },

  defaultSettings: {
    name: 'Onur Çay Evi', subtitle: 'Geleneksel Türk Çayı',
    phone: '', address: '', hours: '', logo: ''
  },

  defaultCats: [
    { id:'cat_1', name:'Çaylar',      icon:'🍵', order:1 },
    { id:'cat_2', name:'Atıştırmalık', icon:'🥪', order:2 },
    { id:'cat_3', name:'Bisküvi', icon:'🍪', order:3 }
  ],

  defaultProducts: [
    { id:'p_1',  categoryId:'cat_1', name:'Türk Çayı',           price:15,  description:'Demlik çayımız, Doğu Karadeniz seçim. Sıcak servis edilir.',               image:'images/cay_turk.png',       badge:'' },
    { id:'p_2',  categoryId:'cat_1', name:'Oralet Kivili',         price:15,  description:'Ferahlatıcı kivi aromalı meyve çayı, çay bardağında sıcak servis.',       image:'images/cay_kivi.png',       badge:'' },
    { id:'p_3',  categoryId:'cat_1', name:'Oralet Portakallı',     price:15,  description:'Taze portakal aromalı meyve çayı, çay bardağında.',                      image:'images/cay_portakal.png',   badge:'' },
    { id:'p_4',  categoryId:'cat_1', name:'Oralet Muzlu',          price:15,  description:'Egzotik muz aromalı sıcak meyve çayı, çay bardağında.',                  image:'images/cay_muz.png',        badge:'' },
    { id:'p_5',  categoryId:'cat_1', name:'Oralet Karadutlu',      price:15,  description:'Derin, yoğun karadut aromalı meyve çayı, çay bardağında.',              image:'images/cay_karadut.png',    badge:'Yeni' },
    { id:'p_6',  categoryId:'cat_1', name:'Oralet Kuşburnulu',     price:15,  description:'C vitamini zengini kuşburnu aromalı meyve çayı.',                        image:'images/cay_kusburnu.png',   badge:'' },
    { id:'p_7',  categoryId:'cat_1', name:'Nane Limon',            price:15,  description:'Taze nane ve limonun buluşması, ferahlatıcı bitki çayı.',                image:'images/cay_nane_limon.png', badge:'Popüler' },
    { id:'p_8',  categoryId:'cat_1', name:'Ihlamur',               price:15,  description:'Doğal ıhlamur çiçeklerinden hazırlanan geleneksel bitki çayı.',          image:'images/cay_ihlamur.png',    badge:'' },
    { id:'p_9',  categoryId:'cat_2', name:'Gözleme',               price:150, description:'Kare dilim gözleme, ince lavaş hamuru, iç malzeme seçiminize göre.',     image:'images/gozleme.jpg',        badge:'Özel' },
    { id:'p_10', categoryId:'cat_2', name:'Tost (Tam)',             price:125, description:'Somon ekmeği 4 dilim, kaşarlı sucuklu tost. Tam porsiyon.',             image:'images/tost.jpg',           badge:'' },
    { id:'p_11', categoryId:'cat_2', name:'Tost (Yarım)',           price:65,  description:'Somon ekmeği 2 dilim, kaşarlı sucuklu tost. Yarım porsiyon.',           image:'images/tost.jpg',           badge:'' },
    { id:'p_12', categoryId:'cat_3', name:'Eti Cin',             price:40, description:'Portakal jöleli klasik bisküvi.',                       image:'images/eti_cin.jpg',        badge:'' },
    { id:'p_13', categoryId:'cat_3', name:'Nero',                price:40, description:'Kakaolu kremalı nefis bisküvi.',                        image:'images/eti_nero.jpg',       badge:'' },
    { id:'p_14', categoryId:'cat_3', name:'Çizi',                price:40, description:'Peynir aromalı tuzlu kraker.',                          image:'images/ulker_cizi.jpg',     badge:'' },
    { id:'p_15', categoryId:'cat_3', name:'İkram Sütlü Çikolata',price:40, description:'Sütlü çikolata kremalı sandviç bisküvi.',               image:'images/ikram_sutlu.jpg',    badge:'' },
    { id:'p_16', categoryId:'cat_3', name:'İkram Fındıklı',      price:40, description:'Fındık kremalı sandviç bisküvi.',                       image:'images/ikram_findikli.jpg', badge:'' },
    { id:'p_17', categoryId:'cat_3', name:'Eti Kombo',           price:40, description:'Çikolata kaplı çıtır bisküvi.',                         image:'images/eti_kombo.jpg',      badge:'' },
    { id:'p_18', categoryId:'cat_3', name:'Hanımeller',          price:40, description:'Çokodamla damla çikolatalı anne kurabiyesi.',           image:'images/hanimeller.jpg',     badge:'' },
    { id:'p_19', categoryId:'cat_3', name:'Burçak Kremalı',      price:40, description:'Yulaflı bisküvi arası nefis krema.',                    image:'images/burcak_kremali.jpg', badge:'' },
    { id:'p_20', categoryId:'cat_3', name:'Benim O',             price:40, description:'Marshmallow ve çikolata kaplı bisküvi.',                image:'images/benim_o.jpg',        badge:'' },
    { id:'p_21', categoryId:'cat_3', name:'Tutku',               price:40, description:'İçi akışkan çikolatalı efsane bisküvi.',                image:'images/eti_tutku.jpg',      badge:'Popüler' },
    { id:'p_22', categoryId:'cat_3', name:'Burçak Sütlü Çikolatalı',price:45, description:'Sütlü çikolata kaplamalı yulaflı bisküvi.',            image:'images/burcak_sutlu.jpg',   badge:'' }
  ],

  get: function(key, def) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : def;
    } catch(e) { return def; }
  },

  set: function(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  },

  getSettings:  function() { return this.get(this.K.settings, Object.assign({}, this.defaultSettings)); },
  getCats:      function() { return this.get(this.K.cats,     this.defaultCats.slice()); },
  getProducts:  function() { return this.get(this.K.products, this.defaultProducts.slice()); },
  saveSettings: function(d) { this.set(this.K.settings, d); },
  saveCats:     function(d) { this.set(this.K.cats, d); },
  saveProducts: function(d) { this.set(this.K.products, d); }
};

// ── YARDIMCILAR ───────────────────────────────────────────────────────────
function uid() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);
}

function esc(s) {
  var d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}

function getEl(id) { return document.getElementById(id); }
function getVal(id) { var el = getEl(id); return el ? el.value.trim() : ''; }
function setVal(id, v) { var el = getEl(id); if (el) el.value = v || ''; }

function toast(msg, type) {
  type = type || 'success';
  var el = getEl('admin-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'admin-toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.className = 'toast ' + type;
  el.innerHTML = (type === 'success' ? '✅' : '❌') + ' ' + esc(msg);
  el.classList.add('show');
  setTimeout(function() { el.classList.remove('show'); }, 3000);
}

function fileToB64(file) {
  return new Promise(function(res, rej) {
    var r = new FileReader();
    r.onload = function(e) { res(e.target.result); };
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ── AUTH ──────────────────────────────────────────────────────────────────
function isLoggedIn()  { return sessionStorage.getItem('ocayevi_auth') === '1'; }
function doLogin()     { sessionStorage.setItem('ocayevi_auth', '1'); }
function doLogout()    { sessionStorage.removeItem('ocayevi_auth'); }

// ── GÖSTERİM ──────────────────────────────────────────────────────────────
function showLoginPage() {
  getEl('login-page').style.display  = 'flex';
  getEl('admin-page').style.display  = 'none';
  getEl('admin-page').classList.remove('active');
}

function showAdminPage() {
  getEl('login-page').style.display  = 'none';
  getEl('admin-page').style.display  = 'flex';
  getEl('admin-page').classList.add('active');
  loadAdminData();
  bindNav();
  bindSidebar();
  showPanel('dashboard');
}

// ── VERİ ──────────────────────────────────────────────────────────────────
var settings, cats, products, editingProdId;

function loadAdminData() {
  settings = Store.getSettings();
  cats     = Store.getCats();
  products = Store.getProducts();
}

// ── PANEL ─────────────────────────────────────────────────────────────────
var PANEL_TITLES = {
  dashboard: 'Dashboard',
  products:  'Ürün Yönetimi',
  categories:'Kategori Yönetimi',
  settings:  'Ayarlar',
  qr:        'QR Kod'
};

function showPanel(id) {
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-item[data-panel]').forEach(function(b) { b.classList.remove('active'); });

  var panel = getEl('panel-' + id);
  if (panel) panel.classList.add('active');

  var navBtn = document.querySelector('.nav-item[data-panel="' + id + '"]');
  if (navBtn) navBtn.classList.add('active');

  var tt = getEl('topbar-title');
  if (tt) tt.textContent = PANEL_TITLES[id] || '';

  if (id === 'dashboard')  renderDashboard();
  if (id === 'products')   renderProducts();
  if (id === 'categories') renderCategories();
  if (id === 'settings')   renderSettings();
  if (id === 'qr')         renderQR();
}

// ── BAĞLAMALAR ────────────────────────────────────────────────────────────
function bindNav() {
  document.querySelectorAll('.nav-item[data-panel]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      showPanel(btn.dataset.panel);
      closeSidebar();
    });
  });

  var logoutBtn = getEl('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', function() {
    doLogout();
    showLoginPage();
  });

  var gotoMenu = getEl('goto-menu-btn');
  if (gotoMenu) gotoMenu.addEventListener('click', function() {
    window.open('index.html', '_blank');
  });
}

function bindSidebar() {
  var ham     = getEl('hamburger-btn');
  var overlay = getEl('sidebar-overlay');
  var sidebar = getEl('admin-sidebar');
  if (ham) ham.addEventListener('click', function() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  });
  if (overlay) overlay.addEventListener('click', closeSidebar);
}

function closeSidebar() {
  var s = getEl('admin-sidebar');
  var o = getEl('sidebar-overlay');
  if (s) s.classList.remove('open');
  if (o) o.classList.remove('show');
}

// ════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════
function renderDashboard() {
  var elP = getEl('stat-products');   if (elP) elP.textContent = products.length;
  var elC = getEl('stat-categories'); if (elC) elC.textContent = cats.length;
  var elN = getEl('stat-name');       if (elN) elN.textContent = settings.name;

  var tbody = getEl('recent-products-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  var recent = products.slice().reverse().slice(0, 6);
  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-300);padding:32px">Henüz ürün yok.</td></tr>';
    return;
  }
  recent.forEach(function(prod) {
    var cat = cats.find(function(c) { return c.id === prod.categoryId; });
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><div class="td-product">' +
        '<div class="table-img">' +
          (prod.image
            ? '<img src="' + prod.image + '" alt="' + esc(prod.name) + '">'
            : '<span>' + esc((cat && cat.icon) || '🍽️') + '</span>') +
        '</div>' +
        '<div><div class="td-name">' + esc(prod.name) + '</div>' +
        '<div class="td-desc">' + esc(prod.description || '') + '</div></div>' +
      '</div></td>' +
      '<td><span class="badge badge-cat">' + esc((cat && cat.name) || '—') + '</span></td>' +
      '<td><span class="badge badge-price">' + Number(prod.price).toFixed(0) + '₺</span></td>';
    tbody.appendChild(tr);
  });
}

// ════════════════════════════════════════════
// ÜRÜNLER
// ════════════════════════════════════════════
var productFormBound = false;

function renderProducts() {
  buildCatOptions('prod-category');
  if (!productFormBound) { bindProductForm(); productFormBound = true; }
  renderProductTable();
}

function buildCatOptions(selectId) {
  var sel = getEl(selectId);
  if (!sel) return;
  var current = sel.value;
  sel.innerHTML = '<option value="">— Kategori Seç —</option>';
  cats.slice().sort(function(a,b){ return a.order - b.order; }).forEach(function(cat) {
    var opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.icon + ' ' + cat.name;
    sel.appendChild(opt);
  });
  sel.value = current;
}

function bindProductForm() {
  var form      = getEl('product-form');
  var uploadArea = getEl('prod-img-area');
  var fileInput  = getEl('prod-img-input');
  var preview    = getEl('prod-img-preview');

  if (uploadArea) {
    uploadArea.addEventListener('click', function() { if (fileInput) fileInput.click(); });
    uploadArea.addEventListener('dragover', function(e) { e.preventDefault(); uploadArea.classList.add('dragover'); });
    uploadArea.addEventListener('dragleave', function() { uploadArea.classList.remove('dragover'); });
    uploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      var file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) applyImagePreview(file, preview, uploadArea);
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', function() {
      var file = fileInput.files[0];
      if (file) applyImagePreview(file, preview, uploadArea);
    });
  }

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      saveProduct();
    });
  }

  var cancelBtn = getEl('prod-cancel-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', resetProductForm);
}

function applyImagePreview(file, preview, area) {
  fileToB64(file).then(function(b64) {
    if (preview) { preview.src = b64; preview.style.display = 'block'; }
    var content = area && area.querySelector('.upload-content');
    if (content) content.style.display = 'none';
    if (area) area.dataset.imageData = b64;
  });
}

function saveProduct() {
  var name   = getVal('prod-name');
  var price  = getVal('prod-price');
  var catId  = getVal('prod-category');
  var desc   = getVal('prod-desc');
  var badge  = getVal('prod-badge');
  var area   = getEl('prod-img-area');
  var imgData = (area && area.dataset.imageData) ? area.dataset.imageData : '';

  if (!name)  { toast('Ürün adı zorunludur.', 'error'); return; }
  if (!price) { toast('Fiyat zorunludur.', 'error'); return; }
  if (!catId) { toast('Kategori seçiniz.', 'error'); return; }

  if (editingProdId) {
    var idx = products.findIndex(function(p) { return p.id === editingProdId; });
    if (idx !== -1) {
      products[idx].name        = name;
      products[idx].price       = Number(price);
      products[idx].categoryId  = catId;
      products[idx].description = desc;
      products[idx].badge       = badge;
      if (imgData) products[idx].image = imgData;
      toast('Ürün güncellendi!');
    }
  } else {
    products.push({ id: uid(), categoryId: catId, name: name, price: Number(price), description: desc, badge: badge, image: imgData });
    toast('Ürün eklendi!');
  }

  Store.saveProducts(products);
  resetProductForm();
  renderProductTable();
  renderDashboard();
}

function resetProductForm() {
  editingProdId = null;
  var form = getEl('product-form');
  if (form) form.reset();

  var area    = getEl('prod-img-area');
  var preview = getEl('prod-img-preview');
  if (area)    { area.dataset.imageData = ''; }
  if (preview) { preview.style.display = 'none'; preview.src = ''; }

  var content = area && area.querySelector('.upload-content');
  if (content) content.style.display = '';

  var saveBtn   = getEl('prod-save-btn');
  var cancelBtn = getEl('prod-cancel-btn');
  if (saveBtn)   saveBtn.textContent = '💾 Ürün Ekle';
  if (cancelBtn) cancelBtn.style.display = 'none';
}

function renderProductTable() {
  var tbody = getEl('products-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-300);padding:40px">Henüz ürün eklenmedi.</td></tr>';
    return;
  }

  products.forEach(function(prod) {
    var cat = cats.find(function(c) { return c.id === prod.categoryId; });
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><div class="td-product">' +
        '<div class="table-img">' +
          (prod.image
            ? '<img src="' + prod.image + '" alt="' + esc(prod.name) + '">'
            : '<span style="font-size:18px">' + esc((cat && cat.icon) || '🍽️') + '</span>') +
        '</div>' +
        '<div><div class="td-name">' + esc(prod.name) + '</div>' +
        '<div class="td-desc">' + esc(prod.description || '') + '</div></div>' +
      '</div></td>' +
      '<td><span class="badge badge-cat">' + esc((cat && cat.name) || '—') + '</span></td>' +
      '<td><span class="badge badge-price">' + Number(prod.price).toFixed(0) + '₺</span></td>' +
      '<td>' + (prod.badge ? '<span class="badge badge-cat">' + esc(prod.badge) + '</span>' : '—') + '</td>' +
      '<td><div class="actions-cell">' +
        '<button class="btn btn-success" onclick="editProduct(\'' + prod.id + '\')">✏️ Düzenle</button>' +
        '<button class="btn btn-danger"  onclick="deleteProduct(\'' + prod.id + '\')">🗑️ Sil</button>' +
      '</div></td>';
    tbody.appendChild(tr);
  });
}

function editProduct(id) {
  var prod = products.find(function(p) { return p.id === id; });
  if (!prod) return;
  editingProdId = id;

  setVal('prod-name',     prod.name);
  setVal('prod-price',    prod.price);
  setVal('prod-category', prod.categoryId);
  setVal('prod-desc',     prod.description || '');
  setVal('prod-badge',    prod.badge || '');

  var area    = getEl('prod-img-area');
  var preview = getEl('prod-img-preview');
  if (prod.image && area && preview) {
    area.dataset.imageData = prod.image;
    preview.src = prod.image;
    preview.style.display = 'block';
    var content = area.querySelector('.upload-content');
    if (content) content.style.display = 'none';
  }

  var saveBtn   = getEl('prod-save-btn');
  var cancelBtn = getEl('prod-cancel-btn');
  if (saveBtn)   saveBtn.textContent = '💾 Güncelle';
  if (cancelBtn) cancelBtn.style.display = '';

  var formCard = getEl('product-form-card') || getEl('product-form');
  if (formCard) formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteProduct(id) {
  if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
  products = products.filter(function(p) { return p.id !== id; });
  Store.saveProducts(products);
  renderProductTable();
  renderDashboard();
  toast('Ürün silindi.');
}

// ════════════════════════════════════════════
// KATEGORİLER
// ════════════════════════════════════════════
var catFormBound = false;

function renderCategories() {
  renderCategoryList();
  if (!catFormBound) { bindCategoryForm(); catFormBound = true; }
}

function bindCategoryForm() {
  var form = getEl('category-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var name = getVal('cat-name');
    var icon = getVal('cat-icon') || '🍽️';
    if (!name) { toast('Kategori adı zorunludur.', 'error'); return; }
    cats.push({ id: uid(), name: name, icon: icon, order: cats.length + 1 });
    Store.saveCats(cats);
    form.reset();
    renderCategoryList();
    buildCatOptions('prod-category');
    toast('Kategori eklendi!');
  });
}

function renderCategoryList() {
  var list = getEl('category-list');
  if (!list) return;
  list.innerHTML = '';

  if (cats.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:var(--text-300);padding:24px">Henüz kategori yok.</p>';
    return;
  }

  cats.slice().sort(function(a,b){ return a.order - b.order; }).forEach(function(cat) {
    var count = products.filter(function(p) { return p.categoryId === cat.id; }).length;
    var item = document.createElement('div');
    item.className = 'cat-item';
    item.innerHTML =
      '<div class="cat-item-icon">' + esc(cat.icon) + '</div>' +
      '<div class="cat-item-name">' + esc(cat.name) + '</div>' +
      '<div class="cat-item-count">' + count + ' ürün</div>' +
      '<div class="actions-cell">' +
        '<button class="btn btn-danger" onclick="deleteCategory(\'' + cat.id + '\')">🗑️ Sil</button>' +
      '</div>';
    list.appendChild(item);
  });
}

function deleteCategory(id) {
  var count = products.filter(function(p) { return p.categoryId === id; }).length;
  var msg = count > 0
    ? 'Bu kategoride ' + count + ' ürün var. Silmek istediğinizden emin misiniz?'
    : 'Bu kategoriyi silmek istediğinizden emin misiniz?';
  if (!confirm(msg)) return;
  cats = cats.filter(function(c) { return c.id !== id; });
  Store.saveCats(cats);
  renderCategoryList();
  buildCatOptions('prod-category');
  renderDashboard();
  toast('Kategori silindi.');
}

// ════════════════════════════════════════════
// AYARLAR
// ════════════════════════════════════════════
var settingsFormBound = false;
var logoFormBound = false;
var passFormBound = false;

function renderSettings() {
  setVal('set-name',     settings.name);
  setVal('set-subtitle', settings.subtitle);
  setVal('set-phone',    settings.phone);
  setVal('set-address',  settings.address);
  setVal('set-hours',    settings.hours);

  var logoPrev = getEl('logo-preview');
  if (logoPrev && settings.logo) {
    logoPrev.innerHTML = '<img src="' + settings.logo + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">';
  }

  if (!settingsFormBound) { bindSettingsForm(); settingsFormBound = true; }
  if (!logoFormBound)     { bindLogoUpload();   logoFormBound = true; }
  if (!passFormBound)     { bindPassForm();      passFormBound = true; }
}

function bindSettingsForm() {
  var form = getEl('settings-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    settings.name     = getVal('set-name') || 'Onur Çay Evi';
    settings.subtitle = getVal('set-subtitle');
    settings.phone    = getVal('set-phone');
    settings.address  = getVal('set-address');
    settings.hours    = getVal('set-hours');
    Store.saveSettings(settings);
    toast('Ayarlar kaydedildi!');
  });
}

function bindLogoUpload() {
  var input = getEl('logo-file-input');
  if (!input) return;
  input.addEventListener('change', function() {
    var file = input.files[0];
    if (!file) return;
    fileToB64(file).then(function(b64) {
      settings.logo = b64;
      Store.saveSettings(settings);
      var prev = getEl('logo-preview');
      if (prev) prev.innerHTML = '<img src="' + b64 + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">';
      toast('Logo güncellendi!');
    });
  });
}

function bindPassForm() {
  var form = getEl('password-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var oldP  = getVal('old-pass');
    var newP  = getVal('new-pass');
    var newP2 = getVal('new-pass2');
    if (oldP !== ADMIN_PASS)       { toast('Mevcut şifre yanlış.', 'error'); return; }
    if (!newP || newP.length < 4)  { toast('Şifre en az 4 karakter olmalı.', 'error'); return; }
    if (newP !== newP2)            { toast('Şifreler eşleşmiyor.', 'error'); return; }
    ADMIN_PASS = newP;
    toast('Şifre güncellendi!');
    form.reset();
  });
}

// ════════════════════════════════════════════
// QR KOD
// ════════════════════════════════════════════
function renderQR() {
  var container = getEl('qr-canvas-container');
  if (!container) return;
  container.innerHTML = '';

  var base = window.location.origin + window.location.pathname.replace('admin.html', '');
  var url  = base + 'index.html';

  var urlDisplay = getEl('qr-url-display');
  if (urlDisplay) { urlDisplay.href = url; urlDisplay.textContent = url; }

  // QRCode kütüphanesi hazır değilse bekle
  function tryGenerateQR(attempts) {
    if (typeof QRCode !== 'undefined') {
      try {
        new QRCode(container, {
          text: url, width: 240, height: 240,
          colorDark: '#1c1108', colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      } catch(e) { useFallbackQR(container, url); }
    } else if (attempts > 0) {
      setTimeout(function() { tryGenerateQR(attempts - 1); }, 300);
    } else {
      useFallbackQR(container, url);
    }
  }

  function useFallbackQR(c, u) {
    var img = document.createElement('img');
    img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=' + encodeURIComponent(u) + '&color=1c1108&bgcolor=ffffff&margin=10';
    img.alt = 'QR Kod';
    img.style.cssText = 'width:240px;height:240px;display:block';
    c.appendChild(img);
  }

  tryGenerateQR(10);

  var dlBtn = getEl('qr-download-btn');
  if (dlBtn) {
    dlBtn.onclick = function() {
      var canvas = container.querySelector('canvas');
      if (canvas) {
        var a = document.createElement('a');
        a.download = 'onur-cayevi-qr.png';
        a.href = canvas.toDataURL();
        a.click();
      } else {
        var img = container.querySelector('img');
        if (img) window.open(img.src, '_blank');
      }
    };
  }
}

// ════════════════════════════════════════════
// GLOBAL (inline onclick için)
// ════════════════════════════════════════════
window.editProduct   = editProduct;
window.deleteProduct = deleteProduct;
window.deleteCategory= deleteCategory;
window.Admin = { showPanel: showPanel };

// ════════════════════════════════════════════
// BAŞLAT
// ════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
  // Login form
  var loginForm = getEl('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var user = getVal('login-user');
      var pass = getVal('login-pass');
      var errEl = getEl('login-error');

      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        doLogin();
        showAdminPage();
      } else {
        if (errEl) {
          errEl.textContent = 'Kullanıcı adı veya şifre hatalı.';
          errEl.classList.add('show');
          setTimeout(function() { errEl.classList.remove('show'); }, 3000);
        }
      }
    });
  }

  // Zaten giriş yapılmış mı?
  if (isLoggedIn()) {
    showAdminPage();
  } else {
    showLoginPage();
  }
});
