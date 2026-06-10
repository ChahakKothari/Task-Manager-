const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const removeOldAvatar = (avatarUrl) => {
  if (!avatarUrl || !avatarUrl.startsWith('/uploads/')) {
    return;
  }

  const avatarPath = path.join(process.cwd(), avatarUrl.replace(/^\//, ''));

  if (fs.existsSync(avatarPath)) {
    fs.unlinkSync(avatarPath);
  }
};

const getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.json({
    users: users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl || '',
    })),
  });
};

const updateMyAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please select an image file' });
  }

  const avatarUrl = `/uploads/${req.file.filename}`;
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  removeOldAvatar(req.user.avatarUrl);

  res.json({
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      avatarUrl: updatedUser.avatarUrl || '',
    },
  });
};

module.exports = { getUsers, updateMyAvatar };
