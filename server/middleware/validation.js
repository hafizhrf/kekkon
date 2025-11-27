import { body, param, query, validationResult } from 'express-validator';

// ===========================================
// VALIDATION HELPERS
// ===========================================

// Sanitize HTML but allow safe tags for story_text
const sanitizeHtml = (html) => {
  if (!html) return '';
  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, 'data-blocked:');
};

// ===========================================
// AUTH VALIDATIONS
// ===========================================

export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email tidak valid'),
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password minimal 6 karakter'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Nama maksimal 100 karakter'),
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email tidak valid'),
  body('password')
    .notEmpty()
    .isLength({ max: 128 })
    .withMessage('Password wajib diisi'),
];

// ===========================================
// INVITATION VALIDATIONS
// ===========================================

export const validateInvitation = [
  body('bride_name')
    .trim()
    .notEmpty()
    .isLength({ max: 100 })
    .escape()
    .withMessage('Nama mempelai wanita wajib diisi (max 100 karakter)'),
  body('groom_name')
    .trim()
    .notEmpty()
    .isLength({ max: 100 })
    .escape()
    .withMessage('Nama mempelai pria wajib diisi (max 100 karakter)'),
  body('wedding_date')
    .notEmpty()
    .isISO8601()
    .withMessage('Tanggal pernikahan tidak valid'),
  body('bride_parents')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .escape(),
  body('groom_parents')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .escape(),
  body('akad_venue')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .escape(),
  body('akad_address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .escape(),
  body('reception_venue')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .escape(),
  body('reception_address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .escape(),
  body('story_text')
    .optional()
    .customSanitizer(sanitizeHtml)
    .isLength({ max: 5000 })
    .withMessage('Story text maksimal 5000 karakter'),
  body('template_id')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Template ID tidak valid'),
  body('primary_color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Warna harus dalam format hex (#RRGGBB)'),
  body('secondary_color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Warna harus dalam format hex (#RRGGBB)'),
  body('gallery_images')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Maksimal 10 foto gallery'),
  body('gift_bank_accounts')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maksimal 5 rekening bank'),
  body('gift_ewallets')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maksimal 5 e-wallet'),
  body('gift_address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .escape(),
];

// ===========================================
// RSVP VALIDATIONS
// ===========================================

export const validateRSVP = [
  body('name')
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 100 })
    .escape()
    .withMessage('Nama wajib diisi (2-100 karakter)'),
  body('rsvp_status')
    .isIn(['attending', 'not_attending'])
    .withMessage('Status kehadiran tidak valid'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .escape()
    .withMessage('Pesan maksimal 1000 karakter'),
  body('attendance_count')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Jumlah tamu 0-10 orang'),
];

// ===========================================
// GUEST VALIDATIONS
// ===========================================

export const validateGuest = [
  body('name')
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 100 })
    .escape()
    .withMessage('Nama tamu wajib diisi (2-100 karakter)'),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .matches(/^[0-9+\-\s]*$/)
    .withMessage('Nomor telepon tidak valid'),
];

export const validateBulkGuests = [
  body('guests')
    .isArray({ min: 1, max: 500 })
    .withMessage('Minimal 1 tamu, maksimal 500 tamu'),
  body('guests.*.name')
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 100 })
    .escape(),
  body('guests.*.phone')
    .optional()
    .trim()
    .isLength({ max: 20 }),
];

// ===========================================
// PARAM VALIDATIONS
// ===========================================

export const validateIdParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID tidak valid'),
];

export const validateSlugParam = [
  param('slug')
    .trim()
    .isLength({ min: 1, max: 100 })
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug tidak valid'),
];

// ===========================================
// ERROR HANDLER
// ===========================================

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    return res.status(400).json({ 
      error: 'Validasi gagal',
      details: errorMessages 
    });
  }
  next();
}

// ===========================================
// SQL INJECTION PREVENTION
// ===========================================

// Additional check for SQL injection patterns
export function checkSqlInjection(req, res, next) {
  const sqlPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /UNION(\s+)ALL(\s+)SELECT/i,
    /UNION(\s+)SELECT/i,
    /INSERT(\s+)INTO/i,
    /DELETE(\s+)FROM/i,
    /DROP(\s+)TABLE/i,
    /UPDATE(\s+)\w+(\s+)SET/i,
  ];

  const checkValue = (value) => {
    if (typeof value === 'string') {
      for (const pattern of sqlPatterns) {
        if (pattern.test(value)) {
          return true;
        }
      }
    }
    return false;
  };

  const checkObject = (obj) => {
    if (!obj) return false;
    for (const key in obj) {
      if (checkValue(obj[key])) return true;
      if (typeof obj[key] === 'object') {
        if (checkObject(obj[key])) return true;
      }
    }
    return false;
  };

  if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
    console.warn(`[SECURITY] SQL injection attempt detected from ${req.ip}`);
    return res.status(400).json({ error: 'Invalid input detected' });
  }

  next();
}
