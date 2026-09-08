const { getUser, hashPassword } = require('./store');

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  let body;
  try {
    body = await readRequestBody(req);
  } catch (error) {
    res.status(400).json({ success: false, message: 'No se pudo leer el cuerpo de la solicitud.' });
    return;
  }

  const params = new URLSearchParams(body);
  const username = params.get('username') || '';
  const password = params.get('password') || '';
  const user = getUser(username);

  if (!user) {
    res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    return;
  }
  if (hashPassword(password) !== user.passwordHash) {
    res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    return;
  }

  res.status(200).json({ success: true, username: user.username, role: user.role });
};
