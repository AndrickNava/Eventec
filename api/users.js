const { deleteUser, listUsers, saveUser, updateUser } = require('./store');

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method === 'GET') {
    res.status(200).json({ success: true, users: listUsers() });
    return;
  }

  let payload = {};
  try {
    const rawBody = await readRequestBody(req);
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch (error) {
    res.status(400).json({ success: false, message: 'No se pudo leer el cuerpo de la solicitud.' });
    return;
  }

  if (req.method === 'POST') {
    const username = (payload.username || '').trim();
    const password = (payload.password || '').trim();
    const role = (payload.role || 'user').trim();
    if (!username || !password) {
      res.status(400).json({ success: false, message: 'Usuario y contraseña requeridos.' });
      return;
    }
    saveUser(username, password, role);
    res.status(200).json({ success: true, message: `Usuario agregado correctamente: ${username}` });
    return;
  }

  if (req.method === 'PUT') {
    const currentUsername = (payload.currentUsername || payload.username || '').trim();
    const username = (payload.username || '').trim();
    const password = (payload.password || '').trim();
    const role = (payload.role || 'user').trim();
    if (!currentUsername || !username) {
      res.status(400).json({ success: false, message: 'Datos incompletos.' });
      return;
    }
    if (!updateUser(currentUsername, username, password, role)) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
      return;
    }
    res.status(200).json({ success: true, message: `Usuario actualizado correctamente: ${username}` });
    return;
  }

  if (req.method === 'DELETE') {
    const username = (payload.username || '').trim();
    if (!username) {
      res.status(400).json({ success: false, message: 'Usuario requerido.' });
      return;
    }
    if (!deleteUser(username)) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
      return;
    }
    res.status(200).json({ success: true, message: 'Usuario eliminado correctamente' });
    return;
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
};
