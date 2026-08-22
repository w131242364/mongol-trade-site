const db = require('./_db');

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return send(res, 200, await db.getCategories());
    }

    if (req.method === 'POST') {
      db.requireAdmin(req);
      const body = await readBody(req);
      return send(res, 200, await db.createCategory(body));
    }

    const id = decodeURIComponent(req.query.id || '');
    if (!id) return send(res, 400, { error: 'Missing id' });

    if (req.method === 'PUT') {
      db.requireAdmin(req);
      const body = await readBody(req);
      return send(res, 200, await db.updateCategory(id, body));
    }

    if (req.method === 'DELETE') {
      db.requireAdmin(req);
      await db.deleteCategory(id);
      return send(res, 200, { ok: true });
    }

    return send(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    return send(res, err.statusCode || 500, { error: err.message || 'Server error' });
  }
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}
