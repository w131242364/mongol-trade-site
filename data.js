/**
 * data.js — 前后台共享的数据层
 * 优先调用线上 API；如果 API 不可用，则回退到 localStorage。
 */

var DB = (function () {
  var API_BASE = '/api';
  var KEY_CATEGORIES = 'mt_categories_fallback';
  var KEY_PRODUCTS = 'mt_products_fallback';
  var KEY_PASSWORD = 'mt_admin_password';
  var memory = { categories: null, products: null };

  function canUseStorage() {
    try {
      var k = '__mt_test__';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  var storageEnabled = canUseStorage();

  function readFallback(key, defaults) {
    if (storageEnabled) {
      var raw = window.localStorage.getItem(key);
      if (raw) {
        try { return JSON.parse(raw); } catch (e) { }
      }
    }
    if (memory[key]) return JSON.parse(JSON.stringify(memory[key]));
    writeFallback(key, defaults);
    return JSON.parse(JSON.stringify(defaults));
  }

  function writeFallback(key, value) {
    if (storageEnabled) {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      memory[key] = JSON.parse(JSON.stringify(value));
    }
  }

  function clearFallback() {
    if (storageEnabled) {
      window.localStorage.removeItem(KEY_CATEGORIES);
      window.localStorage.removeItem(KEY_PRODUCTS);
      window.localStorage.removeItem(KEY_PASSWORD);
    }
    memory.categories = null;
    memory.products = null;
  }

  function request(path, options) {
    return fetch(API_BASE + path, Object.assign({
      headers: Object.assign({ 'Content-Type': 'application/json' }, options && options.headers ? options.headers : {})
    }, options || {})).then(function (res) {
      if (!res.ok) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          var err = new Error(body.error || ('Request failed: ' + res.status));
          err.status = res.status;
          throw err;
        });
      }
      return res.json();
    });
  }

  async function getCategories() {
    try {
      return await request('/categories');
    } catch (e) {
      return readFallback(KEY_CATEGORIES, []);
    }
  }

  async function getProducts() {
    try {
      return await request('/products');
    } catch (e) {
      return readFallback(KEY_PRODUCTS, []);
    }
  }

  function setFallbackData(categories, products) {
    writeFallback(KEY_CATEGORIES, categories || []);
    writeFallback(KEY_PRODUCTS, products || []);
  }

  async function addCategory(cat, password) {
    try {
      return await request('/categories', { method: 'POST', headers: { 'x-admin-password': password || '' }, body: JSON.stringify(cat) });
    } catch (e) {
      var cats = readFallback(KEY_CATEGORIES, []);
      cat.id = cat.id || ('cat_' + Date.now());
      cats.push(cat);
      writeFallback(KEY_CATEGORIES, cats);
      return cat;
    }
  }

  async function updateCategory(id, cat, password) {
    try {
      return await request('/categories?id=' + encodeURIComponent(id), { method: 'PUT', headers: { 'x-admin-password': password || '' }, body: JSON.stringify(cat) });
    } catch (e) {
      var cats = readFallback(KEY_CATEGORIES, []);
      cats = cats.map(function (c) { return c.id === id ? Object.assign({}, c, cat, { id: id }) : c; });
      writeFallback(KEY_CATEGORIES, cats);
      return true;
    }
  }

  async function deleteCategory(id, password) {
    try {
      return await request('/categories?id=' + encodeURIComponent(id), { method: 'DELETE', headers: { 'x-admin-password': password || '' } });
    } catch (e) {
      var cats = readFallback(KEY_CATEGORIES, []).filter(function (c) { return c.id !== id; });
      var products = readFallback(KEY_PRODUCTS, []).filter(function (p) { return p.category !== id; });
      writeFallback(KEY_CATEGORIES, cats);
      writeFallback(KEY_PRODUCTS, products);
      return true;
    }
  }

  async function addProduct(product, password) {
    try {
      return await request('/products', { method: 'POST', headers: { 'x-admin-password': password || '' }, body: JSON.stringify(product) });
    } catch (e) {
      var products = readFallback(KEY_PRODUCTS, []);
      product.id = product.id || ('p_' + Date.now());
      products.push(product);
      writeFallback(KEY_PRODUCTS, products);
      return product;
    }
  }

  async function updateProduct(id, product, password) {
    try {
      return await request('/products?id=' + encodeURIComponent(id), { method: 'PUT', headers: { 'x-admin-password': password || '' }, body: JSON.stringify(product) });
    } catch (e) {
      var products = readFallback(KEY_PRODUCTS, []).map(function (p) { return p.id === id ? Object.assign({}, p, product, { id: id }) : p; });
      writeFallback(KEY_PRODUCTS, products);
      return true;
    }
  }

  async function deleteProduct(id, password) {
    try {
      return await request('/products?id=' + encodeURIComponent(id), { method: 'DELETE', headers: { 'x-admin-password': password || '' } });
    } catch (e) {
      var products = readFallback(KEY_PRODUCTS, []).filter(function (p) { return p.id !== id; });
      writeFallback(KEY_PRODUCTS, products);
      return true;
    }
  }

  async function resetAll(password) {
    try {
      return await request('/reset', { method: 'POST', headers: { 'x-admin-password': password || '' } });
    } catch (e) {
      clearFallback();
      return true;
    }
  }

  async function init(password) {
    try {
      return await request('/init', { method: 'POST', headers: { 'x-admin-password': password || '' } });
    } catch (e) {
      return { ok: false };
    }
  }

  function saveAdminPassword(password) {
    if (!password) return;
    if (storageEnabled) window.localStorage.setItem(KEY_PASSWORD, password);
  }

  function getAdminPassword() {
    if (!storageEnabled) return '';
    return window.localStorage.getItem(KEY_PASSWORD) || '';
  }

  function getFallbackCategories() {
    return readFallback(KEY_CATEGORIES, []);
  }

  function getFallbackProducts() {
    return readFallback(KEY_PRODUCTS, []);
  }

  return {
    getCategories: getCategories,
    getProducts: getProducts,
    addCategory: addCategory,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory,
    addProduct: addProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    resetAll: resetAll,
    init: init,
    setFallbackData: setFallbackData,
    getFallbackCategories: getFallbackCategories,
    getFallbackProducts: getFallbackProducts,
    saveAdminPassword: saveAdminPassword,
    getAdminPassword: getAdminPassword
  };
})();
