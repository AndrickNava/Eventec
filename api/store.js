const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const users = new Map([
  ['admin', { username: 'admin', passwordHash: hashPassword('admin123'), role: 'admin' }]
]);

function listUsers() {
  return Array.from(users.values()).map(({ username, role }, index) => ({ id: index + 1, username, role }));
}

function getUser(username) {
  return users.get(username);
}

function saveUser(username, password, role) {
  users.set(username, { username, passwordHash: hashPassword(password), role });
}

function updateUser(currentUsername, username, password, role) {
  const user = users.get(currentUsername);
  if (!user) return false;
  users.delete(currentUsername);
  users.set(username, { username, passwordHash: password ? hashPassword(password) : user.passwordHash, role });
  return true;
}

function deleteUser(username) {
  return users.delete(username);
}

module.exports = { deleteUser, getUser, hashPassword, listUsers, saveUser, updateUser };