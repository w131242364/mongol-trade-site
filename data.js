/**
 * data.js — 直接浏览器打开时使用的本地数据层
 * 数据优先保存到 localStorage；如果浏览器限制 file:// 存储，则回退到内存。
 */

var DB = (function () {
  var KEY_CATEGORIES = 'mt_categories';
  var KEY_PRODUCTS = 'mt_products';

  var DEFAULT_CATEGORIES = [
    {
      id: 'cat_vehicle_radio',
      name_zh: '车载电台（车台）',
      name_mn: 'Машины станц',
      icon: '🚗',
      color: '#1a5a9e',
      color2: '#2d7fd4',
      desc_zh: '长距离车载通讯设备，适合车队、物流、越野等场景，信号稳定，通话清晰。',
      desc_mn: 'Урт зайд холбоо барих машин дээр суурилуулдаг төхөөрөмж, машин багц, тээвэр логистик, оффроод зэрэг хэрэглээнд тохиромжтой, тогтвортой дохио, тод дуу хоолой。',
      features_zh: ['VHF / UHF 双频段可选', '大功率输出，远距离通讯', '支持中继台组网'],
      features_mn: ['VHF / UHF давтамж сонголт', 'Өндөр хүчин чадал, урт зайд холбоо', 'Дамжуулах станцтай холбогдох боломжтой']
    },
    {
      id: 'cat_walkie_talkie',
      name_zh: '对讲机',
      name_mn: 'Гар станц',
      icon: '📻',
      color: '#0f3d6e',
      color2: '#1a5a9e',
      desc_zh: '便携式手持对讲机，适用于工地、酒店、安保、户外活动等场景，轻便耐用。',
      desc_mn: 'Зөөврийн гар станц, барилгын талбай, зочид буудал, хамгаалалт, гадаад үйл ажиллагаа зэрэг хэрэглээнд тохиромжтой, хөнгөн боловч бат бөх。',
      features_zh: ['超薄机身，轻便易携', '长续航电池，支持一整天使用', '防水防尘设计'],
      features_mn: ['Нимгэн бие, хөнгөн зөөврийн', 'Урт наслалттай баттерей, бүтэн өдөр ашиглах', 'Ус, тоосноос хамгаалсан дизайны']
    },
    {
      id: 'cat_camera',
      name_zh: '监控摄像头',
      name_mn: 'Хяналтын камер',
      icon: '📹',
      color: '#ff7a18',
      color2: '#ff9d4d',
      desc_zh: '高清安防监控摄像头，支持夜视、远程查看，适用于商铺、仓库、车辆等场景。',
      desc_mn: 'Өндөр нарийвчлалтай аюулгүй байдлын хяналтын камер, шөнийн дүрс, алсаас харах боломжтой, дэлгүүр, агуулах, машин зэрэг хэрэглээнд тохиромжтой。',
      features_zh: ['1080P / 4K 高清画质', '红外夜视，24小时监控', '手机APP远程实时查看'],
      features_mn: ['1080P / 4K өндөр нарийвчлалт', 'Инфракрас шөнийн дүрс, 24 цаг хяналт', 'Утасны апп-аар алсаас шууд харах']
    }
  ];

  var DEFAULT_PRODUCTS = [
    {
      id: 'p001',
      category: 'cat_vehicle_radio',
      name_zh: 'VHF 车载电台 KT-8900',
      name_mn: 'VHF Машины станц KT-8900',
      price: '¥1,280',
      image: '🚗',
      desc_zh: 'VHF 双段车台，25W 大功率，支持跨段收发，适合车队长途通讯。',
      desc_mn: 'VHF хос давтамжтай машин станц, 25W өндөр хүчин чадал, давтамж хооронд шилжих боломжтой, урт зайд холбоонд тохиромжтой。'
    },
    {
      id: 'p002',
      category: 'cat_walkie_talkie',
      name_zh: '数字对讲机 Baofeng UV-5R',
      name_mn: 'Тоон гар станц Baofeng UV-5R',
      price: '¥120',
      image: '📻',
      desc_zh: '经典双段对讲机，5W 功率，1800mAh 电池，FM 收音，性价比之选。',
      desc_mn: 'Сонгодог хос давтамжтай гар станц, 5W хүчин чадал, 1800mAh баттерей, FM радио, өндөр чанартай сонголт。'
    },
    {
      id: 'p003',
      category: 'cat_camera',
      name_zh: '高清球机摄像头 HIK-DS2CD',
      name_mn: 'Өндөр нарийвчлалтай PTZ камер HIK-DS2CD',
      price: '¥450',
      image: '📹',
      desc_zh: '4K 球形摄像头，20倍光学变焦，红外夜视 100 米，支持手机远程。',
      desc_mn: '4K PTZ камер, 20x оптик zoom, инфракар шөнийн дүрс 100 метр, утаснаас алсаас харах боломжтой。'
    }
  ];

  var memoryStore = {
    [KEY_CATEGORIES]: null,
    [KEY_PRODUCTS]: null
  };

  function getStorage() {
    try {
      var testKey = '__mt_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    } catch (e) {
      return null;
    }
  }

  var storage = getStorage();

  function read(key, fallback) {
    if (storage) {
      var raw = storage.getItem(key);
      if (raw) {
        try { return JSON.parse(raw); } catch (e) { }
      }
    }
    if (memoryStore[key]) return JSON.parse(JSON.stringify(memoryStore[key]));
    write(key, fallback);
    return JSON.parse(JSON.stringify(fallback));
  }

  function write(key, value) {
    var payload = JSON.stringify(value);
    if (storage) {
      storage.setItem(key, payload);
    } else {
      memoryStore[key] = JSON.parse(payload);
    }
  }

  function getCategories() {
    return read(KEY_CATEGORIES, DEFAULT_CATEGORIES);
  }

  function getProducts() {
    return read(KEY_PRODUCTS, DEFAULT_PRODUCTS);
  }

  function addCategory(cat) {
    var cats = getCategories();
    var item = Object.assign({}, cat);
    item.id = item.id || ('cat_' + Date.now());
    cats.push(item);
    write(KEY_CATEGORIES, cats);
    return item;
  }

  function updateCategory(id, data) {
    var cats = getCategories();
    for (var i = 0; i < cats.length; i++) {
      if (cats[i].id === id) {
        cats[i] = Object.assign({}, cats[i], data, { id: id });
        break;
      }
    }
    write(KEY_CATEGORIES, cats);
    return true;
  }

  function deleteCategory(id) {
    var cats = getCategories().filter(function (c) { return c.id !== id; });
    var products = getProducts().filter(function (p) { return p.category !== id; });
    write(KEY_CATEGORIES, cats);
    write(KEY_PRODUCTS, products);
    return true;
  }

  function addProduct(product) {
    var products = getProducts();
    var item = Object.assign({}, product);
    item.id = item.id || ('p_' + Date.now());
    products.push(item);
    write(KEY_PRODUCTS, products);
    return item;
  }

  function updateProduct(id, data) {
    var products = getProducts();
    for (var i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        products[i] = Object.assign({}, products[i], data, { id: id });
        break;
      }
    }
    write(KEY_PRODUCTS, products);
    return true;
  }

  function deleteProduct(id) {
    var products = getProducts().filter(function (p) { return p.id !== id; });
    write(KEY_PRODUCTS, products);
    return true;
  }

  function resetAll() {
    if (storage) {
      storage.removeItem(KEY_CATEGORIES);
      storage.removeItem(KEY_PRODUCTS);
    }
    memoryStore[KEY_CATEGORIES] = null;
    memoryStore[KEY_PRODUCTS] = null;
    return true;
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
    resetAll: resetAll
  };
})();
