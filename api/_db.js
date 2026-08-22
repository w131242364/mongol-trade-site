const { Pool } = require('pg');

const DEFAULT_PASSWORD = 'WDPHL131242364';
const DEFAULT_CATEGORIES = [
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
    features_mn: ['VHF / UHF давтамж сонголт', 'Өндөр хүчин чадал, урт зайд холбоо', 'Дамжуулах станцтай холбогдох боломжтой'],
    sort: 3
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
    features_mn: ['Нимгэн бие, хөнгөн зөөврийн', 'Урт наслалттай баттерей, бүтэн өдөр ашиглах', 'Ус, тоосноос хамгаалсан дизайны'],
    sort: 2
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
    features_mn: ['1080P / 4K өндөр нарийвчлалт', 'Инфракрас шөнийн дүрс, 24 цаг хяналт', 'Утасны апп-аар алсаас шууд харах'],
    sort: 1
  }
];

const DEFAULT_PRODUCTS = [
  {
    id: 'p001',
    category: 'cat_vehicle_radio',
    name_zh: 'VHF 车载电台 KT-8900',
    name_mn: 'VHF Машины станц KT-8900',
    price: '¥1,280',
    image: '🚗',
    desc_zh: 'VHF 双段车台，25W 大功率，支持跨段收发，适合车队长途通讯。',
    desc_mn: 'VHF хос давтамжтай машин станц, 25W өндөр хүчин чадал, давтамж хооронд шилжих боломжтой, урт зайд холбоонд тохиромжтой。',
    sort: 1
  },
  {
    id: 'p002',
    category: 'cat_walkie_talkie',
    name_zh: '数字对讲机 Baofeng UV-5R',
    name_mn: 'Тоон гар станц Baofeng UV-5R',
    price: '¥120',
    image: '📻',
    desc_zh: '经典双段对讲机，5W 功率，1800mAh 电池，FM 收音，性价比之选。',
    desc_mn: 'Сонгодог хос давтамжтай гар станц, 5W хүчин чадал, 1800mAh баттерей, FM радио, өндөр чанартай сонголт。',
    sort: 1
  },
  {
    id: 'p003',
    category: 'cat_camera',
    name_zh: '高清球机摄像头 HIK-DS2CD',
    name_mn: 'Өндөр нарийвчлалтай PTZ камер HIK-DS2CD',
    price: '¥450',
    image: '📹',
    desc_zh: '4K 球形摄像头，20倍光学变焦，红外夜视 100 米，支持手机远程。',
    desc_mn: '4K PTZ камер, 20x оптик zoom, инфракар шөнийн дүрс 100 метр, утаснаас алсаас харах боломжтой。',
    sort: 1
  }
];

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.VERCEL_POSTGRES_URL;

if (!connectionString) {
  console.warn('No Postgres connection string found. Set POSTGRES_URL or DATABASE_URL.');
}

const pool = global.__mongolTradePool || new Pool({
  connectionString: connectionString || undefined,
  ssl: connectionString ? { rejectUnauthorized: false } : undefined
});

if (!global.__mongolTradePool) {
  global.__mongolTradePool = pool;
}

let readyPromise = null;

function normalizeCategory(row) {
  return {
    id: row.id,
    name_zh: row.name_zh,
    name_mn: row.name_mn,
    icon: row.icon,
    color: row.color,
    color2: row.color2,
    desc_zh: row.desc_zh,
    desc_mn: row.desc_mn,
    features_zh: Array.isArray(row.features_zh) ? row.features_zh : [],
    features_mn: Array.isArray(row.features_mn) ? row.features_mn : [],
    sort: row.sort || 0
  };
}

function normalizeProduct(row) {
  return {
    id: row.id,
    category: row.category,
    name_zh: row.name_zh,
    name_mn: row.name_mn,
    price: row.price,
    image: row.image,
    desc_zh: row.desc_zh,
    desc_mn: row.desc_mn,
    sort: row.sort || 0
  };
}

async function query(text, params) {
  return pool.query(text, params);
}

async function ensureSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name_zh TEXT NOT NULL,
      name_mn TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      color2 TEXT,
      desc_zh TEXT,
      desc_mn TEXT,
      features_zh JSONB NOT NULL DEFAULT '[]'::jsonb,
      features_mn JSONB NOT NULL DEFAULT '[]'::jsonb,
      sort INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      name_zh TEXT NOT NULL,
      name_mn TEXT NOT NULL,
      price TEXT,
      image TEXT,
      desc_zh TEXT,
      desc_mn TEXT,
      sort INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function seedIfEmpty() {
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM categories');
  if (rows[0] && rows[0].count > 0) return;

  for (const cat of DEFAULT_CATEGORIES) {
    await query(
      `
        INSERT INTO categories (id, name_zh, name_mn, icon, color, color2, desc_zh, desc_mn, features_zh, features_mn, sort)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11)
        ON CONFLICT (id) DO NOTHING
      `,
      [
        cat.id,
        cat.name_zh,
        cat.name_mn,
        cat.icon,
        cat.color,
        cat.color2,
        cat.desc_zh,
        cat.desc_mn,
        JSON.stringify(cat.features_zh || []),
        JSON.stringify(cat.features_mn || []),
        cat.sort || 0
      ]
    );
  }

  for (const product of DEFAULT_PRODUCTS) {
    await query(
      `
        INSERT INTO products (id, category, name_zh, name_mn, price, image, desc_zh, desc_mn, sort)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (id) DO NOTHING
      `,
      [
        product.id,
        product.category,
        product.name_zh,
        product.name_mn,
        product.price,
        product.image,
        product.desc_zh,
        product.desc_mn,
        product.sort || 0
      ]
    );
  }
}

async function ensureReady() {
  if (!readyPromise) {
    readyPromise = (async () => {
      await ensureSchema();
      await seedIfEmpty();
    })();
  }
  await readyPromise;
}

async function resetAll() {
  await ensureSchema();
  await query('TRUNCATE TABLE products, categories RESTART IDENTITY');
  readyPromise = null;
  await ensureReady();
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

function requireAdmin(req) {
  const provided = req.headers['x-admin-password'] || req.headers['x-admin-token'] || '';
  if (!provided || provided !== getAdminPassword()) {
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    throw error;
  }
}

async function getCategories() {
  await ensureReady();
  const { rows } = await query('SELECT * FROM categories ORDER BY sort DESC, created_at ASC');
  return rows.map(normalizeCategory);
}

async function getProducts() {
  await ensureReady();
  const { rows } = await query('SELECT * FROM products ORDER BY sort DESC, created_at ASC');
  return rows.map(normalizeProduct);
}

async function createCategory(data) {
  await ensureReady();
  const nextSort = Number.isFinite(Number(data.sort)) ? Number(data.sort) : Date.now();
  const id = data.id || `cat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const { rows } = await query(
    `
      INSERT INTO categories (id, name_zh, name_mn, icon, color, color2, desc_zh, desc_mn, features_zh, features_mn, sort)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11)
      RETURNING *
    `,
    [
      id,
      data.name_zh || '',
      data.name_mn || '',
      data.icon || '📦',
      data.color || '#1a5a9e',
      data.color2 || '#2d7fd4',
      data.desc_zh || '',
      data.desc_mn || '',
      JSON.stringify(data.features_zh || []),
      JSON.stringify(data.features_mn || []),
      nextSort
    ]
  );
  return normalizeCategory(rows[0]);
}

async function updateCategory(id, data) {
  await ensureReady();
  const { rows } = await query(
    `
      UPDATE categories
      SET name_zh = COALESCE($2, name_zh),
          name_mn = COALESCE($3, name_mn),
          icon = COALESCE($4, icon),
          color = COALESCE($5, color),
          color2 = COALESCE($6, color2),
          desc_zh = COALESCE($7, desc_zh),
          desc_mn = COALESCE($8, desc_mn),
          features_zh = COALESCE($9::jsonb, features_zh),
          features_mn = COALESCE($10::jsonb, features_mn),
          sort = COALESCE($11, sort),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [
      id,
      data.name_zh,
      data.name_mn,
      data.icon,
      data.color,
      data.color2,
      data.desc_zh,
      data.desc_mn,
      data.features_zh ? JSON.stringify(data.features_zh) : null,
      data.features_mn ? JSON.stringify(data.features_mn) : null,
      Number.isFinite(Number(data.sort)) ? Number(data.sort) : null
    ]
  );
  return rows[0] ? normalizeCategory(rows[0]) : null;
}

async function deleteCategory(id) {
  await ensureReady();
  await query('DELETE FROM categories WHERE id = $1', [id]);
  return true;
}

async function createProduct(data) {
  await ensureReady();
  const nextSort = Number.isFinite(Number(data.sort)) ? Number(data.sort) : Date.now();
  const id = data.id || `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const { rows } = await query(
    `
      INSERT INTO products (id, category, name_zh, name_mn, price, image, desc_zh, desc_mn, sort)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
    `,
    [
      id,
      data.category || '',
      data.name_zh || '',
      data.name_mn || '',
      data.price || '',
      data.image || '📦',
      data.desc_zh || '',
      data.desc_mn || '',
      nextSort
    ]
  );
  return normalizeProduct(rows[0]);
}

async function updateProduct(id, data) {
  await ensureReady();
  const { rows } = await query(
    `
      UPDATE products
      SET category = COALESCE($2, category),
          name_zh = COALESCE($3, name_zh),
          name_mn = COALESCE($4, name_mn),
          price = COALESCE($5, price),
          image = COALESCE($6, image),
          desc_zh = COALESCE($7, desc_zh),
          desc_mn = COALESCE($8, desc_mn),
          sort = COALESCE($9, sort),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [
      id,
      data.category,
      data.name_zh,
      data.name_mn,
      data.price,
      data.image,
      data.desc_zh,
      data.desc_mn,
      Number.isFinite(Number(data.sort)) ? Number(data.sort) : null
    ]
  );
  return rows[0] ? normalizeProduct(rows[0]) : null;
}

async function deleteProduct(id) {
  await ensureReady();
  await query('DELETE FROM products WHERE id = $1', [id]);
  return true;
}

module.exports = {
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  ensureReady,
  resetAll,
  requireAdmin,
  getAdminPassword,
  getCategories,
  getProducts,
  createCategory,
  updateCategory,
  deleteCategory,
  createProduct,
  updateProduct,
  deleteProduct
};
