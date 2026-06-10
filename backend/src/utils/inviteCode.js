const crypto = require('crypto');

const generateInviteCode = () => crypto.randomBytes(16).toString('hex');

const hashInviteCode = (code) => crypto.createHash('sha256').update(code.trim()).digest('hex');

module.exports = {
  generateInviteCode,
  hashInviteCode,
};