const express = require('express');
const { getUsers, updateMyAvatar } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);
router.patch('/me/avatar', uploadAvatar, updateMyAvatar);
router.use(adminOnly);
router.get('/', getUsers);

module.exports = router;
