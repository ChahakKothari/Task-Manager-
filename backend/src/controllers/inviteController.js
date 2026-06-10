const InviteCode = require('../models/InviteCode');
const { generateInviteCode, hashInviteCode } = require('../utils/inviteCode');

const createInvite = async (req, res) => {
  const expiresInDays = Number(req.body.expiresInDays ?? 7);

  if (!Number.isFinite(expiresInDays) || expiresInDays < 1 || expiresInDays > 30) {
    return res.status(400).json({ message: 'expiresInDays must be between 1 and 30' });
  }

  const plainCode = generateInviteCode();
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

  const invite = await InviteCode.create({
    codeHash: hashInviteCode(plainCode),
    createdBy: req.user._id,
    expiresAt,
  });

  res.status(201).json({
    invite: {
      id: invite._id,
      code: plainCode,
      expiresAt: invite.expiresAt,
      createdAt: invite.createdAt,
    },
  });
};

module.exports = {
  createInvite,
};