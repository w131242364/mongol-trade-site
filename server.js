const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');
const PORT = process.env.PORT || 3000;

const DEFAULT_STATE = {
  categories: [
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
  ],
  products: [
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
  ]
};

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STATE, null, 2), 'utf8');
}

function readState() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const state = JSON.parse(raw);
    return {
      categories: Array.isArray(state.categories) ? state.categories : [],
      products: Array.isArray(state.products) ? state.products : []
    };
  } catch (err) {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}

function writeState(state) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf8');
}

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function serveFile(res, filePath) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml'
  };
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; if (data.length > 1e6) req.destroy(); });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

function withId(item, prefix) {
  if (!item.id) item.id = prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  return item;
}

function matchIdPath(urlPath, base) {
  if (!urlPath.startsWith(base + '/')) return null;
  return decodeURIComponent(urlPath.slice(base.length + 1));
}

async function handleApi(req, res, pathname) {
  const state = readState();

  if (req.method === 'GET' && pathname === '/api/categories') {
    return json(res, 200, state.categories);
  }
  if (req.method === 'GET' && pathname === '/api/products') {
    return json(res, 200, state.products);
  }
  if (req.method === 'POST' && pathname === '/api/reset') {
    writeState(JSON.parse(JSON.stringify(DEFAULT_STATE)));
    return json(res, 200, { ok: true });
  }

  if (req.method === 'POST' && pathname === '/api/categories') {
    const body = withId(await parseBody(req), 'cat');
    state.categories.push(body);
    writeState(state);
    return json(res, 200, body);
  }

  const categoryId = matchIdPath(pathname, '/api/categories');
  if (categoryId) {
    const index = state.categories.findIndex(c => c.id === categoryId);
    if (index === -1) return json(res, 404, { error: 'Category not found' });
    if (req.method === 'PUT') {
      const body = await parseBody(req);
      state.categories[index] = Object.assign({}, state.categories[index], body, { id: categoryId });
      writeState(state);
      return json(res, 200, state.categories[index]);
    }
    if (req.method === 'DELETE') {
      state.categories.splice(index, 1);
      state.products = state.products.filter(p => p.category !== categoryId);
      writeState(state);
      return json(res, 200, { ok: true });
    }
  }

  if (req.method === 'POST' && pathname === '/api/products') {
    const body = withId(await parseBody(req), 'p');
    state.products.push(body);
    writeState(state);
    return json(res, 200, body);
  }

  const productId = matchIdPath(pathname, '/api/products');
  if (productId) {
    const index = state.products.findIndex(p => p.id === productId);
    if (index === -1) return json(res, 404, { error: 'Product not found' });
    if (req.method === 'PUT') {
      const body = await parseBody(req);
      state.products[index] = Object.assign({}, state.products[index], body, { id: productId });
      writeState(state);
      return json(res, 200, state.products[index]);
    }
    if (req.method === 'DELETE') {
      state.products.splice(index, 1);
      writeState(state);
      return json(res, 200, { ok: true });
    }
  }

  json(res, 404, { error: 'API not found' });
}

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;

  if (pathname.startsWith('/api/')) {
    handleApi(req, res, pathname).catch(err => {
      json(res, 500, { error: err.message || 'Server error' });
    });
    return;
  }

  let filePath = path.join(ROOT, pathname === '/' ? 'index.html' : pathname.replace(/^\//, ''));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }
  serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
