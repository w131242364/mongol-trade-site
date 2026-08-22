const db = require('./_db');

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
    db.requireAdmin(req);
    await db.resetAll();
    return send(res, 200, { ok: true });
  } catch (err) {
    return send(res, err.statusCode || 500, { error: err.message || 'Server error' });
  }
};
