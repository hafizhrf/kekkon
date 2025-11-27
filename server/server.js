import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { initializeDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import invitationRoutes from './routes/invitations.js';
import guestRoutes from './routes/guests.js';
import publicRoutes from './routes/public.js';
import uploadRoutes from './routes/upload.js';
import templateRoutes from './routes/templates.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

initializeDatabase();

// ===========================================
// SECURITY MIDDLEWARE
// ===========================================

// Helmet - Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "*"],
      mediaSrc: ["'self'", "data:", "blob:", "*"],
      fontSrc: ["'self'", "data:"],
    },
  },
}));

// Custom HPP - Prevent HTTP Parameter Pollution (Express 5 compatible)
// Takes only the last value if array is passed for a parameter
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (Array.isArray(req.body[key]) && !['gallery', 'gift_bank_accounts', 'gift_ewallets'].includes(key)) {
        req.body[key] = req.body[key][req.body[key].length - 1];
      }
    }
  }
  next();
});

// CORS Configuration
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ===========================================
// RATE LIMITING & DDoS PROTECTION
// ===========================================

// General API rate limiter - 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Terlalu banyak request, coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health',
});

// Strict limiter for auth routes - Prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Only 10 attempts per 15 minutes
  message: { error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Very strict limiter for registration - Prevent spam accounts
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Only 5 registrations per hour per IP
  message: { error: 'Terlalu banyak pendaftaran. Coba lagi dalam 1 jam.' },
});

// Limiter for public routes (viewing invitations) - More lenient
const publicLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: { error: 'Terlalu banyak request, coba lagi nanti.' },
});

// RSVP submission limiter - Prevent spam
const rsvpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 RSVPs per hour per IP
  message: { error: 'Terlalu banyak pengiriman RSVP. Coba lagi nanti.' },
});

// Upload limiter - Prevent storage abuse
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: { error: 'Terlalu banyak upload. Coba lagi dalam 1 jam.' },
});

// Speed limiter - Gradually slow down responses under heavy load
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Start slowing after 50 requests
  delayMs: (hits) => hits * 100, // Add 100ms delay per request above limit
  maxDelayMs: 5000, // Max 5 second delay
});

// ===========================================
// BODY PARSING WITH LIMITS
// ===========================================

// Limit JSON body size to prevent large payload attacks
app.use(express.json({ 
  limit: '1mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Limit URL-encoded body size
app.use(express.urlencoded({ 
  extended: true, 
  limit: '1mb' 
}));

// ===========================================
// CUSTOM XSS PROTECTION MIDDLEWARE
// ===========================================

// Keys to skip from XSS sanitization (URLs, HTML content, etc.)
const SKIP_SANITIZE_KEYS = [
  'story_text', 'rawBody',
  // URL fields - don't escape slashes
  'bride_photo', 'groom_photo', 'hero_image', 'music_url',
  'gallery', 'gallery_images', 'photo', 'image', 'url', 'src'
];

const sanitizeValue = (str) => {
  if (typeof str !== 'string') return str;
  // Only escape dangerous HTML characters, not slashes (needed for URLs)
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const sanitizeObject = (obj, skipKeys = []) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  for (const key in obj) {
    if (skipKeys.includes(key)) continue;
    
    // Skip URL-like values (contain http:// or /uploads/)
    if (typeof obj[key] === 'string' && 
        (obj[key].startsWith('http') || obj[key].startsWith('/uploads'))) {
      continue;
    }
    
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeValue(obj[key]);
    } else if (Array.isArray(obj[key])) {
      // Skip arrays of URLs (like gallery)
      if (obj[key].length > 0 && typeof obj[key][0] === 'string' && 
          (obj[key][0].startsWith('http') || obj[key][0].startsWith('/uploads'))) {
        continue;
      }
      obj[key] = obj[key].map(item => 
        typeof item === 'string' ? sanitizeValue(item) : 
        typeof item === 'object' ? sanitizeObject(item, skipKeys) : item
      );
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key], skipKeys);
    }
  }
  return obj;
};

// Only sanitize req.body (req.query and req.params are read-only in Express 5)
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body, SKIP_SANITIZE_KEYS);
  }
  next();
});

// ===========================================
// STATIC FILES
// ===========================================

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.webp')) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache
    }
  }
}));

// ===========================================
// ROUTES WITH SPECIFIC RATE LIMITERS
// ===========================================

// Apply speed limiter to all API routes
app.use('/api', speedLimiter);

// Auth routes with strict limiting
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/auth', generalLimiter, authRoutes);

// Protected routes
app.use('/api/invitations', generalLimiter, invitationRoutes);
app.use('/api', generalLimiter, guestRoutes);

// Public routes with more lenient limiting
app.use('/api/public', publicLimiter, publicRoutes);

// RSVP has its own limiter (handled in public routes)
app.use('/api/public/rsvp', rsvpLimiter);

// Upload routes with specific limiter
app.use('/api/upload', uploadLimiter, uploadRoutes);

// Templates - cacheable, less strict
app.use('/api/templates', publicLimiter, templateRoutes);

// ===========================================
// HEALTH CHECK (No rate limit)
// ===========================================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 Handler for API routes
app.use('/api', (req, res, next) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

// Global error handler
app.use((err, req, res, next) => {
  // Log error for debugging (in production, use proper logging)
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  
  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Akses ditolak' });
  }
  
  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Ukuran file terlalu besar (max 5MB)' });
    }
    return res.status(400).json({ error: err.message });
  }

  // JSON parsing error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Format JSON tidak valid' });
  }
  
  // Rate limit error
  if (err.status === 429) {
    return res.status(429).json({ error: 'Terlalu banyak request, coba lagi nanti' });
  }

  // Default error
  res.status(err.status || 500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Terjadi kesalahan server' 
      : err.message 
  });
});

// ===========================================
// GRACEFUL SHUTDOWN
// ===========================================

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ===========================================
// START SERVER
// ===========================================

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔒 Security middleware enabled`);
  console.log(`⚡ Rate limiting active\n`);
});
