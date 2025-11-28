import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Support Railway volume or local database
const defaultDbPath = path.join(__dirname, '../../database/wedding.db');
const dbPath = process.env.DATABASE_PATH || defaultDbPath;

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
console.log(`📦 Database: ${dbPath}`);

// Optimize SQLite for performance
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = 10000');
db.pragma('temp_store = MEMORY');
db.pragma('wal_autocheckpoint = 1000');

// Periodic WAL checkpoint to prevent lag
let checkpointInterval;
const startCheckpointInterval = () => {
  if (checkpointInterval) clearInterval(checkpointInterval);
  checkpointInterval = setInterval(() => {
    try {
      db.pragma('wal_checkpoint(TRUNCATE)');
    } catch (err) {
      console.error('WAL checkpoint error:', err.message);
    }
  }, 5 * 60 * 1000); // Every 5 minutes
};
startCheckpointInterval();

// Cleanup on process exit
process.on('exit', () => {
  if (checkpointInterval) clearInterval(checkpointInterval);
  try {
    db.pragma('wal_checkpoint(TRUNCATE)');
    db.close();
  } catch (err) {}
});
process.on('SIGINT', () => process.exit());
process.on('SIGTERM', () => process.exit());

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS invitations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      template_id TEXT NOT NULL DEFAULT 'geometric-modern',
      status TEXT DEFAULT 'draft',
      primary_color TEXT DEFAULT '#D4A373',
      secondary_color TEXT DEFAULT '#FEFAE0',
      font_family TEXT DEFAULT 'playfair',
      enable_rsvp INTEGER DEFAULT 1,
      enable_messages INTEGER DEFAULT 1,
      enable_countdown INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME DEFAULT (datetime('now', '+3 months')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS invitation_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invitation_id INTEGER NOT NULL UNIQUE,
      is_muslim INTEGER DEFAULT 1,
      bride_name TEXT NOT NULL,
      bride_parents TEXT,
      bride_photo TEXT,
      bride_instagram TEXT,
      groom_name TEXT NOT NULL,
      groom_parents TEXT,
      groom_photo TEXT,
      groom_instagram TEXT,
      wedding_date TEXT NOT NULL,
      akad_time TEXT,
      akad_venue TEXT,
      akad_address TEXT,
      akad_lat REAL,
      akad_lng REAL,
      reception_time TEXT,
      reception_venue TEXT,
      reception_address TEXT,
      reception_lat REAL,
      reception_lng REAL,
      music_url TEXT,
      story_text TEXT,
      gallery_images TEXT,
      custom_fields TEXT,
      gift_bank_accounts TEXT,
      gift_ewallets TEXT,
      gift_address TEXT,
      enable_gift INTEGER DEFAULT 1,
      FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS guests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invitation_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      rsvp_status TEXT DEFAULT 'pending',
      attendance_count INTEGER DEFAULT 1,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      preview_url TEXT,
      category TEXT,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invitation_id INTEGER NOT NULL,
      viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      guest_name TEXT,
      ip_address TEXT,
      user_agent TEXT,
      FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
    );

    -- Indexes for faster queries
    CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON invitations(user_id);
    CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(slug);
    CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
    CREATE INDEX IF NOT EXISTS idx_invitation_content_invitation_id ON invitation_content(invitation_id);
    CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON guests(invitation_id);
    CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(invitation_id, name);
    CREATE INDEX IF NOT EXISTS idx_page_views_invitation_id ON page_views(invitation_id);
  `);

  // Migration: Add expires_at column if not exists
  try {
    const tableInfo = db.prepare("PRAGMA table_info(invitations)").all();
    const hasExpiresAt = tableInfo.some(col => col.name === 'expires_at');
    if (!hasExpiresAt) {
      db.exec("ALTER TABLE invitations ADD COLUMN expires_at DATETIME DEFAULT (datetime('now', '+3 months'))");
      db.exec("UPDATE invitations SET expires_at = datetime(created_at, '+3 months') WHERE expires_at IS NULL");
      console.log('Migration: Added expires_at column to invitations');
    }
  } catch (err) {
    console.log('Migration check for expires_at:', err.message);
  }

  const templatesExist = db.prepare('SELECT COUNT(*) as count FROM templates').get();
  if (templatesExist.count === 0) {
    const insertTemplate = db.prepare(`
      INSERT INTO templates (id, name, description, category, is_active)
      VALUES (?, ?, ?, ?, 1)
    `);

    const templates = [
      ['geometric-modern', 'Geometric Modern', 'Clean lines with abstract geometric shapes and bold colors', 'geometric'],
      ['minimalist-elegant', 'Minimalist Elegant', 'White space with serif typography and monochrome palette', 'minimalist'],
      ['colorful-playful', 'Colorful Playful', 'Vibrant gradients with rounded shapes and fun animations', 'colorful'],
    ];

    templates.forEach(t => insertTemplate.run(...t));
  }

  console.log('Database initialized successfully');
}

export default db;
