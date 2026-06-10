const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { createInvite } = require('../controllers/inviteController');

const router = express.Router();

router.post('/', protect, adminOnly, createInvite);

module.exports = router;