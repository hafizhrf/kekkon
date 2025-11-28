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
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Cloudflare Tunnel / Nginx reverse proxy
// This is needed for rate limiting to work correctly behind a proxy
app.set('trust proxy', 1);

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
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://static.cloudflareinsights.com", "https://pagead2.googlesyndication.com", "https://www.googletagservices.com"],
      scriptSrcElem: ["'self'", "'unsafe-inline'", "https://static.cloudflareinsights.com", "https://pagead2.googlesyndication.com", "https://www.googletagservices.com", "https://adservice.google.com"],
      imgSrc: ["'self'", "data:", "blob:", "*"],
      mediaSrc: ["'self'", "data:", "blob:", "*"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://cloudflareinsights.com", "https://pagead2.googlesyndication.com", "https://*.google.com"],
      frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com", "https://*.google.com", "https://googleads.g.doubleclick.net", "https://tpc.googlesyndication.com"],
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
    
    // In development, allow local network IPs (192.168.x.x, 10.x.x.x, etc.)
    if (process.env.NODE_ENV !== 'production') {
      const isLocalNetwork = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin);
      if (isLocalNetwork) {
        return callback(null, true);
      }
    }
    
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

const isDev = process.env.NODE_ENV !== 'production';

// Skip rate limiting in development for easier testing
const skipInDev = () => isDev;

// General API rate limiter - More lenient
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 200, // Higher in dev, 200 in production
  message: { error: 'Terlalu banyak request, coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health',
});

// Auth limiter - Per IP, resets on successful login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 100 : 20, // 20 attempts per 15 min per IP in production
  message: { error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Reset on successful login
});

// Registration limiter
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDev ? 100 : 10, // 10 registrations per hour per IP
  message: { error: 'Terlalu banyak pendaftaran. Coba lagi dalam 1 jam.' },
  skip: skipInDev,
});

// Public routes limiter - Very lenient for guests viewing invitations
const publicLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: isDev ? 500 : 120, // 120 requests per minute per IP
  message: { error: 'Terlalu banyak request, coba lagi nanti.' },
});

// RSVP limiter
const rsvpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDev ? 100 : 20, // 20 RSVPs per hour per IP
  message: { error: 'Terlalu banyak pengiriman RSVP. Coba lagi nanti.' },
});

// Upload limiter
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDev ? 200 : 100, // 100 uploads per hour
  message: { error: 'Terlalu banyak upload. Coba lagi dalam 1 jam.' },
});

// Speed limiter - Only in production
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: isDev ? 1000 : 100, // Start slowing after 100 requests in prod
  delayMs: (hits) => isDev ? 0 : hits * 50, // 50ms delay per request in prod
  maxDelayMs: 2000, // Max 2 second delay
  skip: skipInDev,
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

// Admin routes - must be before guestRoutes which uses authenticateToken globally
app.use('/api/admin', authLimiter, adminRoutes);

// Public routes - must be before guestRoutes which uses authenticateToken globally
app.use('/api/public', publicLimiter, publicRoutes);

// RSVP has its own limiter (handled in public routes)
app.use('/api/public/rsvp', rsvpLimiter);

// Protected routes
app.use('/api/invitations', generalLimiter, invitationRoutes);
app.use('/api', generalLimiter, guestRoutes);

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

// Serve client dist folder
app.use(express.static(path.join(__dirname, '../client/dist'), {
  maxAge: '1d',
  etag: true,
  setHeaders: (res, filePath) => {
    // Set correct MIME types
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 Handler for API routes
app.use('/api', (req, res, next) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

// SPA catch-all - serve index.html with dynamic OG tags for invitation pages
app.get('/{*path}', async (req, res) => {
  // In Express 5, wildcard params can be array or string
  const rawPath = req.params.path;
  const reqPath = Array.isArray(rawPath) ? rawPath.join('/') : (rawPath || '');
  
  // Check if this is an invitation page
  if (reqPath.startsWith('i/')) {
    const slug = reqPath.replace('i/', '');
    
    try {
      // Import db dynamically to avoid circular dependency
      const { default: db } = await import('./config/database.js');
      
      const invitation = db.prepare(`
        SELECT ic.bride_name, ic.groom_name, ic.wedding_date, ic.primary_color
        FROM invitations i
        LEFT JOIN invitation_content ic ON i.id = ic.invitation_id
        WHERE i.slug = ?
      `).get(slug);
      
      if (invitation) {
        const fs = await import('fs');
        const indexPath = path.join(__dirname, '../client/dist/index.html');
        let html = fs.readFileSync(indexPath, 'utf8');
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const ogImageUrl = `${baseUrl}/api/public/${slug}/og-image`;
        const pageUrl = `${baseUrl}/i/${slug}`;
        const title = `Undangan Pernikahan ${invitation.bride_name} & ${invitation.groom_name}`;
        const description = invitation.wedding_date 
          ? `Kami mengundang Anda untuk hadir di pernikahan kami pada ${new Date(invitation.wedding_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
          : 'Kami mengundang Anda untuk hadir di pernikahan kami';
        
        // Replace default meta tags with dynamic ones
        const ogTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
  </head>`;
        
        // Replace the closing </head> tag with our meta tags
        html = html.replace('</head>', ogTags);
        
        return res.send(html);
      }
    } catch (error) {
      console.error('Error generating OG tags:', error.message);
    }
  }
  
  // Default: serve index.html
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
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
