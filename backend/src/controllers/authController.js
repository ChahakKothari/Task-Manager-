const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InviteCode = require('../models/InviteCode');
const { hashInviteCode } = require('../utils/inviteCode');

const createToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  avatarUrl: user.avatarUrl || '',
});

const registerUser = async (req, res) => {
  const { name, email, password, inviteCode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const normalizedInviteCode = typeof inviteCode === 'string' ? inviteCode.trim() : '';
  let inviteRecord = null;
  let role = 'user';

  if (normalizedInviteCode) {
    const inviteHash = hashInviteCode(normalizedInviteCode);
    inviteRecord = await InviteCode.findOne({
      codeHash: inviteHash,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!inviteRecord) {
      return res.status(400).json({ message: 'Invalid or expired invite code' });
    }

    role = 'admin';
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
  });

  if (inviteRecord) {
    await InviteCode.updateOne(
      { _id: inviteRecord._id, usedAt: null },
      {
        $set: {
          usedAt: new Date(),
          usedBy: user._id,
          usedByEmail: user.email,
        },
      }
    );
  }

  res.status(201).json({
    user: sanitizeUser(user),
    token: createToken(user._id),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    user: sanitizeUser(user),
    token: createToken(user._id),
  });
};

const getCurrentUser = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
