/* =============================================
   ONUR ÇAY EVİ — MENÜ JS
   ============================================= */

var MenuStore = {
  K: { settings: 'ocayevi_settings', cats: 'ocayevi_categories', products: 'ocayevi_products' },
  defaultSettings: { name:'Onur Çay Evi', subtitle:'Geleneksel Türk Çayı', phone:'', address:'', hours:'', logo:'' },
  defaultCats: [
    { id:'cat_1', name:'Çaylar',          icon:'🍵', order:1 },
    { id:'cat_2', name:'Kahveler',         icon:'☕', order:2 },
    { id:'cat_3', name:'Soğuk İçecekler', icon:'🥤', order:3 },
    { id:'cat_4', name:'Atıştırmalıklar', icon:'🍪', order:4 }
  ],
  defaultProducts: [
    { id:'p_1',  categoryId:'cat_1', name:'Türk Çayı',       price:15, description:'Doğu Karadeniz\'den özel seçim demlik çayımız.', image:'', badge:'' },
    { id:'p_2',  categoryId:'cat_1', name:'Bitki Çayı',       price:25, description:'Nane, papatya, ıhlamur karışımı aromalı çay.', image:'', badge:'Popüler' },
    { id:'p_3',  categoryId:'cat_1', name:'Earl Grey',         price:30, description:'Bergamot aromalı özel çay karışımı.', image:'', badge:'' },
    { id:'p_4',  categoryId:'cat_1', name:'Yeşil Çay',         price:25, description:'Japon tarzı hafif yeşil çay.', image:'', badge:'' },
    { id:'p_5',  categoryId:'cat_2', name:'Türk Kahvesi',       price:35, description:'Geleneksel yöntemle hazırlanan köpüklü Türk kahvesi.', image:'', badge:'Özel' },
    { id:'p_6',  categoryId:'cat_2', name:'Filtre Kahve',       price:40, description:'Öğütülmüş taze filtre kahve, sade veya sütlü.', image:'', badge:'' },
    { id:'p_7',  categoryId:'cat_2', name:'Sütlü Kahve',        price:45, description:'Kremalı köpüklü süt ve espresso karışımı.', image:'', badge:'Popüler' },
    { id:'p_8',  categoryId:'cat_3', name:'Limonata',           price:35, description:'Taze sıkılmış limon, nane ile limonata.', image:'', badge:'' },
    { id:'p_9',  categoryId:'cat_3', name:'Ayran',              price:20, description:'Ev yapımı tuzsuz ya da tuzlu ayran.', image:'', badge:'' },
    { id:'p_10', categoryId:'cat_3', name:'Meyve Suyu',         price:30, description:'Portakal, elma veya vişne meyve suyu.', image:'', badge:'' },
    { id:'p_11', categoryId:'cat_4', name:'Simit',              price:15, description:'Taze fırın simidi, susam kaplı.', image:'', badge:'' },
    { id:'p_12', categoryId:'cat_4', name:'Poğaça',             price:20, description:'Peynirli ya da zeytinli ev yapımı poğaça.', image:'', badge:'Popüler' },
    { id:'p_13', categoryId:'cat_4', name:'Kurabiye',           price:18, description:'Çeşitli ev yapımı kurabiyeler, günlük taze.', image:'', badge:'' }
  ],
  get: function(key, def) {
    try { var r = localStorage.getItem(key); return r ? JSON.parse(r) : def; }
    catch(e) { return def; }
  },
  getSettings:  function() { return this.get(this.K.settings, Object.assign({}, this.defaultSettings)); },
  getCats:      function() { return this.get(this.K.cats,     this.defaultCats.slice()); },
  getProducts:  function() { return this.get(this.K.products, this.defaultProducts.slice()); }
};

function mEsc(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

var Menu = {
  settings:  null,
  cats:      [],
  products:  [],
  activeCat: 'all',
  query:     '',

  init: function() {
    this.settings = MenuStore.getSettings();
    this.cats     = MenuStore.getCats();
    this.products = MenuStore.getProducts();
    this.applySettings();
    this.buildCategoryNav();
    this.renderMenu();
    this.bindSearch();
  },

  applySettings: function() {
    var s = this.settings;

    // Başlık
    document.querySelectorAll('[data-setting="name"]').forEach(function(el) { el.textContent = s.name; });
    document.querySelectorAll('[data-setting="subtitle"]').forEach(function(el) { el.textContent = s.subtitle || ''; });
    document.title = s.name + ' — Menü';

    // Logo
    if (s.logo) {
      var logoEl = document.getElementById('logo-icon');
      if (logoEl) logoEl.innerHTML = '<img src="' + s.logo + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%" alt="Logo">';
    }

    // Hero bilgi
    if (s.phone) {
      var pw = document.getElementById('hero-phone');
      var pw2 = document.getElementById('hero-phone-wrap');
      if (pw) pw.textContent = s.phone;
      if (pw2) pw2.style.display = 'flex';
    }
    if (s.address) {
      var aw = document.getElementById('hero-address');
      var aw2 = document.getElementById('hero-addr-wrap');
      if (aw) aw.textContent = s.address;
      if (aw2) aw2.style.display = 'flex';
    }
    if (s.hours) {
      var hw = document.getElementById('hero-hours');
      var hw2 = document.getElementById('hero-hours-wrap');
      if (hw) hw.textContent = s.hours;
      if (hw2) hw2.style.display = 'flex';
    }

    // Footer
    var fb = document.getElementById('footer-brand');
    if (fb) fb.textContent = s.name;

    var fc = document.getElementById('footer-contact');
    if (fc) {
      fc.innerHTML = '';
      if (s.phone) {
        var a = document.createElement('a');
        a.href = 'tel:' + s.phone.replace(/\s/g,'');
        a.innerHTML = '📞 ' + mEsc(s.phone);
        fc.appendChild(a);
      }
      if (s.address) {
        var sp = document.createElement('span');
        sp.innerHTML = '📍 ' + mEsc(s.address);
        fc.appendChild(sp);
      }
      if (s.hours) {
        var sp2 = document.createElement('span');
        sp2.innerHTML = '🕐 ' + mEsc(s.hours);
        fc.appendChild(sp2);
      }
    }
  },

  buildCategoryNav: function() {
    var nav = document.getElementById('category-nav');
    if (!nav) return;
    nav.innerHTML = '';
    var self = this;

    // Tümü
    var allBtn = document.createElement('button');
    allBtn.className = 'cat-tab active';
    allBtn.dataset.catId = 'all';
    allBtn.innerHTML = '🍽️ Tümü';
    allBtn.addEventListener('click', function() { self.filterCat('all', allBtn); });
    nav.appendChild(allBtn);

    // Kategoriler
    this.cats.slice().sort(function(a,b){ return a.order - b.order; }).forEach(function(cat) {
      var btn = document.createElement('button');
      btn.className = 'cat-tab';
      btn.dataset.catId = cat.id;
      btn.innerHTML = mEsc(cat.icon) + ' ' + mEsc(cat.name);
      btn.addEventListener('click', function() { self.filterCat(cat.id, btn); });
      nav.appendChild(btn);
    });
  },

  filterCat: function(catId, btnEl) {
    this.activeCat = catId;
    this.query = '';
    var inp = document.getElementById('search-input');
    if (inp) inp.value = '';

    document.querySelectorAll('.cat-tab').forEach(function(b) { b.classList.remove('active'); });
    if (btnEl) btnEl.classList.add('active');

    document.querySelectorAll('.menu-section').forEach(function(s) {
      s.classList.toggle('hidden', catId !== 'all' && s.dataset.catId !== catId);
    });
    this.checkEmpty();
  },

  renderMenu: function() {
    var container = document.getElementById('menu-container');
    if (!container) return;
    container.innerHTML = '';
    var self = this;

    this.cats.slice().sort(function(a,b){ return a.order - b.order; }).forEach(function(cat, idx) {
      var prods = self.products.filter(function(p) { return p.categoryId === cat.id; });
      if (prods.length === 0) return;

      var section = document.createElement('section');
      section.className = 'menu-section';
      section.dataset.catId = cat.id;
      section.style.animationDelay = (idx * 0.07) + 's';

      var title = document.createElement('h2');
      title.className = 'section-title';
      title.textContent = cat.icon + '  ' + cat.name;

      var grid = document.createElement('div');
      grid.className = 'product-grid';

      prods.forEach(function(prod, pIdx) {
        var card = self.makeCard(prod, cat, pIdx);
        grid.appendChild(card);
      });

      section.appendChild(title);
      section.appendChild(grid);
      container.appendChild(section);
    });

    this.checkEmpty();
  },

  makeCard: function(prod, cat, idx) {
    var card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.search = (prod.name + ' ' + (prod.description || '')).toLowerCase();
    card.style.animationDelay = (idx * 0.05) + 's';

    var imgHtml = prod.image
      ? '<img class="card-image" src="' + prod.image + '" alt="' + mEsc(prod.name) + '" loading="lazy">'
      : '<div class="card-image-placeholder">' + mEsc(cat.icon) + '</div>';

    var badgeHtml = prod.badge
      ? '<span class="card-badge">' + mEsc(prod.badge) + '</span>'
      : '';

    var descHtml = prod.description
      ? '<p class="card-desc">' + mEsc(prod.description) + '</p>'
      : '';

    card.innerHTML =
      '<div class="card-image-wrap">' + imgHtml + badgeHtml + '</div>' +
      '<div class="card-body">' +
        '<h3 class="card-name">' + mEsc(prod.name) + '</h3>' +
        descHtml +
        '<div class="card-footer">' +
          '<span class="card-price">' + Number(prod.price).toFixed(0) + '<span class="card-price-currency">₺</span></span>' +
          '<span class="card-tag">' + mEsc(cat.name) + '</span>' +
        '</div>' +
      '</div>';

    return card;
  },

  bindSearch: function() {
    var inp  = document.getElementById('search-input');
    var self = this;
    if (!inp) return;
    inp.addEventListener('input', function() {
      self.query = inp.value.trim().toLowerCase();
      self.runSearch();
    });
  },

  runSearch: function() {
    var q = this.query;
    var self = this;

    if (!q) {
      document.querySelectorAll('.product-card').forEach(function(c) { c.style.display = ''; });
      this.filterCat(this.activeCat, document.querySelector('.cat-tab[data-cat-id="' + this.activeCat + '"]'));
      document.querySelectorAll('.cat-tab').forEach(function(b) { b.classList.toggle('active', b.dataset.catId === self.activeCat); });
      return;
    }

    document.querySelectorAll('.menu-section').forEach(function(s) { s.classList.remove('hidden'); });
    document.querySelectorAll('.cat-tab').forEach(function(b) { b.classList.remove('active'); });

    var anyVisible = false;
    document.querySelectorAll('.product-card').forEach(function(card) {
      var match = card.dataset.search.indexOf(q) !== -1;
      card.style.display = match ? '' : 'none';
      if (match) anyVisible = true;
    });

    document.querySelectorAll('.menu-section').forEach(function(section) {
      var hasVisible = false;
      section.querySelectorAll('.product-card').forEach(function(c) { if (c.style.display !== 'none') hasVisible = true; });
      section.classList.toggle('hidden', !hasVisible);
    });

    var nr = document.getElementById('no-results');
    if (nr) nr.classList.toggle('visible', !anyVisible);
  },

  checkEmpty: function() {
    var nr = document.getElementById('no-results');
    if (!nr) return;
    var visibleSecs = document.querySelectorAll('.menu-section:not(.hidden)');
    nr.classList.toggle('visible', visibleSecs.length === 0);
  }
};

document.addEventListener('DOMContentLoaded', function() { Menu.init(); });
