const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDir);
  },
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `avatar-${uniqueSuffix}${extension}`);
  },
});

const uploadAvatar = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (allowedMimeTypes.has(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(new Error('Only JPG, JPEG, PNG, and WEBP files are allowed'));
  },
}).single('avatar');

module.exports = {
  uploadAvatar,
  uploadsDir,
};