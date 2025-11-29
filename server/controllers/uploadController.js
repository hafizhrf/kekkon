import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../uploads');
const imagesDir = path.join(uploadsDir, 'images');
const musicDir = path.join(uploadsDir, 'music');

[uploadsDir, imagesDir, musicDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const imageStorage = multer.memoryStorage();
const musicStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, musicDir),
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'), false);
  }
};

const musicFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP3 and WAV are allowed.'), false);
  }
};

export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('image');

export const uploadMusic = multer({
  storage: musicStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: musicFilter,
}).single('music');

export async function handleImageUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(imagesDir, filename);

    await sharp(req.file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filepath);

    res.json({
      message: 'Image uploaded successfully',
      url: `/uploads/images/${filename}`,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
}

export function handleMusicUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No music file provided' });
    }

    res.json({
      message: 'Music uploaded successfully',
      url: `/uploads/music/${req.file.filename}`,
    });
  } catch (error) {
    console.error('Music upload error:', error);
    res.status(500).json({ error: 'Failed to upload music' });
  }
}
