const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const compressImage = async (req, res, next) => {
  if (!req.files && !req.file) return next();

  try {
    const processFile = async (file, prefix = '') => {
      const filename = `${prefix}${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
      const filepath = path.join(uploadsDir, filename);

      await sharp(file.buffer)
        .resize(600, 400, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 70 })
        .toFile(filepath);

      return { filename, path: filepath };
    };

    if (req.files) {
      if (req.files.itemImage) {
        const result = await processFile(req.files.itemImage[0], 'item-');
        req.files.itemImage[0].filename = result.filename;
        req.files.itemImage[0].path = result.path;
      }
      if (req.files.locationImage) {
        const result = await processFile(req.files.locationImage[0], 'location-');
        req.files.locationImage[0].filename = result.filename;
        req.files.locationImage[0].path = result.path;
      }
    } else if (req.file) {
      const result = await processFile(req.file, 'item-');
      req.file.filename = result.filename;
      req.file.path = result.path;
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, compressImage };